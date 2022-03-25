const Actor = require("./ActorSchema");
const express = require("express");
const { request } = require("express");

const router = express.Router();

function updateActor(actorId, updateContent, response, overwrite = false) {
  Actor.findByIdAndUpdate(actorId, updateContent, { new: true, overwrite: overwrite })
    .then((data) => {
      response.send(data);
    })
    .catch((err) => {
      response.status(404);
      response.send("cannot find the actor");
    });
}

router
  .route("/actors")
  .get((request, response) => {
    Actor.find().then((data) => {
      console.log(data);
      response.send(data);
    });
  })
  .post((req, res) => {
    const actorDetails = req.body;

    const newActor = new Actor(actorDetails);

    newActor.save().then((data) => {
      console.log(newActor.fullName + " added");
      console.log(data);
      res.status(201);
      res.send(data);
    });
  });

router
  .route("/actors/:actorId")
  .get((req, res) => {
    const actorId = req.params.actorId;
    // const {actorId} = req.params

    Actor.findOne({ _id: actorId })
      .then((data) => {
        res.send(data);
      })
      .catch(() => {
        res.status(404);
        res.send("cannot find the actor");
      });
  })
  .put((req, res) => {
    const { actorId } = req.params;
    const actorDetails = req.body;

    updateActor(actorId, actorDetails, res, true);
  })
  .patch((req, res) => {
    const { actorId } = req.params;
    const actorDetails = req.body;

    updateActor(actorId, actorDetails, res, false);
  });

module.exports = router;
