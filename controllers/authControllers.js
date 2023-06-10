const userModel = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");


const maxAge = 3 * 24 * 60 * 60 // 3 days

const createToken = (id) => {
  return jwt.sign({id},'net attijari secret',{
    expiresIn : maxAge 
  })
}

module.exports.signup_get = (req, res) => {
  const token = createToken(213);
  res.cookie('jwt_token', token, { httpOnly: true, maxAge: 20 * 1000 });
  res.status(200).json("signup_get");
};

module.exports.signup_post = async (req, res) => {
  const { filename } = req.file;
  const { email, password, username } = req.body;

  try {
    const user = await userModel.create({username,password,email,image_user: filename,
    });
    const token = createToken(user._id);
    res.cookie('jwt_token', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.login_get = (req, res) => {
  res.status(200).json("login_get");
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt_token', token, { httpOnly: true , maxAge: 3 * 24 * 60 * 60 });
    res.status(200).json("login_post");
  } catch (error) {
    res.status(400).json( {message: error.message});

  }
};

module.exports.logout = (req, res) => {
  res.cookie('jwt_token', '', { maxAge: 1 });
  res.status(200).json("logout");
};

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await userModel.find();
    if (!users || users.length === 0) {
      throw new Error("users not found !");
    }
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exportsgetUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);
    if (!user || user.length === 0) {
      throw new Error("users not found !");
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.addUser = async (req, res, next) => {
  try {
    const { filename } = req.file;
    console.log("filename", req.file);
    const {
      username,
      password,
      email,
      first_Name,
      last_Name,
      phoneNumber,
      userType,
    } = req.body;
    console.log(req.body);
    const user = new userModel({
      username,
      password,
      email,
      first_Name,
      last_Name,
      phoneNumber,
      userType,
      image_user: filename,
    });

    const addeduser = await user.save();

    res.status(200).json(addeduser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports.updateUser = async (req, res, next) => {
  try {
    const { first_Name, last_Name, phoneNumber, password } = req.body;
    console.log(req.body);
    const { id } = req.params;
    const checkIfusertExists = await userModel.findById(id);
    if (!checkIfusertExists) {
      throw new Error("user not found !");
    }
    const currentDate = new Date();
    updateedUser = await userModel.findByIdAndUpdate(
      id,
      {
        $set: {
          password,
          first_Name,
          last_Name,
          phoneNumber,
          updated_at: currentDate,
        },
      },
      { new: true }
    );
    res.status(200).json(updateedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({ message: "user not found!" });
    }

    await userModel.findByIdAndDelete(user._id);

    res.status(200).json("deleted");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.forgotpwd = async (req, res) => {
  const { email } = req.body;
  const URL = "http://localhost:3000/resetpwd";

  try {
    res.status(200).json({ message: "Welcome" });
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: email,
      from: "greencrowdproject@gmail.com",
      subject: "Welcome to Green Crowd Project",
      html: `
				<h2>Click the link to reset your password</h2>
				<p>${URL}</p>
			`,
      //templateId: 'd-e09cf57a0a0e45e894027ffd5b6caebb',
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
