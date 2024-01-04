const express = require("express");
const bodyParser = require("body-parser");
const e = express();
const userRoutes = require("./routes/user");
const taskroutes = require("./routes/task");

require("dotenv").config();
require("./db");

const port = 3000;

e.use(bodyParser.json());
e.use("/user", userRoutes);
e.use("/task", taskroutes);

e.get("/", (req, res) => {
  res.send(
    "Chiro Splinter API. Deze API is bedoeld om taken die je na een zondag nog moet doen bijj te houden en te bekijken"
  );
});
e.listen(port, () => {
  console.log(`Server running on port 3000`);
});
