const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/UnauthorizedError");

require("dotenv").config();

const { JWT_SECRET = "dev-key" } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    next(new UnauthorizedError("Auth required"));
  }
  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedError("Auth required"));
  }
  req.user = payload;
  return next();
};
