let express = require("express");
let app = express();
let monk = require("monk");
let db = monk("127.0.0.1:27017/assignment2");
let session = require("express-session");
let cors = require("cors");

app.use(
  cors(),
  session({
    secret: "random_string_goes_here",
    resave: false,
    saveUninitialized: true,
  }),
  express.static("public"),
  function (req, res, next) {
    req.db = db;
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Credentials", true);
    next();
  }
);

app.options("*", cors());

let notes = require("./routes/notes");
app.use("/", notes);

var server = app.listen(3001, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});
