const Auth = require("../Models/AuthModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const user = await Auth.findOne({ email: req.body.email });
    if (!user) return res.status(404).send({ msg: "المستخدم غير موجود!" });

    const valid = await bcrypt.compare(
      req.body.dashboard_password,
      user.dashboard_password
    );
    if (!valid)
      return res
        .status(400)
        .send({ msg: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });

    const accessToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWTSECRET,
      { expiresIn: "10h" }
    );
    const { dashboard_password, ...others } = user._doc;
    return res
      .status(200)
      .send({ user: { ...others }, accessToken: accessToken });
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
};
const signup = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.dashboard_password, salt);
    const user = new Auth({
      email: req.body.email,
      dashboard_password: hashedPass,
      is_dashboard_admin: true,
    });
    const saved = await user.save();
    res.status(200).json(saved);
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};

const updateAdmin = async (req, res) => {
  try {
    console.log("controller " + JSON.stringify(req.body.body));
    const user = await Auth.findOne({ _id: req.params.id });

    if (!user) {
      return res.status(404).send({ msg: "المستخدم غير موجود!" });
    }

    const isMatch = await bcrypt.compare(
      req.body.body.old_pass,
      user.dashboard_password
    );

    if (!isMatch) {
      return res.status(500).send({ msg: "كلمة المرور القديمة غير صحيحة" });
    } else {
      if (req.body.body.dashboard_password) {
        const salt = await bcrypt.genSalt(10);
        req.body.body.dashboard_password = await bcrypt.hash(
          req.body.body.dashboard_password,
          salt
        );
      }

      const updated = await Auth.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      return res.status(200).json(updated);
    }
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};

const getAllAdmins = async (req, res) => {
  try {
    const items = await Auth.find();
    res.status(200).json({ admins: items });
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};

module.exports = { login, signup, updateAdmin, getAllAdmins };
