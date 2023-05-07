const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    userEmail: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Password is required"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
    },
    token: { type: String },
    address: { type: String, default: "" },
    taxID: { type: String, default: "" },
    userType: { type: Number, default: 0 },
    cart: [String],
    rates: [{ type: Schema.Types.ObjectId, ref: "Rate" }],
    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    // orders: [OrderSchema],
  },
  { versionKey: false }
);

UserSchema.pre("save", async function (next) {
  const user = await User.findOne({ userEmail: this.userEmail });
  if (user) {
    next(new Error(`${this.userEmail} already taken`));
    return;
  }

  const user1 = await User.findOne({ username: this.username });
  if (user1) {
    next(new Error(`${this.username} already taken`));
    return;
  }

  const salt = await bcrypt.genSalt(8);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// getJWT generates new JWT for user.
// Returns updated JWT of the user.
UserSchema.methods.getJWT = async function () {
  try {
    const token = jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
      expiresIn: 3600 * 24 * 365,
    });

    this.token = token;
    await User.findByIdAndUpdate(this._id, this);

    return token;
  } catch (e) {
    return Error(e);
  }
};

// userSchema.statics is accessible by model
UserSchema.statics.findByCredentials = async (userEmail, password) => {
  const user = await User.findOne({ userEmail });
  if (!user) {
    throw Error("Email does not exist!");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw Error("Wrong password!");
  }

  user.password = undefined;
  return user;
};

const User = mongoose.model("User", UserSchema);
module.exports = { User, UserSchema };
