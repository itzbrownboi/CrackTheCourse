//Likes.js
//Will send out likes to database
//Requires persons email and the person you liked email
function likes_post(db){
    return async (req, res) => {
        const {email, like_email, insert} = req.body;
        
        if(!email || !like_email) {
            return res.status(400).json({error: "Missing required fields: email, like_email"});
        }

        const users = db.collection("users");
        
        try{
            const userDoc = await users.findOne({email});

            if(!userDoc) {
                return res.status(404).json({error: "User not found"});

            }
            
            const list = userDoc.likes || [];

            if (list.includes(like_email)) {
                await users.updateOne(
                    {email},
                    {$pull: {likes: like_email}}
                );
                res.status(200).json({message: "User removed from likes"});
            } else{
                await users.updateOne(
                    {email},
                    {$push: {likes: like_email}}
                );
                res.status(200).json({message: "User added to likes"});
            }
        } catch (err) {
            res.status(500).json({message: "Server Error"});
        }

    }
    
}
// module.exports = {likes_post};

function likes_get(db){
    return async (req, res) => {
        const userEmail = req.query.email;
        const users = db.collection("users");

        if(!userEmail){
            return res.status(400).json({message: "Email is required to get likes"});
        }

        const user = await users.findOne({email: userEmail});

        if(!user){
            return res.status(404).json({error: "User not found"
            });
        }
        try{
            if(user.email == userEmail) {
            return res.json({
                likes
            });
        }
        } catch (err){
            return res.status(500).json({error: "Server error"});
        }
    }
}
module.exports = {likes_get, likes_post}