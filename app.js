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
app.get('/insert-academic', (req, res) => {
    // Handle the request, e.g., render the academic_achievements.html page

    const sql = 'select * from academicachievements where RegisterNumber = ? '
    connection.query(sql, [REGISTERNUMBER],(error,results, fields) => {
        if (error) {
            res.send('Error');
        }
        else{
            res.sendFile(path.join(__dirname, 'views', 'academic_achievement.html'));
           
        }
    }
    )});
        
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

// Handle rendering the form for inserting extracurricular achievements
app.get('/insert-extracurricular', (req, res) => {
    const sql = 'select * from extracurricularactivities where RegisterNumber = ?';
    connection.query(sql, [REGISTERNUMBER], (error, results, fields) => {
        if (error) {
            res.send('Error');
        } else {
            res.sendFile(path.join(__dirname, 'views', 'extracurricular_activity.html'));
        }
    });
});

// Handle submitting extracurricular achievements
app.post('/submit-extracurricular-activity', (req, res) => {
    const { registerNumber,nameOfEvent,organisers,eventDate,location,photoURL,certificateURL } = req.body;

    const sql = `INSERT INTO extracurricularactivities (RegisterNumber, EventName, Organisers, EventDate, PositionPlace, PhotoURL, CertificateURL) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

    connection.query(sql, [registerNumber,nameOfEvent,organisers,eventDate,location,photoURL,certificateURL], (error, results, fields) => {
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

// Handle rendering the form for inserting sports achievements
app.get('/insert-sports', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'sports_achievement.html'));
});

// Handle submitting sports achievements
app.post('/submit-sports-achievement', (req, res) => {
    const { registerNumber, nameOfSport, level, achievementDate, prizeReceived, location, organisers, description, photoURL, certificateURL } = req.body;

    const sql = `INSERT INTO sportsachievements (RegisterNumber, NameOfSport, Level, AchievementDate, PrizeReceived, Location, Organisers, Description, PhotoURL, CertificateURL) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    connection.query(sql, [registerNumber, nameOfSport, level, achievementDate, prizeReceived, location, organisers, description, photoURL, certificateURL], (error, results, fields) => {
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
// Handle rendering the form for inserting courses achievements
app.get('/insert-courses', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'course.html'));
});

// Handle submitting courses achievements
app.post('/submit-course', (req, res) => {
    const { registerNumber, courseName, courseType, skillsGained, organization, startDate, endDate, certificateURL } = req.body;

    const sql = `INSERT INTO courses (RegisterNumber, CourseName, CourseType, SkillsGained, Organization, StartDate, EndDate, CertificateURL) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    connection.query(sql, [registerNumber, courseName, courseType, skillsGained, organization, startDate, endDate, certificateURL], (error, results, fields) => {
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

// ... (existing code)

// Handle rendering the student profile
// Update the render call for student-profile


app.get('/student-profile', (req, res) => {
    const sqlAcademic = 'SELECT * FROM academicachievements WHERE RegisterNumber = ?';
    const sqlExtracurricular = 'SELECT * FROM extracurricularactivities WHERE RegisterNumber = ?';
    const sqlSports = 'SELECT * FROM sportsachievements WHERE RegisterNumber = ?';
    const sqlCourses = 'SELECT * FROM courses WHERE RegisterNumber = ?';

    connection.query(sqlAcademic, [REGISTERNUMBER], (errorAcademic, academicResults, fieldsAcademic) => {
        if (errorAcademic) {
            res.send('Error');
        } else {
            connection.query(sqlExtracurricular, [REGISTERNUMBER], (errorExtracurricular, extracurricularResults, fieldsExtracurricular) => {
                if (errorExtracurricular) {
                    res.send('Error');
                } else {
                    connection.query(sqlSports, [REGISTERNUMBER], (errorSports, sportsResults, fieldsSports) => {
                        if (errorSports) {
                            res.send('Error');
                        } else {
                            connection.query(sqlCourses, [REGISTERNUMBER], (errorCourses, coursesResults, fieldsCourses) => {
                                if (errorCourses) {
                                    res.send('Error');
                                } else {
                                    res.sendFile(path.join(__dirname, 'views', 'student-profile.html') ,{
                                      
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

// ... (existing code)










  
  
// Start server
const PORT = 3307;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
