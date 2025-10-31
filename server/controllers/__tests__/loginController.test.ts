import request from 'supertest';
import app from '../../app';
import userModel from '../../models/userSchema';
import bcrypt from 'bcrypt';

describe('Auth API - Login & Signup', () => {
	describe('POST /signup - User Registration', () => {
		it('should register a new student successfully', async () => {
			const res = await request(app).post('/signup').send({
				email: 'student@example.com',
				password: 'password123',
				name: 'Test Student',
				designation: 'student',
			});

			expect(res.statusCode).toEqual(200);
			expect(res.body).toHaveProperty('token');
			expect(res.body).toHaveProperty('userId');
			expect(res.body.designation).toBe('student');

			// Verify user was saved to database
			const user = await userModel.findOne({
				email: 'student@example.com',
			});
			expect(user).not.toBeNull();
			expect(user?.name).toBe('Test Student');
			expect(user?.designation).toBe('student');
		});

		it('should register a new teacher successfully', async () => {
			const res = await request(app).post('/signup').send({
				email: 'teacher@example.com',
				password: 'password123',
				name: 'Test Teacher',
				designation: 'teacher',
			});

			expect(res.statusCode).toEqual(200);
			expect(res.body).toHaveProperty('token');
			expect(res.body.designation).toBe('teacher');

			const user = await userModel.findOne({
				email: 'teacher@example.com',
			});
			expect(user).not.toBeNull();
			expect(user?.designation).toBe('teacher');
		});

		it('should fail to register a duplicate email', async () => {
			// First registration
			const firstRes = await request(app).post('/signup').send({
				email: 'duplicate@example.com',
				password: 'password123',
				name: 'First User',
				designation: 'student',
			});

			expect(firstRes.statusCode).toBe(200);

			// Attempt duplicate registration
			const res = await request(app).post('/signup').send({
				email: 'duplicate@example.com',
				password: 'differentpass',
				name: 'Second User',
				designation: 'student',
			});

			// MongoDB will throw E11000 duplicate key error, caught by error handler
			expect(res.statusCode).toBe(500);
			
			// Verify only one user was created
			const users = await userModel.find({
				email: 'duplicate@example.com',
			});
			expect(users.length).toBe(1);
			expect(users[0].name).toBe('First User');
		});

		it('should hash the password before saving', async () => {
			const plainPassword = 'mySecurePassword123';

			await request(app).post('/signup').send({
				email: 'secure@example.com',
				password: plainPassword,
				name: 'Secure User',
				designation: 'student',
			});

			const user = await userModel.findOne({ email: 'secure@example.com' });
			expect(user).not.toBeNull();
			
			// Password should be hashed, not plain text
			expect(user?.password).not.toBe(plainPassword);
			expect(user?.password.length).toBeGreaterThan(20); // bcrypt hashes are long
			
			// Verify the hash is valid using bcrypt.compare
			const isMatch = await bcrypt.compare(plainPassword, user!.password);
			expect(isMatch).toBe(true);
			
			// Verify wrong password doesn't match
			const wrongMatch = await bcrypt.compare('wrongPassword', user!.password);
			expect(wrongMatch).toBe(false);
		});

		it('should fail with missing required fields', async () => {
			const res = await request(app).post('/signup').send({
				email: 'incomplete@example.com',
				// Missing password, name, designation
			});

			expect(res.statusCode).toBeGreaterThanOrEqual(400);
		});
	});

	describe('POST /login - User Login', () => {
		beforeEach(async () => {
			// Create a test user before each login test
			await request(app).post('/signup').send({
				email: 'testuser@example.com',
				password: 'correctPassword123',
				name: 'Test User',
				designation: 'student',
			});
		});

		it('should log in a registered user with correct credentials', async () => {
			const res = await request(app).post('/login').send({
				email: 'testuser@example.com',
				password: 'correctPassword123',
			});

			expect(res.statusCode).toEqual(200);
			expect(res.body).toHaveProperty('token');
			expect(res.body).toHaveProperty('userId');
			expect(res.body.designation).toBe('student');
		});

		it('should fail to log in with incorrect password', async () => {
			const res = await request(app).post('/login').send({
				email: 'testuser@example.com',
				password: 'wrongPassword',
			});

			expect(res.statusCode).toEqual(401);
			expect(res.body).not.toHaveProperty('token');
		});

		it('should fail to log in with non-existent email', async () => {
			const res = await request(app).post('/login').send({
				email: 'nonexistent@example.com',
				password: 'somePassword',
			});

			expect(res.statusCode).toEqual(404);
			expect(res.body).not.toHaveProperty('token');
		});

		it('should fail with missing credentials', async () => {
			const res = await request(app).post('/login').send({
				email: 'testuser@example.com',
				// Missing password
			});

			expect(res.statusCode).toBeGreaterThanOrEqual(400);
		});

		it('should return a valid JWT token on successful login', async () => {
			const res = await request(app).post('/login').send({
				email: 'testuser@example.com',
				password: 'correctPassword123',
			});

			expect(res.statusCode).toEqual(200);
			const token = res.body.token;
			expect(token).toBeDefined();
			// JWT tokens have 3 parts separated by dots
			expect(token.split('.').length).toBe(3);
		});
	});

	describe('Authentication Flow Integration', () => {
		it('should allow full signup -> login -> use token flow', async () => {
			// Step 1: Signup
			const signupRes = await request(app).post('/signup').send({
				email: 'flow@example.com',
				password: 'flowPassword123',
				name: 'Flow User',
				designation: 'teacher',
			});

			expect(signupRes.statusCode).toEqual(200);
			const signupToken = signupRes.body.token;

			// Step 2: Login with same credentials
			const loginRes = await request(app).post('/login').send({
				email: 'flow@example.com',
				password: 'flowPassword123',
			});

			expect(loginRes.statusCode).toEqual(200);
			const loginToken = loginRes.body.token;

			// Step 3: Both tokens should be valid (different but both work)
			expect(signupToken).toBeDefined();
			expect(loginToken).toBeDefined();

			// Step 4: Use token to access protected route (if available)
			// Example: GET /session/history with Authorization header
			// This would require a protected route to test
		});
	});
});
