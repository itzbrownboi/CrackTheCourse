// routes/profiel_update.js
//Needs user email to find user. User cannot change email.
//Needs a body for update with all variable specified that need to updated

const bcrypt = require("bcrypt");

function profileUpdates(db){
    return async (req, res) => {
        const userEmail = req.query.email;
        const users = db.collection("users");
        const {
            firstName,
            lastName,
            email,
            password,
            role,
            educationLevel,
            profile = {}

        } = req.body;

        if(!userEmail) {
            return res.status(400).json({error: "Email is required to fetch proflie"});
        }

        const user = await users.findOne ({email: userEmail});

        if(!user) {
            return res.status(404).json({error: "User not found. Please try again"});
        }

        
        try {
            const updateFields = {
              firstName,
              lastName,
              educationLevel,
              role,
              profile
            };
                    
            if (password && password.trim() !== "") {
              const hashedPassword = await bcrypt.hash(password, 10);
              updateFields.password = hashedPassword;
            }
          
            const result = await users.updateOne(
              { email: userEmail },
              { $set: updateFields }
            );
                    
            return res.status(200).json({ message: "User profile updated successfully" });

          } catch (err) {
            res.status(500).json({ message: "Server error" });
          }          

        };
        
    }

module.exports = {profileUpdates};