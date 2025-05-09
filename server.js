const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const PORT = 3000;
const users = {}; // In-memory store (you can switch to a DB later)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'alaps-secret-key',
  resave: false,
  saveUninitialized: true,
}));
app.use(express.static(path.join(__dirname, 'public')));

// Signup
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (users[username]) return res.status(400).send('User already exists.');
  users[username] = {
    password: await bcrypt.hash(password, 10)
  };
  res.send("Registration successful.");
});

// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users[username];
  if (!user) return res.status(404).send("User not found.");
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).send("Invalid credentials.");
  req.session.user = username;
  res.send("Login successful.");
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
