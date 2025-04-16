const updateTutorRate = (db) => {
    return async (req, res) => {
      // Expect the tutor's email and new session rate in the request body.
      const { email, sessionRate } = req.body;
      if (!email || sessionRate === undefined) {
        return res.status(400).json({ error: "Email and sessionRate are required." });
      }
      
      // Validate that the session rate is a positive number.
      const parsedRate = parseFloat(sessionRate);
      if (isNaN(parsedRate) || parsedRate < 0) {
        return res.status(400).json({ error: "sessionRate must be a positive number." });
      }
      
      try {
        const users = db.collection("users");
        // Update the tutor's document under profile.rate.sessionRate.
        const result = await users.updateOne(
          { email, role: "tutor" },
          { $set: { "profile.rate.sessionRate": parsedRate } }
        );
        
        if (result.modifiedCount === 1) {
          return res.json({ message: "Tutor rate updated successfully." });
        } else {
          return res.status(404).json({ error: "Tutor not found or no changes made." });
        }
      } catch (err) {
        console.error("Update Tutor Rate Error:", err);
        return res.status(500).json({ error: "Server error while updating tutor rate." });
      }
    };
  };
  
  const getTutorRate = (db) => {
    return async (req, res) => {
      // Expect the tutor's email as a query parameter.
      const { email } = req.query;
      if (!email) {
        return res.status(400).json({ error: "Email query parameter is required." });
      }
      
      try {
        const users = db.collection("users");
        const tutor = await users.findOne({ email, role: "tutor" });
        if (!tutor) {
          return res.status(404).json({ error: "Tutor not found." });
        }
        
        // Retrieve the session rate from profile.rate, defaulting to 0 if not set.
        const sessionRate = (tutor.profile?.rate?.sessionRate) || 0;
        return res.json({ sessionRate });
      } catch (err) {
        console.error("Get Tutor Rate Error:", err);
        return res.status(500).json({ error: "Server error while retrieving tutor rate." });
      }
    };
  };
  
  module.exports = { updateTutorRate, getTutorRate };
  