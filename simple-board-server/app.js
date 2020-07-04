const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {
    console.log("Connected to mongod sever");
})
mongoose.connect('mongodb://localhost/simple_board');

const boardRouter = require('./routes/boards');

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res, next) => {
    res.json('hello world!');
});

app.use('/boards', boardRouter);

app.listen(port, () => {
    console.log(`Server is running at ${port}`);
})