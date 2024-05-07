import User from "../models/userSchema.js";

const users_get = async (req, res) => {
  try {
    const allUsers = await User.find().sort({ username: 1 }).exec();
    res.send(allUsers);
  } catch (err) {
    res.status(500).send(err);
  }
};

const users_post = async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
};

export { users_get, users_post };
