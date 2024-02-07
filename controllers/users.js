const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const ConflictError = require("../errors/ConflictError");
const UnauthorizedError = require("../errors/UnauthorizedError");
require("dotenv").config();

const { JWT_SECRET } = process.env;

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      next(new NotFoundError("User ID not found"));
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("The id string is in an invalid format"));
      } else {
        next(err);
      }
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      next(new NotFoundError("User ID not found"));
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("The id string is in an invalid format"));
      } else if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid user data"));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name, avatar } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ email, password: hash, name, avatar }))
    .then((user) =>
      res.send({
        data: {
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          _id: user._id,
          __v: user.__v,
        },
      }),
    )
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid user data"));
      } else if (err.name === "MongoServerError") {
        next(new ConflictError("That email is already associated with a user"));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      if (err.statusCode === 401) {
        next(new UnauthorizedError(err.message));
      } else if (err.statusCode === 400) {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};
