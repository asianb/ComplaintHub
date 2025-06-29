const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcryptjs');

// Import your server (you'll need to modify this)
const app = require('../../routes/userServer');

let mongoServer;

beforeAll(async () => {
  // Set up in-memory MongoDB for testing
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear test collections before each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe('User API Tests', () => {
  // Test for user registration
  test('POST /register should create a new user', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '0501234567',
      password: 'Test@123',
      role: 'citizen'
    };
    
    const response = await request(app)
      .post('/register')
      .send(userData);
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
    
    // Verify user exists in DB
    const User = mongoose.model('users');
    const user = await User.findOne({ email: 'test@example.com' });
    expect(user).toBeTruthy();
    expect(user.name).toBe('Test User');
  });
  
  // Test for user login
  test('POST /login should authenticate user and return token', async () => {
    // Create a test user first
    const User = mongoose.model('users');
    await new User({
      name: 'Existing User',
      email: 'existing@example.com',
      phone: '0501234567',
      password: await bcrypt.hash('Password123', 10),
      role: 'citizen'
    }).save();
    
    // Try to login
    const response = await request(app)
      .post('/login')
      .send({
        email: 'existing@example.com',
        password: 'Password123'
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
  
  // Test for failed login
  test('POST /login should fail with wrong credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'wrong@example.com',
        password: 'WrongPass'
      });
    
    expect(response.status).toBe(401);
    expect(response.body.status).toBe('error');
  });
  
  // Add more tests for other user endpoints
});