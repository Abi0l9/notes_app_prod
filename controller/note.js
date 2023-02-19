const noteRouter = require("express").Router();
const User = require("../models/user");
const Note = require("../models/note");

noteRouter
  .get("", async (request, response) => {
    const notes = await Note.find({}).populate("user", { name: 1 });
    const retrievedNotes = notes.filter(
      (note) => note.user.id === request.user
    );

    return response.status(200).json(retrievedNotes).end();
  })

  .post("", async (request, response) => {
    const { title, content } = request.body;
    const user = await User.findById(request.user);

    const note = new Note({
      title,
      content,
      date: new Date().toUTCString(),
      user: user._id,
    });

    const savedNote = await note.save();

    user.notes = user.notes.concat(note.id);
    await user.save();

    return response.status(201).json(savedNote);
  })

  .patch("/:noteId", async (request, response) => {
    const noteId = request.params.noteId;
    const note = await Note.findById(noteId);

    if (!note) {
      return response.status(404).json({ message: "Note not found" }).end();
    }

    if (note.user.toString() === request.user) {
      await Note.findByIdAndUpdate(noteId, request.body);
      return response
        .status(200)
        .json({ message: "Edited Successfully" })
        .end();
    } else {
      return response
        .status(403)
        .json({ message: "You have no permission to edit this note" })
        .end();
    }
  })

  .delete("/:noteId", async (request, response) => {
    const noteId = request.params.noteId;
    const note = await Note.findById(noteId);

    if (!note) {
      return response.status(404).json({ message: "Note not found" }).end();
    }

    if (note.user.toString() === request.user) {
      await Note.findByIdAndRemove(noteId);
      return response
        .status(200)
        .json({ message: "Deleted Successfully" })
        .end();
    } else {
      return response
        .status(403)
        .json({ message: "You have no permission to edit this note" })
        .end();
    }
  });

module.exports = noteRouter;
