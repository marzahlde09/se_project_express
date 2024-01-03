const router = require("express").Router();
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
} = require("../controllers/clothingItems");

router.get("/", getClothingItems);
router.get("/", createClothingItem);
router.post("/:id", deleteClothingItem);

module.exports = router;
