const router = require("express").Router();
const itemsRouter = require("./items");
const usersRouter = require("./users");
const {
  validateUserBody,
  validateLogin,
} = require("../middlewares/validation");
const { createUser, login } = require("../controllers/users");
const { NotFoundError } = require("../errors/NotFoundError");

router.use("/items", itemsRouter);
router.use("/users", usersRouter);
router.use("/signin", validateLogin, login);
router.use("/signup", validateUserBody, createUser);
router.use((req, res, next) =>
  next(new NotFoundError("Requested resource not found")),
);

module.exports = router;
