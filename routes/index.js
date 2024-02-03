const router = require("express").Router();
const itemsRouter = require("./items");
const usersRouter = require("./users");
const {validateUserBody, validateLogin} = require("../middlewares/validation");
const { createUser, login } = require("../controllers/users");

router.use("/items", itemsRouter);
router.use("/users", usersRouter);
router.use("/signin", validateLogin, login);
router.use("/signup", validateUserBody, createUser);
router.use((req, res) =>
  res.status(404).send({
    message: "Requested resource not found",
  }),
);

module.exports = router;
