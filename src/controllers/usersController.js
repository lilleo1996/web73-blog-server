const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { db } = require("../utils/connectDb");

const saltRounds = 10;

// REGISTER
const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUsername = await db.users.findOne({ username });

    if (existingUsername) {
      return res.status(409).json({
        message: "Username already exist",
        data: null,
        isSuccess: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
      username,
      password: hashedPassword,
    };

    await db.users.insertOne(newUser);
    res.status(201).json({
      message: "Register successful",
      data: newUser,
      isSuccess: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      data: null,
      isSuccess: false,
    });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await db.users.findOne({ username });

    if (!user) {
      return res.status(409).json({
        message: "Username does not exist",
        data: null,
        isSuccess: false,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Password is not valid",
        data: null,
        isSuccess: false,
      });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(201).json({
      message: "Login successful",
      data: user,
      token,
      isSuccess: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      data: null,
      isSuccess: false,
    });
  }
};

module.exports = {
  register,
  login,
};
