const bcrypt = require("bcrypt");
const loginRoute = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");

loginRoute.post("", async (request, response) => {
  const { username, password } = request.body;
  const user = await User.findOne({ username });

  const confirmPwd =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!user) {
    return response.status(404).json({ message: "User not found" }).end();
  } else if (!confirmPwd) {
    return response
      .status(400)
      .json({ message: "Invalid Username/Password" })
      .end();
  }

  const userDetails = {
    username: user.username,
    id: user._id,
    name: user.name,
  };

  const token = jwt.sign(userDetails, process.env.SECRET, {
    expiresIn: 60 * 180,
  });

  const message = {
    username,
    token,
  };

  return response.status(200).json(message).end;
});

module.exports = loginRoute;
