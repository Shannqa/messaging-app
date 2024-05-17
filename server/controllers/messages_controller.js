import User from "../models/userSchema.js";
import Conversation from "../models/conversationSchema.js";

export const messages_post = async (req, res) => {
  try {
    const partner = await User.findOne({ _id: req.body.partner }).exec();
    if (!partner) {
      res.status(400).json({
        success: false,
      });
    } else {
      const conversation = await Conversation.findOne({
        participants: { $all: [partner, req.user.id] },
      })
        .populate({
          path: "messages",
          populate: [
            {
              path: "sender",
              model: "User",
            },
          ],
        })
        .exec();

      if (
        conversation == null ||
        !conversation.messages ||
        conversation.messages.length < 1
      ) {
        res.status(204).json({
          success: true,
          msg: "There are no messages in the database",
        });
      } else {
        const allMessages = conversation.messages.map((msg) => {
          return {
            name: msg.sender.username,
            text: msg.text,
            date: msg.date,
          };
        });
        res.status(200).json({
          success: true,
          messages: JSON.stringify(allMessages),
        });
      }
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err,
    });
  }
};
