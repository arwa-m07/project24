const express = require('express');
const session = require('express-session');
const multer = require('multer');
const sharp = require('sharp');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const { error } = require('console');
// const { randomUUID } = require('crypto');

const app = express();
// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'your_secret_key', // Change this to your actual secret key
    resave: false,
    saveUninitialized: true
}));
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





// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'views/images'); // Destination folder for storing uploaded files
    },
    filename: function (req, file, cb) {
        // Generating a unique filename for the uploaded file
        cb(null, 'profilePhoto-' + Date.now() + '-' + Math.floor(Math.random() * 1000000) + '.' + getFileExtension(file.originalname));
    }
});

// Function to get file extension
function getFileExtension(filename) {
    return filename.split('.').pop();
}

// Multer upload configuration with error handling
const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Check file type or any other validations
        if (file.mimetype.startsWith('image/')) {
            cb(null, 'views/images');
        } else {
            cb(new Error('File type not supported'));
        }
    }
});

// Handle Register
app.post('/register-form', upload.single('profilePhoto'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Please upload a profile photo.');
    }

    // Resize and store the profile photo
    sharp(req.file.path)
        .resize(200, 200) // Adjust the dimensions as needed
        .toFile(path.join(__dirname, 'views', 'images', 'resized', req.file.filename), (err, info) => {
            if (err) {
                console.error('Error resizing and storing the profile photo:', err);
                return res.status(500).send('Internal Server Error');
            }
    console.log('Received POST request to /register-form');
    console.log('Request body:', req.body); // Check if profilePhoto is present in req.body
    console.log('File received:', req.file); // Check the uploaded file information
    const {
        firstName,
        lastName,
        registerNumber,
        dob,
        department,
        profilePhoto,
        residentStatus,
        fatherFirstName,
        fatherLastName,
        fatherPhoneNumber,
        fatherEmail,
        motherFirstName,
        motherLastName,
        motherPhoneNumber,
        motherEmail,
        guardianFirstName,
        guardianLastName,
        guardianPhoneNumber,
        guardianEmail,
        guardianAddress,
        guardianCity,
        guardianPincode,
        address,
        city,
        pincode,
        bloodGroup,
        collegeEmail // New field
    } = req.body;

    // Log the received form data
    console.log('Received form data:', req.body);

    // Log values of specific variables just before the conditional check
    console.log('firstName:', firstName);
    console.log('lastName:', lastName);
    console.log('registerNumber:', registerNumber);
    console.log('dob:', dob);
    console.log('department:', department);
    console.log('profilePhoto:', profilePhoto);
    console.log('bloodGroup:', bloodGroup);
    console.log('collegeEmail:', collegeEmail);

    // Check if required values are present
    if (!firstName || !lastName || !registerNumber || !dob || !department || !bloodGroup || !collegeEmail) {
        console.log("profile photo", profilePhoto);
        return res.status(400).send('Please provide all required fields.');
    }

// Check residency status and required fields accordingly
console.log('Residency Status:', residentStatus); // Add this line
if (residentStatus === 'Resident') {
    if (!fatherFirstName || !fatherLastName || !fatherPhoneNumber || !fatherEmail || !motherFirstName || !motherLastName || !motherPhoneNumber || !motherEmail || !address || !city || !pincode) {
        console.log('Required fields for Resident are missing.'); // Add this line
        return res.status(400).send('Please provide all required fields for Resident.');
    }
} else if (residentStatus === 'Non-Resident') {
    if (!guardianFirstName || !guardianLastName || !guardianPhoneNumber || !guardianEmail || !guardianAddress || !guardianCity || !guardianPincode) {
        console.log('Required fields for Non-Resident are missing.'); // Add this line
        return res.status(400).send('Please provide all required fields for Non-Resident.');
    }
}



    // Check if a profile photo was uploaded
    if (!req.file) {
        return res.status(400).send('Please upload a profile photo.');
    }

    // Resize and store the profile photo
    sharp(req.file.path)
        .resize(200, 200) // Adjust the dimensions as needed
        .toFile('views/images/resized/' + req.file.filename, (err, info) => {
            if (err) {
                console.error('Error resizing and storing the profile photo:', err);
                return res.status(500).send('Internal Server Error');
            }
            
            const profilePhotoURL = `views/images/resized/${req.file.filename}`;

            // SQL query with placeholders
            const sqlQuery = 'INSERT INTO students (FirstName, LastName, RegisterNumber, DateOfBirth, Department, ProfilePhotoURL, FatherFirstName, FatherLastName, FatherPhoneNumber, FatherEmail, MotherFirstName, MotherLastName, MotherPhoneNumber, MotherEmail, GuardianFirstName, GuardianLastName, GuardianPhoneNumber, GuardianEmail, GuardianAddress, GuardianCity, GuardianPincode, ResidentStatus, Address, City, Pincode, BloodGroup, CollegeEmail) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

            // Parameters passed to connection.query
            const sqlParams = [firstName, lastName, registerNumber, dob, department, profilePhotoURL, fatherFirstName, fatherLastName, fatherPhoneNumber, fatherEmail, motherFirstName, motherLastName, motherPhoneNumber, motherEmail, guardianFirstName, guardianLastName, guardianPhoneNumber, guardianEmail, guardianAddress, guardianCity, guardianPincode, residentStatus, address, city, pincode, bloodGroup, collegeEmail];

            console.log('SQL Query:', sqlQuery); // Log the SQL query

            // Insert the data into the database
            connection.query(sqlQuery, sqlParams, (error, results, fields) => {
                console.log('Executing SQL query:', sqlQuery);
                console.log('SQL parameters:', sqlParams);
                if (error) {
                    if (error.code === 'ER_DUP_ENTRY') {
                        // Redirect back to registration form with registrationFailed query parameter
                        return res.redirect('/register-student?registrationFailed=true');
                    } else {
                        console.error('Error during registration:', error);
                        return res.status(500).send('Internal Server Error');
                    }
                }

                if (results.affectedRows > 0) {
                    // Redirect to login page with registrationSuccess query parameter
                    res.redirect('/login-student?registrationSuccess=true');
                } else {
                    res.send('Registration failed');
                }
            });
        });
});
});



