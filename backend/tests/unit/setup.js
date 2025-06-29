// tests/setup.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

module.exports = {
  setupDB() {
    // Before all tests
    beforeAll(async () => {
      // If mongoose is already connected, disconnect it first
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
      
      // Create an in-memory MongoDB server
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      
      // Connect to the in-memory database
      await mongoose.connect(mongoUri);
    });
    
    // After all tests
    afterAll(async () => {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
      await mongoServer.stop();
    });
    
    // Clear database between tests
    beforeEach(async () => {
      const collections = mongoose.connection.collections;
      for (const key in collections) {
        await collections[key].deleteMany({});
      }
    });
  }
};