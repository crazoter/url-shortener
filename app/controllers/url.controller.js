const db = require("../models");
const crypto = require('crypto');
const Url = db.Url;
const Op = db.Sequelize.Op;
const URL = require("url").URL;

const GEN_ATTEMPTS = 10;
// This value
const CRYPTO_BYTES = 8;

const stringIsAValidUrl = (s) => {
  try {
    new URL(s);
    return true;
  } catch (err) {
    return false;
  }
};

// Create and Save a new Url, and then return the id
async function findOrCreateUrl(req, res) {
  // Extract data
  const submittedUrl = req.body.url;

  // Validate request
  // https://stackoverflow.com/questions/30931079/validating-a-url-in-node-js
  if (!submittedUrl || !stringIsAValidUrl(submittedUrl)) {
    res.status(400).send({ message: `url is invalid ${JSON.stringify(req.body.url)}` });
    return;
  } 

  try {
    // Transaction:
    // First, ascertain that the database does not have the url.
    // If it does, then return the existing short text.
    let data = await db.sequelize.transaction(async (transaction) => {
      let existingEntry = await Url.findOne({
        where: {url: submittedUrl}
      }, {transaction});
      // If it already exists, then just return it
      if (existingEntry) {
        return existingEntry;
      }
      // Otherwise, attempt to generate random short url, and then create.
      for (let i = 0; i < GEN_ATTEMPTS; i++) {
        // https://stackoverflow.com/questions/34386914/generate-unique-random-string-with-javascript
        // We use a crypto library to allow for sufficient randomness
        // 0-9, a-z without capital letters for simplicity
        let shortUrl = ""; 
        shortUrl = crypto.randomBytes(CRYPTO_BYTES).toString('base64');
        shortUrl = shortUrl.replace(/[+\/=]/g, '_');
        // If you want to test the collision issue
        // shortUrl = 'a';
        // https://sequelize.org/master/manual/model-querying-finders.html
        let [createdUrl, created] = await Url.findOrCreate({
          where: { url: submittedUrl },
          defaults: { shortUrl: shortUrl }
        });
        if (created) {
          return createdUrl;
        }
      }

      throw new Error('Creation failed due to exceeding generation attempts');
    });

    res.send({shortUrl: data.shortUrl});
  } catch (err) {
    res.status(500).send({
      // Timeout
      message: err.message || "Error occurred while creating the Url object"
    }); 
  }
};
exports.findOrCreate = findOrCreateUrl;

// Find a Url by short url
// Redirects to url if found, otherwise redirect back to page with query for error msg
exports.findOne = (req, res) => {
    // Extract data
    const shortUrl = req.params.shortUrl;
    // Validate request
    // If the routing is done properly, this should never happen
    if (!shortUrl) {
      // res.status(400).send({ message: "shortUrl is missing from request" + JSON.stringify(req.params) });
      res.redirect('/?msg=' + encodeURIComponent("id is missing from request"));
      return;
    }
  
    Url.findOne({ where: { shortUrl: shortUrl } }).then(data => { 
        if (data) {
          // res.send(data);
          res.redirect(data.url);
        } else {
          errorMsg = encodeURIComponent(`Url with id ${shortUrl} not found`);
          // res.status(500).send({ message: errorMsg });
          res.redirect('/?msg=' + errorMsg);
        }
      }).catch(err => {
        errorMsg = encodeURIComponent(err.message || `Error retrieving Url with id ${shortUrl}`);
        // res.status(500).send({ message: eerrorMsg });
        res.redirect('/?msg=' + errorMsg);
      });
  };