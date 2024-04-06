var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const { default: mongoose } = require("mongoose");
require("dotenv").config();
const passport = require("passport");

var authRouter = require("./routes/auth/router");
var categoriesRouter = require("./routes/category/router");
var productsRouter = require("./routes/product/router");
var suppliersRouter = require("./routes/supplier/router");
var customersRouter = require("./routes/customer/router");
var employeesRouter = require("./routes/employee/router");
var ordersRouter = require("./routes/order/router");
var questionsRouter = require("./routes/questions/router");
var mediaRouter = require("./routes/media/router");
const { CONNECTION_STRING, DB_NAME } = require("./constants/db");
const cors = require("cors");

const {
  passportVerifyToken, // USING
  passportVerifyAccount,
  passportConfigBasic,
} = require("./middlewares/passport");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));
app.use("/public", express.static(path.join(__dirname, "public")));

// Add CORS here
app.use(
  cors({
    origin: "*",
  })
);
mongoose.connect(`${CONNECTION_STRING}${DB_NAME}`);

passport.use(passportVerifyToken);
passport.use(passportVerifyAccount);
passport.use(passportConfigBasic);

app.use("/auth", authRouter);
app.use("/categories", categoriesRouter);
app.use("/products", productsRouter);
app.use("/suppliers", suppliersRouter);
app.use("/customers", customersRouter);
app.use("/employees", employeesRouter);
app.use("/orders", ordersRouter);
app.use("/questions", questionsRouter);
app.use(
  "/media",
  passport.authenticate("jwt", { session: false }),
  mediaRouter
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
