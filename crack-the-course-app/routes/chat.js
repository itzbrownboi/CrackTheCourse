//routes/chat.js

const { Timestamp } = require("mongodb");

//This allows us to update the send/receive chat for any user
//For sending and receiveing, it will required the email of the person it is being sent to
/*
{
    "email": "alice@example.com",
    "chat_body": {
        "to": "bob@example.com",
        "message": "Hi"
    }

}
*/


function chat_send_recieve(db){
    return async (req, res) => {
        const {email, chat_body} = req.body;
        const {to, message} = chat_body;

        if (!email || !to || !message){
            return res.status(400).json({error: "Missing required fields: email, to, message"});

        }

        const users = db.collection("users");

        const timestamp = new Date();
        const messageEntry = {
            message,
            timestamp
        };

        try{
            await users.updateOne(
                {email: email},
                {
                    $push: {
                        [`chats.chat_send.${to}`]: messageEntry
                    }
                },
                {upsert: true}
            );

            await users.updateOne(
                {email: to},
                {
                    $push: {
                        [`chats.chat_recieve.${email}`]: messageEntry
                    }
                },
                {upsert: true}
            );

            return res.status(200).json({message: "Message sent and received with timestamp"});
        } catch (err){
            res.status(500).json({message: "Server error"});
        }
    }
}
//module.exports = {chat_send_recieve}

function chat_get(db){
    return async (req, res) => {
        const{email, to } = req.body;


        if(!email || !to) {
            return res.status(400).json({error: "Missing required fields: email, to"});
            
        }

        const users = db.collection("users");
        try{
            const user = await users.findOne({email});

            if(!user){
                return res.status(404).json({error:"User not found"});
            
            
            }

            return res.status(200).json({
                chats_recieved: user.chats?.chat_recieved || {},
                chats_sent: user.chats?.chats_sent || {}
            });
        } catch (err){
            return res.status(500).json({error: "Server error"});
        }
    }
}
module.exports = {chat_get, chat_send_recieve};

