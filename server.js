const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

// MongoDB connection
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'userDB';
let db;

MongoClient.connect(url, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB');
    db = client.db(dbName);
  })
  .catch(err => console.error('MongoDB connection error:', err));

// POST /register endpoint
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = { username, email, password };
    const result = await db.collection('users').insertOne(user);
    res.status(201).send('User registered successfully!');
  } catch (err) {
    console.error('Error inserting user:', err);
    res.status(500).send('Failed to register user');
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
