const router = require("express").Router();
const itemsRouter = require("./items");
const usersRouter = require("./users");
const { createUser, login } = require("../controllers/users");

router.use("/items", itemsRouter);
router.use("/users", usersRouter);
router.use("/signin", login);
router.use("/signup", createUser);
router.use((req, res) =>
  res.status(404).send({
    message: "Requested resource not found",
  }),
);

module.exports = router;
