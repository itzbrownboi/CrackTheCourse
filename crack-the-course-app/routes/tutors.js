function getAllTutorsRoute(db) {
    return async (req, res) => {
      try {
        const users = db.collection("users");
  
        // Find all users with role "tutor"
        const tutorsCursor = users.find({ role: "tutor" });
  
        const tutors = await tutorsCursor.toArray();
  
        // Optional: format the tutors data before sending
        const formattedTutors = tutors.map((tutor) => ({
          firstName: tutor.firstName,
          lastName: tutor.lastName,
          school: tutor.school,
          educationLevel: tutor.educationLevel,
          profile: {
            teachCourses: tutor.profile?.teachCourses || []
          },
          likes: {}
        }));
  
        res.json(formattedTutors);
      } catch (error) {
        console.error("Error fetching tutors:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    };
  }
  