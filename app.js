const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const { errors } = require("celebrate");
const { errorHandler } = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const { PORT = 3001 } = process.env;
const app = express();

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

const routes = require("./routes");

app.use(requestLogger);
app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {});
