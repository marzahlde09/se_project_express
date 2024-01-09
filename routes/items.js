const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/items");

router.get("/", getItems);

router.use(auth);

router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);
router.post("/", createItem);
router.delete("/:itemId", deleteItem);

module.exports = router;
