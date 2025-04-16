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



// Searches for chat counterparts for a user, filtering by a search term (e.g., partner's name).
// It returns the partner's firstName, lastName, email, and any chat details from the current user's document.
function searchChats(db) {
  return async (req, res) => {
    // Expect query parameters:
    //   email: the logged-in user's email
    //   name: search term (e.g., "jake")
    const { email, name } = req.query;
    if (!email || !name) {
      return res.status(400).json({ error: "Both email and name query parameters are required" });
    }
    
    try {
      const users = db.collection("users");

      // Retrieve the logged-in user's document.
      const currentUser = await users.findOne({ email });
      if (!currentUser) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Extract partner emails from chats_sent, chats_recieved, and likes.
      const chatsSent = currentUser.chats && currentUser.chats.chats_sent
        ? Object.keys(currentUser.chats.chats_sent)
        : [];
      const chatsReceived = currentUser.chats && currentUser.chats.chats_recieved
        ? Object.keys(currentUser.chats.chats_recieved)
        : [];
      const likedUsers = currentUser.likes || [];
      
      // Combine them and remove duplicates.
      const chatCounterparts = Array.from(new Set([...chatsSent, ...chatsReceived, ...likedUsers]));
      
      // Build a case-insensitive regex for the search term.
      const regex = new RegExp(name, "i");
      
      // Find partner documents among those in the chatCounterparts whose first or last name matches the search term.
      const matchingPartners = await users.find({
        email: { $in: chatCounterparts },
        $or: [ { firstName: regex }, { lastName: regex } ]
      })
      .project({ firstName: 1, lastName: 1, email: 1, _id: 0 })
      .toArray();
      
      // For each matching partner, attach the chat details (if available) from the current user's document.
      const results = matchingPartners.map(partner => {
        const partnerEmail = partner.email;
        return {
          ...partner,
          chatSent: currentUser.chats && currentUser.chats.chats_sent ? currentUser.chats.chats_sent[partnerEmail] : null,
          chatReceived: currentUser.chats && currentUser.chats.chats_recieved ? currentUser.chats.chats_recieved[partnerEmail] : null
        };
      });
      
      return res.json({ chats: results });
      
    } catch (err) {
      console.error("Error fetching chats:", err);
      return res.status(500).json({ error: "Server error during chat search" });
    }
  };
}



module.exports = { searchTutorsByCourse, searchChats };
