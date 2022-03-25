const mongoose = require("mongoose");

const ActorSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  dateOfBirth: Date,
  //   appearedIn: [],
});

ActorSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
  },
});

ActorSchema.virtual("fullName").set(() => {
  return this.firstName + " " + this.lastName;
});

ActorSchema.pre("save", (next) => {
  const d = Date.now();

  this.createdAt = d;

  next();
});

const ActorModel = mongoose.model("Actor", ActorSchema);

module.exports = ActorModel;
