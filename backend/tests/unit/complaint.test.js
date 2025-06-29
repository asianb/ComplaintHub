const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { setupDB } = require('../setup');

// Import your server
const app = require('../../routes/ComplaintServer');

// Create JWT for testing
const JWT_SECRET = "ejrbhjlsbsihgbrwhgsbdbgf";

// Setup the database connection
setupDB();

// Create token helper
function createToken(userId, role = 'citizen', categories = []) {
  return jwt.sign({ id: userId, role, categories }, JWT_SECRET);
}

describe('Complaint API Tests', () => {
  test('GET /api/viewcomplaints should return empty array initially', async () => {
    const response = await request(app).get('/api/viewcomplaints');
    
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data).toEqual([]);
  });

  test('POST /api/complaints should create a complaint with valid auth', async () => {
    const token = createToken('test-user-123');
    
    const complaintData = {
      title: 'Test Complaint',
      description: 'This is a test complaint',
      category: 'תחזוקה',
      address: 'Test Address 123',
      location: JSON.stringify({
        latitude: 31.25181,
        longitude: 34.7913
      })
    };
    
    const response = await request(app)
      .post('/api/complaints')
      .set('Authorization', `Bearer ${token}`)
      .send(complaintData);
    
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    
    // Verify the complaint was created
    const listResponse = await request(app).get('/api/viewcomplaints');
    expect(listResponse.body.data.length).toBe(1);
    expect(listResponse.body.data[0].title).toBe('Test Complaint');
    expect(listResponse.body.data[0].userId).toBe('test-user-123');
  });

  // Add more tests...
});