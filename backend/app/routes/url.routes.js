module.exports = app => {
  const urls = require("../controllers/url.controller.js");

  var router = require("express").Router();

  // Create new
  router.post("/", urls.findOrCreate);

  // Retrieve a single url with id
  router.get("/:shortUrl", urls.findOne);

  // To mimic requirements
  // app.use('/api/urls', router);
  app.use('/', router);
};