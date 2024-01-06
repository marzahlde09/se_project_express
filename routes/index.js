const router = require("express").Router();
const itemsRouter = require("./items");
const usersRouter = require("./users");
const { DOES_NOT_EXIST_ERROR_CODE } = require("../utils/errors");

router.use("/items", itemsRouter);
router.use("/users", usersRouter);
router.use((req, res) =>
  res.status(DOES_NOT_EXIST_ERROR_CODE).send({
    message: "Requested resource not found",
  }),
);

module.exports = router;
