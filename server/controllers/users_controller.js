import User from "../models/userSchema.js";

const users_addcontact = async (req, res) => {
  const isInContacts = await User.find({
    _id: req.user.id,
    contacts: { _id: req.body.target },
  });

  if (isInContacts.length > 0) {
    return res
      .status(400)
      .json({ success: false, message: "User is already in contacts" });
  }
  try {
    const targetUser = await User.findById(req.body.target);

    await User.findByIdAndUpdate(
      req.user.id,
      {
        $push: { contacts: targetUser },
      },
      { new: true, upsert: true }
    )
      .populate("contacts")
      .exec();

    const [newContacts] = await User.find({ _id: req.user.id }).populate(
      "contacts"
    );
    console.log("nww", newContacts);
    res.status(200).json({
      success: true,
      message: "successful",
      contacts: newContacts.contacts,
    });
  } catch {
    console.log(err);
    res.status(400).json({
      success: false,
      message: "failure",
      contacts: newContacts.contacts,
    });
  }
};

const users_deletecontact = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { contacts: req.body.target },
    })
      .populate("contacts")
      .exec();

    const [newContacts] = await User.find({ _id: req.user.id }).populate(
      "contacts"
    );

    res.status(200).json({
      success: true,
      message: "successful",
      contacts: newContacts.contacts,
    });
  } catch {
    console.log(err);
    res.status(400).json({
      success: false,
      message: "failure",
      contacts: req.user.contacts,
    });
  }
};

const users_getcontacts = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("contacts", ["username"])
      .exec();
    console.log(user);
    res.status(200).json({ user });
  } catch {
    console.log(err);
    res.status(400).json({
      success: false,
      message: "failure",
      contacts: req.user.contacts,
    });
  }
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

export {
  users_get,
  users_post,
  users_addcontact,
  users_getcontacts,
  users_deletecontact,
};
