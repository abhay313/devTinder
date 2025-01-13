const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://abhay313:Abhayoo7@cluster0.v9dru.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
