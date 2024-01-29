const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const { error } = require('console');
// const { randomUUID } = require('crypto');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
var REGISTERNUMBER;
// MySQL connection settings
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'arwa',
    password: 'arwa',
    database: 'project'
});
connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
    } else {
      console.log('Connected to MySQL database');
    }
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


// Register page route for student
app.get('/register-student', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register-student.html'));
});
// Handle Register
app.post('/register-form', (req, res) => {
    const { firstName, lastName, registerNumber, dob, department, profilePhoto } = req.body;
    console.log('Received form data:', req.body);

    // Check if required values are present
    if (!firstName || !lastName || !registerNumber || !dob || !department) {
        return res.status(400).send('Please provide all required fields.');
    }

    connection.query('INSERT INTO students SET FirstName=?, LastName=?, RegisterNumber=?, DateOfBirth=?, Department=?, ProfilePhotoURL=?', [firstName, lastName, registerNumber, dob, department, profilePhoto], (error, results, fields) => {
        if (error) {
            console.error('Error during registration:', error);
            return res.status(500).send('Internal Server Error');
        }

        if (results.affectedRows > 0) {
            res.send('Registration successful');
        } else {
            res.send('Registration failed');
        }
    });
});
// Handle login and send to dashboard once the login is sucessful
app.post('/authenticate', (req, res) => {
    const { registerNumber, dob } = req.body;

    connection.query('SELECT * FROM students WHERE RegisterNumber = ? AND DateOfBirth = ?', [registerNumber, dob], (error, results, fields) => {
        if (error) throw error;

        if (results.length > 0) {
            // Redirect to the dashboard on successful login
            REGISTERNUMBER = registerNumber;
            res.redirect('/dashboard?success=true');
        } else {
            res.send('Login failed');
        }
    });
});

// Example route for /dashboard
app.get('/dashboard', (req, res) => {
    // Combine the path to the 'dashboard.html' file with the 'views' folder
    const dashboardPath = path.join(__dirname, 'views', 'dashboard.html');

    // Send the 'dashboard.html' file along with the welcome message
    res.sendFile(dashboardPath);
});
app.get('/view-academic', (req, res) => {
    // Handle the request, e.g., render the academic_achievements.html page

    const sql = 'select * from academicachievements where RegisterNumber = ? '
    connection.query(sql, [REGISTERNUMBER],(error,results, fields) => {
        if (error) {
            res.send('Error');
        }
        else{
            res.send('success');
        }
    }
    )});
        
app.get('/edit-academic', (req, res) => {
    // Handle the request, e.g., render the academic_achievements.html page
    res.sendFile(path.join(__dirname, 'views', 'academic_achievement.html'));
});

app.post('/submit-academic-achievement', (req, res) => {
    const { registerNumber, nameOfAchievement, achievementDate, description, photoURL, certificateURL } = req.body;

    // Assuming you have a table named 'AcademicAchievements' with a 'RegisterNumber' field
    const sql = `INSERT INTO academicachievements (RegisterNumber, NameOfAchievement, AchievementDate, Description, PhotoURL, CertificateURL) 
                 VALUES (?, ?, ?, ?, ?, ?)`;

    connection.query(sql, [registerNumber, nameOfAchievement, achievementDate, description, photoURL, certificateURL], (error, results, fields) => {
        if (error) {
            console.error('Error inserting data into the database: ' + error);
            res.send('Error submitting form');
        } else {
            console.log('Data inserted successfully');
            console.log('Submitted registerNumber:', registerNumber);

            res.redirect('/dashboard');
          
        }
    });
});





// Handle Register
app.post('/register-form', (req, res) => {
    const { firstName, lastName, registerNumber, dob, department, profilePhoto } = req.body;
    console.log('Received form data:', req.body);

    // Check if required values are present
    if (!firstName || !lastName || !registerNumber || !dob || !department) {
        return res.status(400).send('Please provide all required fields.');
    }

    connection.query('INSERT INTO students SET FirstName=?, LastName=?, RegisterNumber=?, DateOfBirth=?, Department=?, ProfilePhotoURL=?', [firstName, lastName, registerNumber, dob, department, profilePhoto], (error, results, fields) => {
        if (error) {
            console.error('Error during registration:', error);
            return res.status(500).send('Internal Server Error');
        }

        if (results.affectedRows > 0) {
            res.send('Registration successful');
        } else {
            res.send('Registration failed');
        }
    });
});



  
  
// Start server
const PORT = 3307;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
