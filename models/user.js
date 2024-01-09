const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const validator = require("validator");
const {
  VALIDATION_ERROR_CODE,
  UNAUTHORIZED_ERROR_CODE,
} = require("../utils/errors");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "You must enter a valid email",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password,
) {
  if (!email) {
    const error = new Error("Email is required");
    error.statusCode = VALIDATION_ERROR_CODE;
    return Promise.reject(error);
  }

  if (!password) {
    const error = new Error("Password is required");
    error.statusCode = VALIDATION_ERROR_CODE;
    return Promise.reject(error);
  }

  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        const error = new Error("Incorrect password or email");
        error.statusCode = UNAUTHORIZED_ERROR_CODE;
        return Promise.reject(error);
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          const error = new Error("Incorrect password or email");
          error.statusCode = UNAUTHORIZED_ERROR_CODE;
          return Promise.reject(error);
        }
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
