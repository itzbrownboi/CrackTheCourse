// routes/search.js

// Searches for tutors who teach a given course.
function searchTutorsByCourse(db) {
    return async (req, res) => {
      const { course } = req.query;
      if (!course) {
        return res.status(400).json({ error: "Course query parameter is required" });
      }
      try {
        const users = db.collection("users");
        const tutors = await users.find({
          role: "tutor",
          "profile.teachCourses": { $in: [course] }
        }).toArray();
        return res.json({ tutors });
      } catch (err) {
        console.error("Error searching tutors:", err);
        return res.status(500).json({ error: "Server error during tutor search" });
      }
    };
  }

// Searches for the chat counterparts of a user (sent and received).  
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

module.exports = { searchTutorsByCourse, searchChats };
