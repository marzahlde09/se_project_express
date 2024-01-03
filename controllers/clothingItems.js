const ClothingItem = require("../models/clothingItem");

module.exports.getClothingItems = (req, res) => {
  ClothingItem.find({})
    .populate("owner")
    .then((items) => res.send({ data: items }))
    .catch(() => res.status(500).send({ message: "Error" }));
};

module.exports.createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.send({ data: item }))
    .catch(() => res.status(500).send({ message: "Error" }));
};

module.exports.deleteClothingItem = (req, res) => {
  ClothingItem.findByIdAndRemove(req.params.id)
    .then((item) => res.send({ data: item }))
    .catch(() => res.status(500).send({ message: "Error" }));
};
