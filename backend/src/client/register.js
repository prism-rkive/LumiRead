const users = require('../models/users');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
  try {
    if (!req.body) {
      return res.json({ status: false, type: "empty" });
    }

    // Check if username exists
    const checkUser = await users.find({ username: req.body.username });
    if (checkUser.length > 0) {
      return res.json({ status: false, type: "username" });
    }

    // Check if number exists
    const checkNumber = await users.find({ number: req.body.number });
    if (checkNumber.length > 0) {
      return res.json({ status: false, type: "number" });
    }

    // Hash password
    const stringpass = req.body.password + "";
    const hashedPassword = await bcrypt.hash(stringpass, 12);

    // Create user
    const user = await users.create({
      name: req.body.name,
      number: req.body.number,
      username: req.body.username,
      password: hashedPassword,
    });

    console.log(user.username + " saved");

    return res.status(200).json({ 
      status: true,
      message: "Success! User registered"
    });

  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ status: false, error: err.message });
  }
};

module.exports = register;