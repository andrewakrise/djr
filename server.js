const express = require("express");
const path = require("path");
const app = express();

app.use((req, res, next) => {
  if (req.hostname === "www.djsrise.com") {
    return res.redirect(301, `https://www.djrise.party${req.originalUrl}`);
  }
  next();
});

app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/build/index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`RISE DJ Frontend server listening on ${port}`);
});
