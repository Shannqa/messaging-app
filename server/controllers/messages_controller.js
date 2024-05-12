import User from "../models/userSchema.js";
import Conversation from "../models/conversationSchema.js";

export const messages_post = async (req, res) => {
  console.log(req.body.partner);
  const partner = await User.findOne({ username: req.body.partner }).exec();
  console.log(partner);
  if (partner) {
    const conversation = await Conversation.findOne({
      participants: { $all: [partner.id, req.user.id] },
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
      !conversation ||
      !conversation.messages ||
      conversation.messages.length < 1
    ) {
      res.status(400).json({
        success: false,
        msg: "There are no messages in the database",
      });
    }
    const allMessages = conversation.messages.map((msg) => {
      return {
        name: msg.sender.username,
        text: msg.text,
        date: msg.date,
      };
    });
    console.log(allMessages);
    res.status(200).json({
      success: true,
      messages: JSON.stringify(allMessages),
    });
  } else {
    res.status(400).json({
      success: false,
    });
  }

  // find partner's id
  // find conversation with user.id and partner.id
  // send back all messages belonging to the conversation

  // req.body.partner

  // if (req.user) {
  //   res.status(200).json({
  //     success: true,
  //   });
  // } else {
  //   res.status(401).json({ success: false, message: "failure" });
  // }
};
