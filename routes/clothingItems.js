const router = require("express").Router();
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
} = require("../controllers/clothingItems");

router.use("/", (req, res, next) => {
  if(res.statusCode === 404){
    return res.status(res.statusCode).send({ "message": "Requested resource not found" });
  }
  next();
});
router.get("/", getClothingItems);
router.get("/", createClothingItem);
router.post("/:id", deleteClothingItem);

module.exports = router;
