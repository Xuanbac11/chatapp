var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var spRouter = require("./routes/spRouter");

var userCtrl = require("./controllers/UserController")


const { createServer } = require("http");
const { Server } = require("socket.io");

var app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });


// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api/user", usersRouter);
app.use("/api/sp", spRouter);

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

  if (req.originalUrl.indexOf("/api") == 0) {
    // đang truy cập vào link api
    res.json({
      status: 0,
      msg: err.message,
    });
  } else {
    res.render("error");
  }
});

io.on("connection", (socket) => {
  socket.on("Send_mess", (idUser,fullname,content) => {
    userCtrl.addChat(idUser,content)
  })
});

exports.sendSocket = (idUser,fullname,content) => {
  io.emit("ThongBaoTuServer", idUser,fullname,content);
}

httpServer.listen(443);

module.exports = app;
