const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const { randomUUID } = require('crypto');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL connection settings
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'arwa',
    password: 'arwa',
    database: 'default'
});

connection.connect((error) => {
    if (error) throw error;
    console.log('Connected to the database');
});

// Serve static files from 'views' directory
app.use(express.static(path.join(__dirname, 'views')));

// Home page route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Login page route for student
app.get('/login-student', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login-student.html'));
});

// Login page route for teacher
app.get('/login-teacher', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'TEACHER.html'));
});

// Register page route for student
app.get('/register-student', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register-student.html'));
});

// Handle login
app.post('/authenticate', (req, res) => {
    const { username, password } = req.body;

    connection.query('SELECT * FROM student_main WHERE UUID  = ? AND DOB = ?', [randomUUID, DOB], (error, results, fields) => {
        if (error) throw error;

        if (results.length > 0) {
            res.send('Login successful');
        } else {
            res.send('Login failed');
        }
    });
});

// Handle Register
app.post('/register-form', (req, res) => {
    const { randomUUID,DOB , FIRSTNAME } = req.body;

    connection.query('INSERT INTO student_main SET UUID = ?, DOB = ?, FirstName = ?', [randomUUID, DOB, FIRSTNAME], (error, results, fields) => {
        if (error) throw error;

        if (results.affectedRows > 0) {
            res.send('Registration successful');
        } else {
            res.send('Registration failed');
        }
    });
});

// Start server
const PORT = 3306;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
