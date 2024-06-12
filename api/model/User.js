const { Schema, model } = require("mongoose");

const userSchema = new Schema({
   username: {
      type: String,
      required: true,
      unique: true,
   },
   password: {
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true,
      unique: true,
      index: true
   },
   role: {
      type: String,
      enum: ["admin", "cashier"],
      required: true
   }
}, {
   versionKey: false
});

const User = model("User", userSchema);
module.exports = User;