import request from 'supertest';
import app from '../../app';
import sessionModel from '../../models/sessionSchema';
import sessionDetailsModel from '../../models/sessionDetailsSchema';

describe('Session API - Session Management', () => {
	let studentToken: string;
	let studentId: string;
	let teacherToken: string;

	beforeEach(async () => {
		// Create and authenticate a student user
		const studentRes = await request(app).post('/signup').send({
			email: 'student@test.com',
			password: 'password123',
			name: 'Test Student',
			designation: 'student',
		});
		studentToken = studentRes.body.token;
		studentId = studentRes.body.userId;

		// Create and authenticate a teacher user
		const teacherRes = await request(app).post('/signup').send({
			email: 'teacher@test.com',
			password: 'password123',
			name: 'Test Teacher',
			designation: 'teacher',
		});
		teacherToken = teacherRes.body.token;
		// teacherId not used but kept for future tests
	});

	describe('POST /session/create - Create Session', () => {
		it('should create a new session with authenticated user', async () => {
			const res = await request(app)
				.post('/session/create')
				.set('Authorization', `Bearer ${studentToken}`)
				.send({
					sessionName: 'Test Session 1',
				});

			expect(res.statusCode).toEqual(200);
			expect(res.body).toHaveProperty('sessionId');

			// Verify session was created in database
			const session = await sessionModel.findById(res.body.sessionId);
			expect(session).not.toBeNull();
			expect(session?.sessionName).toBe('Test Session 1');
			expect(session?.creator.toString()).toBe(studentId);
		});

		it('should create session details with driver role for creator', async () => {
			const res = await request(app)
				.post('/session/create')
				.set('Authorization', `Bearer ${studentToken}`)
				.send({
					sessionName: 'Session with Details',
				});

			expect(res.statusCode).toEqual(200);

			// Verify session details were created
			const sessionDetails = await sessionDetailsModel.findOne({
				sessionID: res.body.sessionId,
			});
			expect(sessionDetails).not.toBeNull();
			expect(sessionDetails?.userOne.userId.toString()).toBe(studentId);
			expect(sessionDetails?.userOne.userRole).toBe('Driver');
			expect(sessionDetails?.userOne.userStatus).toBe('offline');
		});

		it('should fail without authentication token', async () => {
			const res = await request(app).post('/session/create').send({
				sessionName: 'Unauthorized Session',
			});

			expect(res.statusCode).toBeGreaterThanOrEqual(400);
			expect(res.body).not.toHaveProperty('sessionId');
		});

		it('should fail with duplicate session name', async () => {
			// Create first session
			await request(app)
				.post('/session/create')
				.set('Authorization', `Bearer ${studentToken}`)
				.send({
					sessionName: 'Duplicate Session',
				});

			// Attempt to create session with same name
			const res = await request(app)
				.post('/session/create')
				.set('Authorization', `Bearer ${studentToken}`)
				.send({
					sessionName: 'Duplicate Session',
				});

			expect(res.statusCode).toEqual(401);
			expect(res.body.message).toContain('Duplicate');
		});

		it('should fail with missing session name', async () => {
			const res = await request(app)
				.post('/session/create')
				.set('Authorization', `Bearer ${studentToken}`)
				.send({});

			expect(res.statusCode).toBeGreaterThanOrEqual(400);
		});
	});

	describe('GET /session/details - Get Session Details', () => {
		let sessionId: string;

		beforeEach(async () => {
			// Create a session for testing
			const res = await request(app)
				.post('/session/create')
				.set('Authorization', `Bearer ${studentToken}`)
				.send({
					sessionName: 'Details Test Session',
				});
			sessionId = res.body.sessionId;
		});

		it('should get session details with valid sessionId', async () => {
			const res = await request(app)
				.get('/session/details')
				.set('Authorization', `Bearer ${studentToken}`)
				.query({ sessionId });

			expect(res.statusCode).toEqual(200);
			expect(res.body).toHaveProperty('session');
			expect(res.body.session.userOne).toBeDefined();
			expect(res.body.session.userOne.userRole).toBe('Driver');
		});

		it('should fail without authentication', async () => {
			const res = await request(app)
				.get('/session/details')
				.query({ sessionId });

			expect(res.statusCode).toBeGreaterThanOrEqual(400);
		});

		it('should fail with invalid sessionId', async () => {
			const res = await request(app)
				.get('/session/details')
				.set('Authorization', `Bearer ${studentToken}`)
				.query({ sessionId: '507f1f77bcf86cd799439011' }); // Valid format but non-existent

			expect(res.statusCode).toBeGreaterThanOrEqual(400);
		});
	});

	describe('Session Authorization', () => {
		it('should allow students to create sessions', async () => {
			const res = await request(app)
				.post('/session/create')
				.set('Authorization', `Bearer ${studentToken}`)
				.send({
					sessionName: 'Student Session',
				});

			expect(res.statusCode).toEqual(200);
		});

		it('should allow teachers to create sessions', async () => {
			const res = await request(app)
				.post('/session/create')
				.set('Authorization', `Bearer ${teacherToken}`)
				.send({
					sessionName: 'Teacher Session',
				});

			expect(res.statusCode).toEqual(200);
		});

		it('should reject invalid JWT token', async () => {
			const res = await request(app)
				.post('/session/create')
				.set('Authorization', 'Bearer invalid.token.here')
				.send({
					sessionName: 'Invalid Token Session',
				});

			expect(res.statusCode).toEqual(401);
		});

		it('should reject expired or malformed tokens', async () => {
			const res = await request(app)
				.post('/session/create')
				.set('Authorization', 'Bearer not-even-a-jwt')
				.send({
					sessionName: 'Bad Token Session',
				});

			expect(res.statusCode).toEqual(401);
		});
	});

	describe('Session Workflow Integration', () => {
		it('should support complete session creation flow', async () => {
			// Step 1: User signs up
			const signupRes = await request(app).post('/signup').send({
				email: 'workflow@test.com',
				password: 'password123',
				name: 'Workflow User',
				designation: 'student',
			});
			const token = signupRes.body.token;

			// Step 2: User creates a session
			const createRes = await request(app)
				.post('/session/create')
				.set('Authorization', `Bearer ${token}`)
				.send({
					sessionName: 'Workflow Session',
				});
			expect(createRes.statusCode).toEqual(200);
			const sessionId = createRes.body.sessionId;

			// Step 3: User gets session details
			const detailsRes = await request(app)
				.get('/session/details')
				.set('Authorization', `Bearer ${token}`)
				.query({ sessionId });
			expect(detailsRes.statusCode).toEqual(200);
			expect(detailsRes.body.session.userOne.userRole).toBe('Driver');

			// Step 4: Verify in database
			const session = await sessionModel.findById(sessionId);
			expect(session).not.toBeNull();
			expect(session?.sessionName).toBe('Workflow Session');
		});
	});
});
