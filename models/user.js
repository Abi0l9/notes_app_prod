const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    min: 3,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    minLength: 4,
    required: true,
  },
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
    },
  ],
});

userSchema.plugin(uniqueValidator);

userSchema.set("toJSON", {
  transform: (document, object) => {
    object.id = object._id.toString();
    delete object._id;
    delete object.__v;
    delete object.passwordHash;
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
