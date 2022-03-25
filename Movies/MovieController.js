const express = require("express");
const fs = require("fs");
const Movie = require("./MovieSchema");
const { requireAuth, requireAdmin } = require("../Users/user.controller");
const router = express.Router();

function readJSON(path) {
  return JSON.parse(fs.readFileSync(path));
}

function writeJSON(path, content) {
  const strContent = JSON.stringify(content, null, 4);
  fs.writeFile(path, strContent, (err) => {
    if (err) {
      console.log(err);
    }
  });
}

router
  .route("/movies")
  .get(requireAuth, async (req, res) => {
    const { sort } = req.query;
    const limit = +req.query.limit;
    const { genre } = req.query;

    let sortValue;
    if (sort) {
      sortValue = sort == "asc" ? 1 : -1;
    }

    const filterConditions = genre ? { genres: genre } : {};

    const movies = await Movie.find(filterConditions).sort({ title: sortValue }).limit(limit);
    res.send(movies);
  })
  .post((req, res) => {
    const movieDetails = req.body;
    movieDetails.createdAt = new Date();

    Movie.create(movieDetails)
      .then((data) => {
        res.status(201);
        res.send(data);
      })
      .catch((err) => {
        res.status(400);
        res.send(err);
      });
  });

router
  .route("/movies/:movieId")
  .get(function (req, res) {
    // const movieId = req.params.movieId
    const { movieId } = req.params;
    Movie.findById(movieId)
      .then((data) => {
        if (data) {
          res.send(data);
          return;
        } else throw new Error("");
      })
      .catch((err) => {
        res.status(404);
        res.send("cannot find movie");
      });
  })
  .delete(requireAuth, requireAdmin, (req, res) => {
    const { movieId } = req.params;
    Movie.findByIdAndDelete(movieId)
      .then((data) => {
        if (data) {
          res.send(data);
        } else throw new Error("");
      })
      .catch((err) => {
        res.status(404);
        res.send({ message: "cannot find movie" });
      });
  })
  .put((req, res) => {
    const { movieId } = req.params;
    const movieDetails = req.body;

    Movie.findByIdAndUpdate(movieId, movieDetails, { new: true, overwrite: true })
      .then((data) => {
        if (data) {
          res.send(data);
        } else throw new Error("");
      })
      .catch(() => {
        res.status(404);
        res.send("cannot find movie");
      });
  })
  .patch((req, res) => {
    const { movieId } = req.params;
    const movieDetails = req.body;

    Movie.findByIdAndUpdate(movieId, movieDetails, { new: true })
      .then((data) => {
        if (data) {
          res.send(data);
        } else throw new Error("");
      })
      .catch(() => {
        res.status(404);
        res.send("cannot find movie");
      });
  });
module.exports = router;
