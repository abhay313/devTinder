const express = require("express");
const { adminAuth } = require("./middlewares/auth");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User added successfully!");
  } catch (error) {
    res.status(400).send("Error in saving user : " + error.message);
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const user = await User.findOne({ emailId: userEmail });
    if (!user) {
      res.status(404).send("Something went wrong");
    }
    res.send(user);
  } catch (error) {
    res.status(400).send("user not found");
  }
});

// GET/feed API
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "before",
      runValidators: true,
    });
    console.log(user);

    res.send("Updated Successfully");
  } catch (error) {
    res.status(400).send("UPDATE FAILED: " + error.message);
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
