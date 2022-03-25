const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  overview: String,
  poster: String,
  release_date: Number,
  createdAt: Date,
  comments: [String],
  likes: {
    type: Number,
    default: 0,
  },
  genres: [String],
});

MovieSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
  },
});

const Movie = mongoose.model("Movie", MovieSchema);

module.exports = Movie;
