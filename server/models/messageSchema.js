import mongoose from "mongoose";

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  conversation: {
    type: Schema.Types.ObjectId,
    ref: "Conversation",
    required: false,
  },
});

const Message = mongoose.model("Message", MessageSchema);

export default Message;
