// routes/signup.js

const bcrypt = require("bcrypt");

function signupRoute(db) {
    return async (req, res) => {
      console.log("Received signup request:");
  
      const {
        firstName,
        lastName,
        email,
        password,
        role,
        school = "University of Calgary",
        educationLevel,
        profile = {}
      } = req.body;
  
      try {
        const users = db.collection("users");
      // Check if user already exists
      const existingUser = await users.findOne({ email });
        if (existingUser) {
          return res.status(409).json({ message: "User already exists" });
        }

      // Hash the password before saving it
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // Sanitize profile based on role
      const finalProfile = {
        strongCourses: [],
        weakCourses: [],
        teachCourses: []
      };

      if (role === "student") {
        finalProfile.strongCourses = profile.strongCourses || [];
        finalProfile.weakCourses = profile.weakCourses || [];
      }

      if (role === "tutor") {
        finalProfile.teachCourses = profile.teachCourses || [];
      }


      await users.insertOne({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        school,
        educationLevel,
        profile: finalProfile,
        chats: {
          chats_recieved: {}, // empty object by default
          chats_sent: {}
        },
        likes: {}
      });

      return res.status(201).json({ message: "Signup successful" });

    } catch (err) {
      console.error("Signup error:", err);
      res.status(500).json({ message: "Server error during signup" });
    }
  };
}

module.exports = { signupRoute };  