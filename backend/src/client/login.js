const users = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    // Find user
    const user = await users.findOne({ username: req.body.username });
    
    if (!user) {
      return res.json({ status: false, message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res.json({ status: false, message: "Invalid password" });
    }

    // Generate token
    const token = jwt.sign(
      {
        user_id: user._id.toString(),
        username: user.username.toString(),
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ 
      token: token, 
      status: true,
      user: {
        id: user._id,
        name: user.name,
        username: user.username
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.json({ status: false, error: err.message });
  }
};

module.exports = login;