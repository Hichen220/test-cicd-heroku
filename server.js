require("dotenv").config();
const express = require("express");
require("./database");
const MoviesController = require("./Movies/MovieController");
const ActorsController = require("./Actors/ActorController");
const UserRouter = require("./Users/user.router");

const app = express();
const port = 5000;

console.log(process.env.DATABASE_URL);

app.use(express.json());
app.use(MoviesController);
app.use(ActorsController);
app.use(UserRouter);

app.listen(port, () => {
  console.log("welcome to ", process.env.APP_NAME);
  console.log("server listening on port " + port);
});
