const router = require("express").Router();
const auth = require("../middlewares/auth");
const {validateCardBody, validateId} = require("../middlewares/validation");
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/items");

router.get("/", getItems);

router.use(auth);

router.put("/:id/likes", validateId, likeItem);
router.delete("/:id/likes", validateId, dislikeItem);
router.post("/", validateCardBody, createItem);
router.delete("/:id", validateId, deleteItem);

module.exports = router;
