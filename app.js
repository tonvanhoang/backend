var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// models
require("./models/post");
require("./models/account");
require("./models/comment");
require("./models/friendship");
require("./models/mesage");
require("./models/favorite");
require("./models/reel");
require("./models/notification")
require('./models/report')
// router
var postRouter = require("./routes/post");
var accountRouter = require("./routes/account");
var commentRouter = require("./routes/comment");
var friendshipRouter = require("./routes/friendship");
var mesageRouter = require("./routes/mesage");
var favoriteRouter = require("./routes/favorite");
var reelRouter = require("./routes/reel");
var notificationRouter = require('./routes/notification')
var followerRouter = require('./routes/followers');
var app = express();
var reportRouter = require('./routes/report')

app.use(cors());

// db
mongoose.connect('mongodb://localhost:27017/mangxahoi')
  .then(() =>
    console.log(">>>>>>>>>>>>>>>>>> Bạn đã kết nối với database thành công")
  )
  .catch((err) =>
    console.log(">>>>>>>>>>> Bạn kết nối khoong thành công", err)
  );

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/post", postRouter);
app.use("/account", accountRouter);
app.use("/comment", commentRouter);
app.use("/friendship", friendshipRouter);
app.use("/mesage", mesageRouter);
app.use("/favorite", favoriteRouter);
app.use("/reel", reelRouter);
app.use('/notification', notificationRouter)
app.use('/followers', followerRouter)
app.use('/report',reportRouter)
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
// account: {
        //     _id: user._id,
        //     email: user.email,
        //     fisrtName: user.fisrtName,
        //     lastName: user.lastName,
        //     avata:user.avata
        // } 