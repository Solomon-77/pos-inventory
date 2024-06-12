const { Schema, model } = require("mongoose");

const verificationCodeSchema = new Schema({
   email: {
      type: String,
      required: true,
   },
   code: {
      type: String,
      required: true
   },
   username: {
      type: String,
      required: true,
      unique: true
   },
   password: {
      type: String,
      required: true,
   },
   roleCode: {
      type: String,
      required: true,
   },
   createdAt: {
      type: Date,
      default: Date.now,
      expires: 300 // Code will expire in 5 minutes
   }
}, {
   versionKey: false
});

const VerificationCode = model("VerificationCode", verificationCodeSchema);
module.exports = VerificationCode;
