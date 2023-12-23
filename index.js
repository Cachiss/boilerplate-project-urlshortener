require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

let urls = [];
// Basic Configuration
const port = process.env.PORT || 3000;

const isValidUrl = (urlString) => {
  var urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // validate protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
      "(\\#[-a-z\\d_]*)?$",
    "i",
  ); // validate fragment locator
  return !!urlPattern.test(urlString);
};

app.use(cors());
app.use(express.urlencoded());
app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

/*
You can POST a URL to /api/shorturl and get a JSON response with original_url and short_url properties. Here's an example: { original_url : 'https://freeCodeCamp.org', short_url : 1}
*/
// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});
app.post("/api/shorturl", (req, res) => {
  const url = req.body.url;
  const short_url = urls.length + 1;

  if (!isValidUrl(url)) {
    return res.json({ error: "invalid url" });
  }
  urls.push({
    original_url: url,
    short_url,
  });
  res.json({
    original_url: url,
    short_url,
  });
  console.log(urls);
});

app.get("/api/shorturl/:short_url", (req, res) => {
  const short_url = req.params.short_url;
  console.log(short_url);
  urls.find((url) => {
    if (url.short_url == short_url) {
      res.redirect(url.original_url);
    }
  });

  res.json({ error: "invalid url" });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

