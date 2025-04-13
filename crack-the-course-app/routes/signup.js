// routes/signup.js

export function signupRoute(db) {
    return async (req, res) => {
      console.log("Received signup request:", req.body);
  
      const {
        firstName,
        lastName,
        email,
        password,
        role,
        school = "University of Calgary",
        educationLevel = "Unknown",
        profile = {}
      } = req.body;
  
      try {
        const users = db.collection("users");
  
        // Check if user already exists
        const existingUser = await users.findOne({ email });
        if (existingUser) {
          return res.status(409).json({ message: "User already exists" });
        }
  
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
        password,
        role,
        school,
        educationLevel,
        profile: finalProfile
      });

      return res.status(201).json({ message: "Signup successful" });

    } catch (err) {
      console.error("Signup error:", err);
      res.status(500).json({ message: "Server error during signup" });
    }
  };
}

  