const { Schema, model } = require("mongoose");

const resetTokenSchema = new Schema({
   email: {
      type: String,
      required: true,
      unique: true,
      index: true
   },
   code: {
      type: String,
      required: true,
   },
   expiresAt: {
      type: Date,
      default: Date.now,
      expires: 300 // expires in 5 minutes
   }
}, {
   versionKey: false
});

const PasswordReset = model("PasswordReset", resetTokenSchema);
module.exports = PasswordReset;