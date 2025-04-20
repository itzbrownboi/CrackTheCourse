const bcrypt = require("bcrypt");

function resetPassword(db) {
  return async (req, res) => {
    const { email, newPassword } = req.body;
    
    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required." });
    }
    
    try {
      const users = db.collection("users");
      
      // Hash the new password using bcrypt (10 salt rounds)
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // Update the user's password in the database
      const result = await users.updateOne(
        { email },
        { $set: { password: hashedPassword } }
      );
      
      if (result.modifiedCount === 1) {
        return res.json({ message: "Password reset successfully." });
      } else {
        return res.status(404).json({ message: "User not found." });
      }
    } catch (err) {
      console.error("Reset password error:", err);
      return res.status(500).json({ message: "Server error resetting password." });
    }
  };
}

module.exports = { resetPassword };
