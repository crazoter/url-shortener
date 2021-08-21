const env = process.env.NODE_ENV || 'development';
const path = __dirname + '/app/views/';

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
var corsOptions = {
  origin: "http://localhost:8081"
};

const app = express();
app.use(express.static(path));
app.use(cors(corsOptions));
app.use(bodyParser.json());                         // parse requests of content-type - application/json
app.use(bodyParser.urlencoded({ extended: true })); // parse requests of content-type - application/x-www-form-urlencoded

// Sync db
const db = require("./app/models");
// Production
if (env == 'development') {
    db.sequelize.sync({ force: true }).then(() => {
        console.log("Drop and re-sync db.");
    });
} else {
    db.sequelize.sync();
}

// main index route
app.get("/", (req, res) => {
  // res.json({ message: "Welcome to my application" });
  res.sendFile(path + "index.html");
});

// include routes
require("./app/routes/url.routes.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// for mocha
module.exports = app;