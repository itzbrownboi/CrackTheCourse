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


function chat_send_recieve(db) {
    return async (req, res) => {
        const { email, chat_body } = req.body;

        if (!chat_body || !email) {
            return res.status(400).json({ error: "Missing chat_body or email" });
        }

        const { to, message } = chat_body;

        if (!email || !to || !message) {
            return res.status(400).json({ error: "Missing required fields: email, to, message" });
        }

        const users = db.collection("users");

        const timestamp = new Date();
        const messageEntry = { message, timestamp };

        // Safely encode emails for dot-safe MongoDB keys
        const toKey = to.replace(/\./g, "[dot]");
        const emailKey = email.replace(/\./g, "[dot]");

        try {
            await users.updateOne(
                { email: email },
                {
                    $push: {
                        [`chats.chats_sent.${toKey}`]: messageEntry
                    }
                },
                { upsert: true }
            );

            await users.updateOne(
                { email: to },
                {
                    $push: {
                        [`chats.chats_received.${emailKey}`]: messageEntry
                    }
                },
                { upsert: true }
            );
            
            return res.status(200).json({ message: "Message sent and received with timestamp" });
        } catch (err) {
            console.error("Send error:", err);
            res.status(500).json({ message: "Server error" });
        }
    };
}

//module.exports = {chat_send_recieve}

function chat_get(db) {
    return async (req, res) => {
        const { email, to } = req.body;

        if (!email || !to) {
            return res.status(400).json({ error: "Missing required fields: email, to" });
        }

        const users = db.collection("users");

        try {
            const user = await users.findOne({ email });
            // console.log(user);

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            const toKey = to.replace(/\./g, "[dot]");
            const emailKey = email.replace(/\./g, "[dot]");

            return res.status(200).json({
                chats_sent: user.chats?.chats_sent?.[toKey] || [],
                chats_received: user.chats?.chats_received?.[toKey] || []
            });
        } catch (err) {
            console.error("Get error:", err);
            return res.status(500).json({ error: "Server error" });
        }
    };
}

module.exports = {chat_get, chat_send_recieve};

