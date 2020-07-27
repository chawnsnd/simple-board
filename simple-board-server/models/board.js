const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    author: String,
    contents: String,
    regdate: {
        type: Date,
        default: Date.now
    }
});

const boardSchema = new Schema({
    bno: Number,
    author: String,
    title: String,
    contents: String,
    hits: {
        type: Number,
        default: 0
    },
    regdate: {
        type: Date,
        default: Date.now
    },
    comments: [commentSchema]
});

module.exports = mongoose.model('board', boardSchema);