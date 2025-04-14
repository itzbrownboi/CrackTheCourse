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
                        ["Chats.chat_send.${to}"]: messageEntry
                    }
                },
                {upsert: true}
            );

            await user.updateOne(
                {email: to},
                {
                    $push: {
                        ["Chats.chat_recieve.${email}"]: messageEntry
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
module.exports = {chat_send_recieve}

