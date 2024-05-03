require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.post("/api/shorturl", function (req, res) {
  const { url: _url } = req.body;

  if (_url === "") {
    return res.json({
      error: "invalid url",
    });
  }

  let parsed_url;
  const modified_url = _url.replace(
    /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/,
    ""
  );

  try {
    parsed_url = new URL(_url);
  } catch (err) {
    return res.json({
      error: "invalid url",
    });
  }

  DNS.lookup(modified_url, (err) => {
    if (err) {
      return res.json({
        error: "invalid url",
      });
    } else {
      const link_exists = URLs.find((l) => l.original_url === _url);

      if (link_exists) {
        return res.json({
          original_url: _url,
          short_url: id,
        });
      } else {
        // increment for each new valid url
        ++id;

        // object creation for entry into url
        const url_object = {
          original_url: _url,
          short_url: `${id}`,
        };

        // pushing each new entry into the array
        URLs.push(url_object);

        // return the new entry created
        return res.json({
          original_url: _url,
          short_url: id,
        });
      }
    }
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
