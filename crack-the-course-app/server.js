const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const port = 3000;
const uri =
  "mongodb+srv://ebunmak05:ctcAdmin2025@crackthecourse.ddhnjjo.mongodb.net/?retryWrites=true&w=majority&appName=CrackTheCourse";
let client;
let db;

app.use(express.json());
app.use(express.static("public"));

// Set up a basic route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/profile.html");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((connectedClient) => {
    client = connectedClient;
    db = client.db("CrackTheCourse");
    console.log("Connected to MongoDB");
  })
  .catch((error) => console.error("Failed to connect to MongoDB:", error));

async function run() {
  await client.connect();
  const db = client.db(db);
  const users = db.collection("users");
  await users.insertMany([
    {
        firstName: "Alice",
        lastName: "Johnson",
        school: "University of Calgary",
        educationLevel: "Undergraduate - 1st Year",
        role: "student",
        weakCourses: ["CPSC 251", "MATH 367"],
        strongCourses: ["MATH 211"]
      },
      {
        firstName: "Bob",
        lastName: "Smith",
        school: "University of Calgary",
        educationLevel: "Undergraduate - 2nd Year",
        role: "student",
        weakCourses: ["CPSC 355", "MATH 367"],
        strongCourses: ["CPSC 413"]
      },
      {
        firstName: "Chloe",
        lastName: "Nguyen",
        school: "University of Calgary",
        educationLevel: "Undergraduate - 3rd Year",
        role: "student",
        weakCourses: ["CPSC 355", "CPSC 413"],
        strongCourses: ["MATH 211", "CPSC 251"]
      }      
  ]);
}


app.get('/api/students', async (req, res) => {
    const users = db.collection("users");
    const students = await users.find({ role: "student" }).toArray();
    res.json(students);
});

// run().catch(console.dir);