// Handle login and send to dashboard once the login is successful
app.post('/authenticate', (req, res) => {
    const { registerNumber, dob } = req.body;

    connection.query('SELECT * FROM students WHERE RegisterNumber = ? AND DateOfBirth = ?', [registerNumber, dob], (error, results, fields) => {
        if (error) {
            console.error('Error during login:', error);
            // Render the login page again with a notification for login failure
            res.render('login-student', { loginFailed: true });
        } else {
            if (results.length > 0) {
                // Redirect to the dashboard on successful login
                REGISTERNUMBER = registerNumber;
                res.redirect('/dashboard?success=true');
            } else {
                // Send the login-student.html file with a notification for login failure
                res.redirect('/login-student?loginFailed=true');
            }
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
    res.sendFile(path.join(__dirname, 'views', 'academic_achievement.html'));
});

        
// Update the route handler to use Multer middleware
app.post('/submit-academic-achievement', upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'certificate', maxCount: 1 }]), (req, res) => {
    const { registerNumber, nameOfAchievement, achievementDate, description } = req.body;
    const photoFile = req.files['photo'][0];
    const certificateFile = req.files['certificate'][0];

    // Assuming you want to store the file paths in the database
    const photoURL = photoFile ? photoFile.path : null;
    const certificateURL = certificateFile ? certificateFile.path : null;

    // Log the received form data
    console.log('Received form data:', req.body);
    console.log('Received photo file:', photoFile);
    console.log('Received certificate file:', certificateFile);

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

// Handle submitting extracurricular achievements with file uploads
app.post('/submit-extracurricular-activity', upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'certificate', maxCount: 1 }]), (req, res) => {
    const { registerNumber, nameOfEvent, organisers, eventDate, location } = req.body;
    const photoURL = req.files['photo'][0].path; // Extract path of uploaded photo
    const certificateURL = req.files['certificate'][0].path; // Extract path of uploaded certificate

    const sql = `INSERT INTO extracurricularactivities (RegisterNumber, EventName, Organisers, EventDate, PositionPlace, PhotoURL, CertificateURL) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

    connection.query(sql, [registerNumber, nameOfEvent, organisers, eventDate, location, photoURL, certificateURL], (error, results, fields) => {
        if (error) {
            console.error('Error inserting data into the database:', error);
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

// Handle submitting sports achievements with file uploads
app.post('/submit-sports-achievement', upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'certificate', maxCount: 1 }]), (req, res) => {
    const { registerNumber, nameOfSport, level, achievementDate, prizeReceived, location, organisers, description } = req.body;
    const photoURL = req.files['photo'][0].path; // Extract path of uploaded photo
    const certificateURL = req.files['certificate'][0].path; // Extract path of uploaded certificate

    const sql = `INSERT INTO sportsachievements (RegisterNumber, NameOfSport, Level, AchievementDate, PrizeReceived, Location, Organisers, Description, PhotoURL, CertificateURL) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    connection.query(sql, [registerNumber, nameOfSport, level, achievementDate, prizeReceived, location, organisers, description, photoURL, certificateURL], (error, results, fields) => {
        if (error) {
            console.error('Error inserting data into the database:', error);
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

// Handle submitting courses achievements with certificate upload
app.post('/submit-course', upload.single('certificate'), (req, res) => {
    const { registerNumber, courseName, courseType, skillsGained, organization, startDate, endDate } = req.body;
    const certificateURL = req.file ? req.file.path : null; // Extract path of uploaded certificate, if available

    const sql = `INSERT INTO courses (RegisterNumber, CourseName, CourseType, SkillsGained, Organization, StartDate, EndDate, CertificateURL) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    connection.query(sql, [registerNumber, courseName, courseType, skillsGained, organization, startDate, endDate, certificateURL], (error, results, fields) => {
        if (error) {
            console.error('Error inserting data into the database:', error);
            res.send('Error submitting form');
        } else {
            console.log('Data inserted successfully');
            console.log('Submitted registerNumber:', registerNumber);
            res.redirect('/dashboard');
        }
    });
});
// Route for serving academic activities form
app.get('/insert-academic-activities', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'academic_activities.html'));
});


// Handle submitting academic activities form
app.post('/submit-academic-activities', upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'certificate', maxCount: 1 }]), (req, res) => {
    const { registerNumber, activityType, prizesAwards, eventName, eventDate, organisers, venue } = req.body;
    const photoURL = req.files['photo'] ? req.files['photo'][0].path : null; // Extract path of uploaded photo, if available
    const certificateURL = req.files['certificate'] ? req.files['certificate'][0].path : null; // Extract path of uploaded certificate, if available

    const sql = `INSERT INTO academic_activities (RegisterNumber, ActivityType, PrizesAwards, EventName, EventDate, Certificate, Organisers, Venue, PhotoURL) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    connection.query(sql, [registerNumber, activityType, prizesAwards, eventName, eventDate, certificateURL, organisers, venue, photoURL], (error, results, fields) => {
        if (error) {
            console.error('Error inserting data into the database:', error);
            res.send('Error submitting form');
        } else {
            console.log('Data inserted successfully');
            console.log('Submitted registerNumber:', registerNumber);
            res.redirect('/dashboard');
        }
    });
});


// Route to serve the student profile EJS page
app.get("/student-profile", (req, res) => {
    // Fetch profile photo URL from the MySQL database
    const profileQuery = "SELECT ProfilePhotoURL FROM students WHERE RegisterNumber = ?";
    connection.query(profileQuery, [REGISTERNUMBER], (profileErr, profileResult) => {
        if (profileErr) {
            console.error("Error fetching profile photo URL:", profileErr);
            res.status(500).send("Internal server error");
            return;
        }
        
           // Construct profile photo URL
            // Extract profile photo URL from the query result
        const profilePhotoURL = profileResult.length > 0 ? profileResult[0].ProfilePhotoURL : null;




        console.log("Profile Photo URL:", profilePhotoURL); // Log profile photo URL

        // Fetch other data from the MySQL database
        const query1 = "SELECT * FROM academicachievements WHERE RegisterNumber = ?";
        const query2 = "SELECT * FROM extracurricularactivities WHERE RegisterNumber = ?";
        const query3 = "SELECT * FROM sportsachievements WHERE RegisterNumber = ?";
        const query4 = "SELECT * FROM courses WHERE RegisterNumber = ?";
        const query5 = "SELECT * FROM academic_activities WHERE RegisterNumber = ?"; // Add this query

        // Execute each query separately
        connection.query(query1, [REGISTERNUMBER], (err1, academicData) => {
            connection.query(query2, [REGISTERNUMBER], (err2, extracurricularData) => {
                connection.query(query3, [REGISTERNUMBER], (err3, sportsData) => {
                    connection.query(query4, [REGISTERNUMBER], (err4, coursesData) => {
                        connection.query(query5, [REGISTERNUMBER], (err5, academicActivitiesData) => { // Fetch academic_activities data
                            if (err1 || err2 || err3 || err4 || err5) { // Handle errors for all queries
                                console.error("Error fetching data from MySQL database:", err1 || err2 || err3 || err4 || err5);
                                res.status(500).send("Internal server error");
                            } else {
                                console.log("Profile Photo URL before rendering:", profilePhotoURL); // Add this line
                                // Render the EJS file with the fetched data
                                res.render("student_profile", { 
                                    profilePhotoURL: profilePhotoURL, // Pass profile photo URL to the template
                                    academicData: academicData, 
                                    extracurricularData: extracurricularData,
                                    sportsData: sportsData,
                                    coursesData: coursesData,
                                    academicActivitiesData: academicActivitiesData // Pass academic activities data to the template
                                });
                            }
                        });
                    });
                });
            });
        });
    });
});





// Node.js code for handling deletion of records


// Route to handle deletion of academic activities
app.post("/delete_academicActivities_record", (req, res) => {
    const activityId = req.body.ActivityID;
    const query = "DELETE FROM academic_activities WHERE ActivityID = ?";
    connection.query(query, [activityId], (err, result) => {
        if (err) {
            console.error("Error deleting academic activity record:", err);
            res.status(500).send("Internal server error");
        } else {
            console.log("Academic activity record deleted successfully");
            res.sendStatus(200);
        }
    });
});
// Route to handle deletion of academic achievements
app.post("/delete_academic_record", (req, res) => {
    const achievementId = req.body.AchievementID;
    const query = "DELETE FROM academicachievements WHERE AchievementID = ?";
    connection.query(query, [achievementId], (err, result) => {
        if (err) {
            console.error("Error deleting academic achievement record:", err);
            res.status(500).send("Internal server error");
        } else {
            console.log("Academic achievement record deleted successfully");
            res.sendStatus(200);
        }
    });
});


// Route to handle deletion of extracurricular activities
app.post("/delete_extracurricular_record", (req, res) => {
    const activityId = req.body.ActivityID;
    const query = "DELETE FROM extracurricularactivities WHERE ActivityID = ?";
    connection.query(query, [activityId], (err, result) => {
        if (err) {
            console.error("Error deleting extracurricular record:", err);
            res.status(500).send("Internal server error");
        } else {
            console.log("Extracurricular record deleted successfully");
            res.sendStatus(200);
        }
    });
});

// Route to handle deletion of sports achievements
app.post("/delete_sports_record", (req, res) => {
    const sportsAchievementId = req.body.SportsAchievementID;
    const query = "DELETE FROM sportsachievements WHERE SportsAchievementID = ?";
    connection.query(query, [sportsAchievementId], (err, result) => {
        if (err) {
            console.error("Error deleting sports record:", err);
            res.status(500).send("Internal server error");
        } else {
            console.log("Sports record deleted successfully");
            res.sendStatus(200);
        }
    });
});

// Route to handle deletion of courses
app.post("/delete_courses_record", (req, res) => {
    const courseId = req.body.CourseID;
    console.log("Received request to delete course record with ID:", courseId);
    const query = "DELETE FROM courses WHERE CourseID = ?";
    connection.query(query, [courseId], (err, result) => {
        if (err) {
            console.error("Error deleting course record:", err);
            res.status(500).send("Internal server error");
        } else {
            console.log("Course record deleted successfully");
            res.sendStatus(200);
        }
    });
});




    


// Your route for logout
app.get('/logout', (req, res) => {
    // Check if session exists before attempting to destroy it
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                res.status(500).send('Internal Server Error');
            } else {
                // Redirect the user to the home page after logout
                res.redirect('/');
            }
        });
    } else {
        // If session doesn't exist, redirect the user to the home page
        res.redirect('/');
    }
});





 




    

  








  
  
// Start server
const PORT = 3307;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
