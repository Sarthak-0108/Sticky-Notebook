import mongoose from "mongoose";

const schema = new mongoose.Schema({
  userId: { type: String, required: true },
  timestamp: { type: String, default: Date.now },
  userName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"], // regex validation
  },

  password: {
    type: String,
    required: true,
    // minlength: [8, "Password must be at least 8 characters long"],
    // validate: {
    //   validator: function (v) {
    //     // At least 1 uppercase, 1 lowercase, 1 digit, 1 special char
    //     return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
    //       v
    //     );
    //   },
    //   message:
    //     "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character",
    // },
  },
  confirmPassword: { type: String },
});

export const requestMadeByUser = mongoose.model("requstMadeByUser", schema);
