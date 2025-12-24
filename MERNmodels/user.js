import mongoose from "mongoose";
import { ObjectId } from "mongodb";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  address: {
    // street: String,
    // city: String,
    // state: String,
    // zip: String,
    type: String,
    required: true,
    ref: 'Building'
  },
  user_type: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
},
{
  timestamps: true,
}
);

const User = mongoose.model("User", userSchema);

export default User;
