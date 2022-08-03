const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const NoteSchema = new Schema({
    title: String,
    textnote: String,
    mytime: String,
      
});

module.exports = mongoose.model('Notes', NoteSchema);