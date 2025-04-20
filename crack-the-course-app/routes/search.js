// routes/search.js

// Searches for tutors who teach a given course or returns all.
function searchTutorsByCourse(db) {
  return async (req, res) => {
    const { course } = req.query;

    if (!course) {
      return res.status(400).json({ error: "Course query parameter is required" });
    }

    try {
      const users = db.collection("users");

      let query = { role: "tutor" };

      if (course.toLowerCase() !== "all") {
        query["profile.teachCourses"] = { $in: [course] };
      }

      const tutors = await users.find(query).toArray();

      const formattedTutors = tutors.map((tutor) => ({
        firstName: tutor.firstName,
        lastName: tutor.lastName,
        school: tutor.school,
        email: tutor.email,
        educationLevel: tutor.educationLevel,
        profile: {
          teachCourses: tutor.profile?.teachCourses || []
        },
        likes: {}
      }));

      return res.json({ tutors: formattedTutors });
    } catch (err) {
      console.error("Error searching tutors:", err);
      return res.status(500).json({ error: "Server error during tutor search" });
    }
  };
}




// Searches for chat counterparts for a user, filtering by a search term (e.g., partner's name).
// It returns the partner's firstName, lastName, email, and any chat details from the current user's document.
function searchChats(db) {
    return async (req, res) => {
      // Expect a query parameter of user's email, e.g., ?email=user@example.com
      const { email } = req.query;
      if (!email) {
        return res.status(400).json({ error: "Email query parameter is required" });
      }
  
      try {
        const users = db.collection("users");
        const user = await users.findOne({ email });
        
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        
        // Extract keys from both sent and received chats.
        const chatsReceived = (user.chats && user.chats.chats_recieve) 
          ? Object.keys(user.chats.chats_recieved) 
          : [];
        const chatsSent = (user.chats && user.chats.chats_send) 
          ? Object.keys(user.chats.chats_sent) 
          : [];
        
        // Combine them and remove duplicates.
        const chatCounterparts = Array.from(new Set([...chatsReceived, ...chatsSent]));
        
        // Now query for names of those chat counterparts
        const chatPartners = await users.find({
            email: { $in: chatCounterparts }
          }).project({ firstName: 1, email: 1, _id: 0 }).toArray();
          
          return res.json({ chats: chatPartners });
        } catch (err) {
          console.error("Error fetching chats:", err);
          return res.status(500).json({ error: "Server error during chat search" });
    };
  }
}

function getAllCourses(db) {
  return (req, res) => {
    console.log("Fetching courses...");  // Debug log
    try {
      const coursesCollection = db.collection("courses");
      coursesCollection.find().toArray((err, courses) => {
        if (err) {
          console.error("Error fetching courses:", err);
          return res.status(500).json({ error: "Server error while fetching courses" });
        }

        console.log("Courses fetched:", courses);  // Debug log
        const formattedCourses = courses.map(course => ({
          courseName: course.courseName
        }));

        return res.json({ courses: formattedCourses });
      });
    } catch (err) {
      console.error("Unexpected error:", err);
      return res.status(500).json({ error: "Unexpected server error" });
    }
  };
}




module.exports = { searchTutorsByCourse, searchChats, getAllCourses };
