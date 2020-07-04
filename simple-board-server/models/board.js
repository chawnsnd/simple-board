const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const boardSchema = new Schema({
    bno: Number,
    author: String,
    title: String,
    contents: String,
    hits: Number,
    regdate: Date
});

module.exports = mongoose.model('board', boardSchema);