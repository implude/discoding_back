const path = require("path");
const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");

const app = express();


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/", require("./routes/index"));
app.use("/bot", require("./routes/bot"));

app.listen(80, () => {
  console.log("running");
});
