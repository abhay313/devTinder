const express = require("express");
const { adminAuth } = require("./middlewares/auth");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Abhay",
    lastName: "Yadav",
    age: "24",
    email: "abhay@gmail.com",
    password: "pass@123",
  });

  try {
    await user.save();
    res.send("User added successfully!");
  } catch (error) {
    res.status(400).send("Error in saving user : " + error.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database is connected");
    app.listen(7777, () => {
      console.log("Server running on port 7777!");
    });
  })
  .catch((err) => {
    console.error("Database is not connected");
  });
