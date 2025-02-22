const express = require("express");
require("dotenv").config();
const { adminAuth } = require("./middlewares/auth");
const app = express();
const connectDB = require("./config/database");
const cors = require("cors");
const http = require("http");

const cookieParser = require("cookie-parser");
require("./utils/cronjob");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const useRouter = require("./routes/user");
const chatRouter = require("./routes/chat");
const initializeSocket = require("./utils/socket");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", useRouter);
app.use("/", chatRouter);

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "skills", "age"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if (data?.skills.length > 10) {
      throw new Error("Skills can not be more than 10");
    }
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

const server = http.createServer(app);
initializeSocket(server);

connectDB()
  .then(() => {
    console.log("Database is connected");
    server.listen(process.env.PORT, () => {
      console.log("Server running on port 7777!");
    });
  })
  .catch((err) => {
    console.error("Database is not connected");
  });
