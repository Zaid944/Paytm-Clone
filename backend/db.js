const mongoose = require("mongoose");
const { number } = require("zod");

mongoose.connect(
  "mongodb+srv://usertry:mjLiwJNVzSnGcXTg@cluster0.ufx3n.mongodb.net/mydb"
);

const User = new mongoose.Schema({
  username: String,
  password: String,
  firstName: String,
  lastName: String,
});

const Account = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  balance: Number,
});

const UserModel = mongoose.model("User", User);
const AccountModel = mongoose.model("Account", Account);

module.exports = {
  UserModel,
  AccountModel,
};
