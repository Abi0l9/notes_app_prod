const mongoose = require("mongoose");

const noteSchema = mongoose.Schema({
  title: String,
  content: String,
  date: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

noteSchema.set("toJSON", {
  transform: (document, object) => {
    object.id = object._id.toString();
    delete object._id;
    delete object.__v;
  },
});

const Note = mongoose.model("Note", noteSchema);
module.exports = Note;
