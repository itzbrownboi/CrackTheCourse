// routes/profile.js
function profileRoute(db) {
    return async (req, res) => {
      const userEmail = req.query.email;
      const users = db.collection("users");
  
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
            teachCourses: user.profile.teachCourses
          }
        });
      } else {
        return res.status(400).json({ error: "Invalid role" });
      }
    };
  }
  module.exports = {profileRoute};
  