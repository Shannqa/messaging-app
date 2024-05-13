import User from "../models/userSchema.js";

const users_addcontact = async (req, res) => {
  try {
    User.findByIdAndUpdate(
      req.user.id,
      {
        $push: { contacts: req.body.target },
      },
      { new: true, upsert: true }
    ).exec();
  } catch {
    console.log(err);
    res.status(400).end();
  }

  res.status(200).end();
};

const users_getcontacts = async (req, res) => {
  try {
    const user = User.findById(req.user.id).populate("contacts").exec();
    console.log(user);
  } catch {
    console.log(err);
    res.status(400).end();
  }

  res.status(200).end();
};

////////////////////// old, check if needed still
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

export { users_get, users_post, users_addcontact, users_getcontacts };
