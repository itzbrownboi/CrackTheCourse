
//import { profileRoute } from "./routes/profile";
// Importing necessary libraries for Express and MongoDB
const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const port = 3000;
const {profileRoute} = require("./routes/profile");
const { signupRoute } = require("./routes/signup");
const { profileUpdates } = require("./routes/profile_update");
const {chat_send_recieve} = require("./routes/chat");
const {chat_get} = require("./routes/chat");
const {likes_post} = require("./routes/likes");
const {likes_get} = require("./routes/likes");
const { searchTutorsByCourse, searchChats } = require("./routes/search");
const bcrypt = require("bcrypt");



// MongoDB URI connection string
const uri = "mongodb+srv://janebmagai:ctcAdmin2025@crackthecourse.ddhnjjo.mongodb.net/?retryWrites=true&w=majority&appName=CrackTheCourse";
let client;
let db;

// Parse JSON request bodies
app.use(express.json());
// Get static files like HTML, CSS, JS, images from the 'public' directory
app.use(express.static("public"));

// Route to serve the login page (HTML file)
app.get("/", (req, res) => {
  // Send the login.html file located in the 'public' directory
  res.sendFile(__dirname + "/public/welcome.html");
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

    app.post("/api/signup", signupRoute(db));
    app.get("/api/profile", profileRoute(db));

    app.get("/api/search/tutors", searchTutorsByCourse(db));
    app.get("/api/search/chats", searchChats(db));

    // populate_data().catch(console.dir);
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
        strongCourses: ["MATH 211"],
        teachCourses:[]
      },
      chats: {
        chats_recieved: {
          "alice@example.com": {},
          "bob@example.com" :{}
          },
        chats_sent: {
              "alice@example.com": {},
              "bob@example.com" :{}
              }
      },
      likes: []
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
        strongCourses: ["CPSC 413"],
        teachCourses: []
      },
      chats: {
        chats_recieved: {
          "alice@example.com": {},
          "bob@example.com" :{}
          },
        chats_sent: {
              "alice@example.com" : {},
              "bob@example.com" :{}
              }
      },
      likes: []
      
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

/*    
*    if (user.password !== password) {
*      return res.status(401).json({ message: "Incorrect password" });
*    }
*/

    //compare the plaintext password with the stored hash
  const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      console.log(password)
      console.log(user.password)
      return res.status(401).json({ message: "Incorrect password" });
    }
   
    res.json({ message: "Login successful", user });
  } catch (err) {
    console.error(err); 
    res.status(500).json({ message: "Server error" });
  }
});

//Can use these to get it running through your html file scripts
// app.get("/api/profile", profileRoute(db));

app.post("/api/profile_update", profileUpdates(db));

app.get("/api/chat", chat_get(db));
app.post("/api/chat", chat_send_recieve(db));

app.post("/api/likes", likes_post(db));
app.get("/api/likes", likes_get(db));

// app.post("/api/signup", signupRoute(db))



/*
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
          profile: {
            weakCourses: user.profile.weakCourses,
            strongCourses: user.profile.strongCourses
          } 
      });
  } else if (user.role === 'teacher') { 
      return res.json({
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          school: user.school,
          educationLevel: user.educationLevel,
          profile: {
            teachCourses : user.profile.teachCourses
          }
      });
  } else {
      return res.status(400).json({ error: "Invalid role" });
  }
});
*/
