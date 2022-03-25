const express = require("express");
const router = express.Router();
const UserController = require("./user.controller");

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  UserController.loginWithEmail(email, password)
    .then((token) => {
      res.send({ status: "OK", token: token });
    })
    .catch((err) => {
      res.status(404);
      res.send({ message: "User not found" });
    });
});

router.post("/login/username", (req, res) => {
  const { username, password } = req.body;

  UserController.loginWithUsername(username, password)
    .then((token) => {
      res.send({ status: "OK", token: token });
    })
    .catch((err) => {
      res.status(404);
      res.send({ message: "User not found" });
    });
});

router.post("/register", (req, res) => {
  const details = req.body;
  UserController.register(details)
    .then((user) => {
      res.status(201);
      const token = UserController.generateAccessToken(user.id);
      const resObject = {
        id: user.id,
        token,
        email: user.email,
        username: user.username,
        role: user.role,
      };
      res.send(resObject);
    })
    .catch((err) => {
      const dupKeys = Object.keys(err.keyPattern).toString();
      res.status(401);
      res.send({
        message: `Cannot register, ${dupKeys} are duplicate `,
      });
    });
});

router.get("/profile", UserController.requireAuth, (req, res) => {
  const { userId } = req.body;
  UserController.getProfile(userId)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.status(404);
      res.send({ message: "profile not found" });
    });
});

module.exports = router;
