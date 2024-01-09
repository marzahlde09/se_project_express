const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const {
  VALIDATION_ERROR_CODE,
  DOES_NOT_EXIST_ERROR_CODE,
  DEFAULT_ERROR_CODE,
  UNAUTHORIZED_ERROR_CODE,
} = require("../utils/errors");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      console.error(err);
      return res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports.getUser = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res
      .status(VALIDATION_ERROR_CODE)
      .send({ message: "Invalid user ID" });
  }
  User.findById(req.params.id)
    .orFail(() => {
      const error = new Error("User ID not found");
      error.statusCode = DOES_NOT_EXIST_ERROR_CODE;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      console.error(err);
      if (err.statusCode === DOES_NOT_EXIST_ERROR_CODE) {
        return res.status(err.statusCode).send({ message: err.message });
      }
      return res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: "An error has occurred on the server." });
    });
  return res;
};

module.exports.createUser = (req, res) => {
  const { email, password, name, avatar } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ email, password: hash, name, avatar }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      console.error(err.name);
      if (err.name === "ValidationError") {
        return res
          .status(VALIDATION_ERROR_CODE)
          .send({ message: "Invalid user data" });
      }
      if (err.name === "MongoServerError") {
        return res.status(VALIDATION_ERROR_CODE).send({
          message: "That email is already associated with a user",
        });
      }
      return res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      console.error(err.name);
      return res.status(UNAUTHORIZED_ERROR_CODE).send({ message: err.message });
    });
};
