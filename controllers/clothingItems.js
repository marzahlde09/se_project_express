const ClothingItem = require("../models/clothingItem");
const {
  VALIDATION_ERROR_CODE,
  DOES_NOT_EXIST_ERROR_CODE,
  DEFAULT_ERROR_CODE,
} = require("../utils/errors");

module.exports.getClothingItems = (req, res) => {
  ClothingItem.find({})
    .populate("owner")
    .then((items) => res.send({ data: items }))
    .catch((err) => {
      console.error(err);
      return res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports.createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
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

module.exports.deleteClothingItem = (req, res) => {
  ClothingItem.findByIdAndRemove(req.params.id)
    .orFail(() => {
      const error = new Error("Clothing item ID not found");
      error.statusCode = DOES_NOT_EXIST_ERROR_CODE;
      throw error;
    })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      console.error(err);
      return res.status(err.statusCode).send({ message: err.message });
    });
};

module.exports.likeClothingItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .orFail(() => {
      const error = new Error("Clothing item ID not found");
      error.statusCode = DOES_NOT_EXIST_ERROR_CODE;
      throw error;
    })
    .then((item) => res.send({data: item}))
    .catch((err) => {
      console.error(err);
      return res.status(err.statusCode).send({ message: err.message });
    });
};

module.exports.dislikeClothingItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true })
    .orFail(() => {
      const error = new Error("Clothing item ID not found");
      error.statusCode = DOES_NOT_EXIST_ERROR_CODE;
      throw error;
    })
    .then((item) => res.send({data: item}))
    .catch((err) => {
      console.error(err);
      return res.status(err.statusCode).send({ message: err.message });
    });
};
