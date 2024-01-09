const mongoose = require("mongoose");
const Item = require("../models/item");
const {
  VALIDATION_ERROR_CODE,
  DOES_NOT_EXIST_ERROR_CODE,
  DEFAULT_ERROR_CODE,
  ACCESS_FORBIDDEN_CODE,
} = require("../utils/errors");

module.exports.getItems = (req, res) => {
  Item.find({})
    .populate("owner")
    .then((items) => res.send({ data: items }))
    .catch((err) => {
      console.error(err);
      return res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports.createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  Item.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      console.error(err.name);
      if (err.name === "ValidationError") {
        return res
          .status(VALIDATION_ERROR_CODE)
          .send({ message: "Invalid clothing item data" });
      }
      return res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports.deleteItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
    return res
      .status(VALIDATION_ERROR_CODE)
      .send({ message: "Invalid item ID" });
  }

  Item.findById(itemId)
    .orFail(() => {
      const error = new Error("Clothing item ID not found");
      error.statusCode = DOES_NOT_EXIST_ERROR_CODE;
      throw error;
    })
    .then((item) => {
      if (!item.owner._id.equals(req.user._id)) {
        const error = new Error(
          "You do not have permisson to delete that item",
        );
        error.statusCode = ACCESS_FORBIDDEN_CODE;
        throw error;
      }
      return Item.findByIdAndDelete(itemId)
        .then(res.send({ data: item }))
        .catch((err) => {
          console.error(err);
          return res
            .status(DEFAULT_ERROR_CODE)
            .send({ message: "An error has occurred on the server." });
        });
    })
    .catch((err) => {
      console.error(err);
      if (err.statusCode === DOES_NOT_EXIST_ERROR_CODE) {
        return res.status(err.statusCode).send({ message: err.message });
      }
      if (err.statusCode === ACCESS_FORBIDDEN_CODE) {
        return res.status(err.statusCode).send({ message: err.message });
      }
      return res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: "An error has occurred on the server." });
    });
  return res;
};

module.exports.likeItem = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
    return res
      .status(VALIDATION_ERROR_CODE)
      .send({ message: "Invalid item ID" });
  }
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      const error = new Error("Clothing item ID not found");
      error.statusCode = DOES_NOT_EXIST_ERROR_CODE;
      throw error;
    })
    .then((item) => res.send({ data: item }))
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

module.exports.dislikeItem = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
    return res
      .status(VALIDATION_ERROR_CODE)
      .send({ message: "Invalid item ID" });
  }
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      const error = new Error("Clothing item ID not found");
      error.statusCode = DOES_NOT_EXIST_ERROR_CODE;
      throw error;
    })
    .then((item) => res.send({ data: item }))
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
