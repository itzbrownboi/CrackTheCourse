function getPendingAndAcceptedStudents(db) {
    return async (req, res) => {
      const { tutorEmail } = req.body;
  
      if (!tutorEmail) {
        return res.status(400).json({ error: "Missing tutor email" });
      }
  
      try {
        const usersCollection = db.collection("users");
        
        // Find tutor document
        const tutorDoc = await usersCollection.findOne({ email: tutorEmail });
        if (!tutorDoc) {
          return res.status(404).json({ error: "Student not found" });
        }
  
        // Extract student emails from both sent and accepted requests
        const requestsSent = tutorDoc.requests_pending || [];
        const requestsAccepted = tutorDoc.requests_accepted || [];
  
        // Combine both lists and maintain the status
        const studentEmailsWithStatus = [
          ...requestsSent.map(t => ({ email: t.email, status: "request_pending" })),
          ...requestsAccepted.map(t => ({ email: t.email, status: "request_accepted" }))
        ];
  
        // Fetch student documents
        const studentsCursor = await usersCollection.find({ email: { $in: studentEmailsWithStatus.map(t => t.email) } }).toArray();
  
        // Format result
        const students = studentsCursor.map(student => {
          // Find the status of the current student
          const request = studentEmailsWithStatus.find(t => t.email === student.email);
          return {
            name: student.firstName || "Unnamed",
            email: student.email,
            school: student.school || "Unknown School",
            status: request ? request.status : "request_pending"  // Default to "request_pending" if not found
          };
        });
  
        return res.status(200).json({ students });
      } catch (err) {
        console.error("Error fetching students:", err);
        return res.status(500).json({ error: "Server error" });
      }
    };
  }
  
  function acceptStudentRequest(db) {
    return async (req, res) => {
      const { tutorEmail, studentEmail } = req.body;
  
      if (!tutorEmail || !studentEmail) {
        return res.status(400).json({ error: "Missing tutor or student email" });
      }
  
      try {
        const usersCollection = db.collection("users");
  
        // Update tutor: pull student from requests_pending, add to requests_accepted
        await usersCollection.updateOne(
          { email: tutorEmail },
          {
            $pull: { requests_pending: { email: studentEmail } },
            $addToSet: { requests_accepted: { email: studentEmail } },
          }
        );
  
        // Update student: pull tutor from request_sent, add to request_accepted
        await usersCollection.updateOne(
          { email: studentEmail },
          {
            $pull: { requests_sent: { email: tutorEmail } },
            $addToSet: { requests_accepted: { email: tutorEmail } },
          }
        );
  
        return res.status(200).json({ message: "Request accepted successfully" });
      } catch (err) {
        console.error("Error accepting student request:", err);
        return res.status(500).json({ error: "Server error" });
      }
    };
  }
  
  
  module.exports = { acceptStudentRequest, getPendingAndAcceptedStudents};