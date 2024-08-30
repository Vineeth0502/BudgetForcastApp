//server.js
/**
 * File name: server.js
 * Description: Basic Express server setup with user registration, login, and data access functionalities.

 */

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const users = []; // This is a temporary in-memory user store
const ENCRYPTION_KEY = crypto.randomBytes(32); // For demonstration, use a secure method to store this key
const IV_LENGTH = 16; // For AES, this is always 16

// Helper functions for encryption and decryption

/**
 * Encrypt text using AES-256-CBC.
 * @param {string} text - The text to encrypt.
 * @returns {string} The encrypted text with IV.
 */
function encrypt(text) {
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}
/**
 * Decrypt text using AES-256-CBC.
 * @param {string} text - The encrypted text with IV.
 * @returns {string} The decrypted text.
 */
function decrypt(text) {
  let textParts = text.split(':');
  let iv = Buffer.from(textParts.shift(), 'hex');
  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

app.post('/api/register', async (req, res) => {
  const { username, password, sensitiveData } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const encryptedData = encrypt(sensitiveData);
  users.push({ username, password: hashedPassword, sensitiveData: encryptedData });
  res.status(201).json({ message: 'User registered successfully' });
});





app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((user) => user.username === username);
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ username }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
});

app.get('/api/data', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, 'your_jwt_secret', (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      const storedUser = users.find((u) => u.username === user.username);
      if (storedUser) {
        const decryptedData = decrypt(storedUser.sensitiveData);
        res.json({ sensitiveData: decryptedData });
      } else {
        res.sendStatus(404);
      }
    });
  } else {
    res.sendStatus(401);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
