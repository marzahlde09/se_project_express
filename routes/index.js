const router = require("express").Router();
const clothingItemsRouter = require('./clothingItems');
const usersRouter = require('./users');
const {DEFAULT_ERROR_CODE} = require('../utils/errors');

router.use('/clothingItems', clothingItemsRouter);
router.use('/users', usersRouter);
router.use((req, res) => {
  return res.status(DEFAULT_ERROR_CODE).send({
    "message": "Requested resource not found"
  });
});

module.exports = router;
