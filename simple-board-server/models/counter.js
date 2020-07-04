const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const counterSchema = new Schema({
    _id: String,
    seq_value: Number
});

module.exports = mongoose.model('counter', counterSchema);