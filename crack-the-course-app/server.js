// Importing necessary libraries for Express and MongoDB
const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const port = 3000;

// MongoDB URI connection string
const uri = "please include your own URI*";
let client;
let db;

// Parse JSON request bodies
app.use(express.json());
// Get static files like HTML, CSS, JS, images from the 'public' directory
app.use(express.static("public"));

// Route to serve the login page (HTML file)
app.get("/", (req, res) => {
  // Send the login.html file located in the 'public' directory
  res.sendFile(__dirname + "/public/login.html");
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// MongoDB connection setup using MongoClient
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((connectedClient) => {
    client = connectedClient;  // Store  client
    db = client.db("CrackTheCourse");  // Get database
    console.log("Connected to MongoDB");
    populate_data().catch(console.dir);
  })
  .catch((error) => console.error("Failed to connect to MongoDB:", error));

// populate the database with sample user data
async function populate_data() {
  const users = db.collection("users");  // Get the 'users' collection

  // Insert multiple user documents into the 'users' collection
  await users.insertMany([
    {
      firstName: "Judah",
      lastName: "Betta",
      email: "judah@student.com",
      password: "jude123",
      school: "University of Calgary",
      educationLevel: "Undergraduate - 1st Year",
      role: "student",
      profile: {
        weakCourses: ["CPSC 251", "MATH 367"],
        strongCourses: ["MATH 211"]
      }
    },
    {
      firstName: "Gwen",
      lastName: "Mach",
      email: "gwen@student.com",
      password: "gwen123",
      school: "University of Calgary",
      educationLevel: "Undergraduate - 2nd Year",
      role: "student",
      profile: {
        weakCourses: ["CPSC 355", "MATH 367"],
        strongCourses: ["CPSC 413"]
      }
    },
  ]);

  console.log("User data populated successfully.");
}




// POST route for user login 
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;  // email and password

  try {
    const users = db.collection("users");
    const user = await users.findOne({ email: email });

    
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    
    if (user.password !== password) {
      return res.status(401).json({ message: "Incorrect password" });
    }

   
    res.json({ message: "Login successful", user });
  } catch (err) {
    console.error(err); 
    res.status(500).json({ message: "Server error" });
  }
});

// GET route to fetch user profile based on email
app.get('/api/profile', async (req, res) => {
  const users = db.collection("users");
  
  const userEmail = req.query.email;

  
  if (!userEmail) {
      return res.status(400).json({ error: "Email is required to fetch profile" });
  }

  
  const user = await users.findOne({ email: userEmail });

  
  if (!user) {
      return res.status(404).json({ error: "User not found" });
  }

  if (user.role === 'student') {
      return res.json({
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          school: user.school,
          educationLevel: user.educationLevel,
          profile: user.profile
      });
  } else if (user.role === 'teacher') { 
      return res.json({
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          school: user.school,
          educationLevel: user.educationLevel,
          profile: user.profile
      });
  } else {
      return res.status(400).json({ error: "Invalid role" });
  }
});
