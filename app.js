const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(express.json());
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb://localhost:27017/soeDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Connected to database");
  }
);
const sessionschema = mongoose.Schema({
  day: String,
  date: String,
  time: String,
});
const Item = mongoose.model("Item", sessionschema);
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
app.use(express.static("public"));
app.get("/", function (req, res) {
  res.render("index", { msg: "" });
});

app.get("/emergency", function (req, res) {
  Item.find({}, function (err, foundItems) {
    if (!err) {
      res.render("emergency", { posts: foundItems });
    } else {
      console.log("error");
    }
  });
});

app.post("/", function (req, res) {
  let user = req.body.username;
  let pass = req.body.password;
  if (user === "admin" && pass === "12345") {
    Item.find({}, function (err, foundItems) {
      if (!err) {
        res.render("emergency", { posts: foundItems });
      } else {
        res.render("index", { msg: "Something went wrong!" });
      }
    });
  } else {
    res.render("index", { msg: "Incorrect credentials. Please try again." });
  }
});

app.post("/database", function (req, res) {
  var all = Date();
  var day = all.substr(0, 4);
  var date = all.substr(4, 11);
  var time = all.substr(16, 9);
  console.log(time);
  const t = new Item({
    day: day,
    date: date,
    time: time,
  });
  t.save(function (err) {
    if (!err) res.send("entry added!");
    else res.send("Something went wrong");
  });
});
app.listen(3001, function () {
  console.log("Server started on port 3001");
});
