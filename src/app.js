const express = require("express");
const app = express();

app.use("/test", (req, res) => {
  res.send("Testing only");
});

app.listen(7777, () => {
  console.log("Server running on port 7777!");
});
