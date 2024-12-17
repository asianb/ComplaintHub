require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => res.send('Hello from the backend!'));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});