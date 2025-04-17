function sendTutorRequest(db) {
  return async (req, res) => {
    console.log("Sending tutor request...");

    const { tutorEmail, studentEmail, message } = req.body;

    if (!tutorEmail || !studentEmail || !message) {
      console.error("Missing fields:", { tutorEmail, studentEmail, message });
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const usersCollection = db.collection("users");
      const timestamp = new Date();

      // Add student request to tutor's pending list
      const tutorUpdate = await usersCollection.updateOne(
        { email: tutorEmail },
        {
          $push: {
            requests_pending: {
              email: studentEmail,
              message,
              timestamp
            }
          }
        }
      );

      if (tutorUpdate.matchedCount === 0) {
        console.warn("Tutor not found:", tutorEmail);
        return res.status(404).json({ error: "Tutor not found" });
      }

      // Add tutor reference to student's sent requests
      const studentUpdate = await usersCollection.updateOne(
        { email: studentEmail },
        {
          $push: {
            requests_sent: {
              email: tutorEmail,
              message,
              timestamp
            }
          }
        }
      );

      if (studentUpdate.matchedCount === 0) {
        console.warn("Student not found:", studentEmail);
        // Don't fail, just log it
      }

      console.log("Request recorded for tutor and student.");
      return res.status(200).json({ message: "Request sent successfully" });

    } catch (err) {
      console.error("Error sending tutor request:", err);
      return res.status(500).json({ error: "Server error while sending request" });
    }
  };
}

function getAcceptedTutors(db) {
  return async (req, res) => {
    const { studentEmail } = req.body;

    if (!studentEmail) {
      return res.status(400).json({ error: "Missing student email" });
    }

    try {
      const usersCollection = db.collection("users");

      // Find student document
      const studentDoc = await usersCollection.findOne({ email: studentEmail });
      if (!studentDoc) {
        return res.status(404).json({ error: "Student not found" });
      }

      // Extract tutor emails from both sent and accepted requests
      const requestsSent = studentDoc.requests_sent || [];
      const requestsAccepted = studentDoc.requests_accepted || [];

      // Combine both lists and maintain the status
      const tutorEmailsWithStatus = [
        ...requestsSent.map(t => ({ email: t.email, status: "request_pending" })),
        ...requestsAccepted.map(t => ({ email: t.email, status: "request_accepted" }))
      ];

      // Fetch tutor documents
      const tutorsCursor = await usersCollection.find({ email: { $in: tutorEmailsWithStatus.map(t => t.email) } }).toArray();

      // Format result
      const tutors = tutorsCursor.map(tutor => {
        // Find the status of the current tutor
        const request = tutorEmailsWithStatus.find(t => t.email === tutor.email);
        return {
          name: tutor.firstName || "Unnamed",
          email: tutor.email,
          courses: tutor.profile.teachCourses || [],
          status: request ? request.status : "request_pending"  // Default to "request_pending" if not found
        };
      });

      return res.status(200).json({ tutors });
    } catch (err) {
      console.error("Error fetching tutors:", err);
      return res.status(500).json({ error: "Server error" });
    }
  };
}



module.exports = { sendTutorRequest, getAcceptedTutors};