// require('dotenv').config();
// const express = require('express');
// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(express.json());

// // Routes
// app.get('/', (req, res) => res.send('Hello from the backend!'));

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose")
const mongoUrl = "mongodb+srv://anfalnbbari7:anfal@cluster0.rd4kb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"


mongoose.connect(mongoUrl).then(()=>{
  console.log("DATABASE CONNECTED")
})

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Home Page!');
});

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the API!', status: 'success' });
});

app.post('/api/data', (req, res) => {
  const { name, age } = req.body;
  if (!name || !age) {
    return res.status(400).json({ error: 'Name and age are required!' });
  }
  res.json({ message: 'Data received successfully!', data: { name, age } });
});

app.use((req, res) => {
  res.status(404).send('Sorry, page not found!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
