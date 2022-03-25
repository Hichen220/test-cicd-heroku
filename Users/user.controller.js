const User = require("./user.schema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

function generateAccessToken(userId) {
  return jwt.sign(userId, process.env.TOKEN_SECRET, { expiresIn: "10h" });
}

async function requireAuth(req, res, next) {
  const authorization = req.header("Authorization");
  let userId;
  if (!authorization) {
    res.status(403);
    res.send({ error: "Token inexistant" });
    return;
  }
  const [, token] = authorization.split(" ");
  try {
    userId = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await User.findById(userId);
    req.body.userId = user.id;
    next();
  } catch (error) {
    res.status(403);
    res.send({ error: "Token not valid" });
    return;
  }
}

async function requireAdmin(req, res, next) {
  const userId = req.body.userId;
  const user = await User.findById(userId);
  if (user.role != "ADMIN") {
    res.status(403);
    res.send({ message: "you don't have the authorization to do that actions" });
    return;
  }
  next();
}

function loginWithEmail(email, password) {
  return User.findOne({ email: email }).then((user) => {
    if (bcrypt.compareSync(password, user.password)) {
      const token = generateAccessToken(user.id);
      return token;
    } else throw new Error("password incorrect");
  });
}

function loginWithUsername(username, password) {
  return User.findOne({ username }).then((user) => {
    if (bcrypt.compareSync(password, user.password)) {
      const token = generateAccessToken(user.id);
      return token;
    } else throw new Error("password incorrect");
  });
}

function register(userDetails) {
  const hashedPassword = bcrypt.hashSync(userDetails.password, 10);
  userDetails.password = hashedPassword;
  return User.create(userDetails).then((data) => {
    return data;
  });
}

function getProfile(userId) {
  return User.findById(userId).then((user) => {
    if (user) {
      return user;
    } else throw new Error("User not found");
  });
}

module.exports = {
  loginWithEmail,
  loginWithUsername,
  register,
  generateAccessToken,
  requireAuth,
  requireAdmin,
  getProfile,
};
