const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/items");

router.use("/", (req, res, next) => {
  if (res.statusCode === 404) {
    return res
      .status(res.statusCode)
      .send({ message: "Requested resource not found" });
  }
  next();
});
router.post("/", createItem);
router.get("/", getItems);
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId", deleteItem);
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
