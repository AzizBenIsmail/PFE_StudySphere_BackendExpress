const Conversation = require("../models/conversationSchema.js");
const Message = require("../models/messageSchema.js");
const { getReceiverSocketId, io } = require("../socket/socket.js");

module.exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.session.user._id;
    const file = req.file;

    console.log('Sender ID:', senderId);
    console.log('Receiver ID:', receiverId);
    console.log('Message:', message);
    console.log('File:', file);

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

  

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      file
    });

    console.log('New Message:', newMessage);



    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await Promise.all([conversation.save(), newMessage.save()]);

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.session.user._id;

    console.log("Sender ID:", senderId);
    console.log("User to Chat ID:", userToChatId);

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    console.log("Conversation:", conversation);

    if (!conversation) return res.status(200).json([]);

    const messages = conversation.messages;

    console.log("Messages:", messages);

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
