import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,  // Removed quotes around String
    required: true
  },
  fullname: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  address: {
    city: {
      type: String
    },
    pincode: {
      type: Number
    }
  },
  phoneno: {
    type: Number,
    required: true
  },
  cart: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item"
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ]
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
