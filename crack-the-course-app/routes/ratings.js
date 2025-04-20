// routes/ratings.js

// Submit a rating for a tutor.
// Expect a request body with: tutorEmail, studentEmail, and rating.
function rateTutor(db) {
    return async (req, res) => {
      const { tutorEmail, studentEmail, rating } = req.body;
  
      if (!tutorEmail || !studentEmail || rating === undefined) {
        return res.status(400).json({ message: "Missing required fields." });
      }
  
      const parsedRating = parseFloat(rating);
      if (isNaN(parsedRating) || parsedRating < 0 || parsedRating > 5) {
        return res.status(400).json({ message: "Rating should be a number between 0 and 5." });
      }
  
      try {
        const users = db.collection("users");
        // Push a rating object into the tutor's 'ratings' array.
        const result = await users.updateOne(
          { email: tutorEmail, role: "tutor" },
          { $push: { ratings: { student: studentEmail, rating: parsedRating } } }
        );
  
        if (result.modifiedCount === 1) {
          return res.json({ message: "Rating submitted successfully." });
        } else {
          return res.status(404).json({ message: "Tutor not found or rating not updated." });
        }
      } catch (err) {
        console.error("Rating Error:", err);
        return res.status(500).json({ message: "Server error while rating tutor." });
      }
    };
  }
  
  // Retrieve the average rating for a tutor.
  // Expect a query parameter: tutorEmail.
  function getTutorAverageRating(db) {
    return async (req, res) => {
      const { tutorEmail } = req.query;
      if (!tutorEmail) {
        return res.status(400).json({ message: "Tutor email is required." });
      }
  
      try {
        const users = db.collection("users");
        const tutor = await users.findOne({ email: tutorEmail, role: "tutor" });
        if (!tutor) {
          return res.status(404).json({ message: "Tutor not found." });
        }
  
        const ratingsArr = tutor.ratings || [];
        if (ratingsArr.length === 0) {
          return res.json({ averageRating: 0.0 });
        }
  
        const total = ratingsArr.reduce((acc, r) => acc + r.rating, 0);
        const average = total / ratingsArr.length;
        // Round to one decimal place
        const roundedAvg = Math.round(average * 10) / 10;
        return res.json({ averageRating: roundedAvg });
      } catch (err) {
        console.error("Error retrieving rating:", err);
        return res.status(500).json({ message: "Server error retrieving average rating." });
      }
    };
  }
  
  module.exports = { rateTutor, getTutorAverageRating };
  