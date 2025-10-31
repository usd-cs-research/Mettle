import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongod: MongoMemoryServer;

beforeAll(async () => {
	// Create an in-memory MongoDB instance
	mongod = await MongoMemoryServer.create();
	const uri = mongod.getUri();

	// Set the DB URI for tests
	process.env.MONGODB_URL = uri;
	process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';

	// Connect to the in-memory database
	await mongoose.connect(uri);
}, 30000); // 30 second timeout for DB setup

beforeEach(async () => {
	// Clear all data before each test
	const collections = await mongoose.connection.db.collections();
	for (const collection of collections) {
		await collection.deleteMany({});
	}
});

afterAll(async () => {
	// Cleanup: drop database, close connection, stop server
	if (mongoose.connection.readyState !== 0) {
		await mongoose.connection.dropDatabase();
		await mongoose.connection.close();
	}
	if (mongod) {
		await mongod.stop();
	}
}, 30000);
