const express = require('express');
const router = express.Router();
const Board = require('../models/board');
const Counter = require('../models/counter');

router.get('/', (req, res, next) => {
    res.send('response with a resoure');
})

//Create Board
router.post('/', (req, res, next) => {
    var board = new Board(req.body.board);
    board.bno = getNextSeq("bno");
    board.save((err) => {
        if(err){
            console.error(err);
            res.json({result: false});
        }else{
            res.json({result: true});
        }
    })
})

//Read Board
router.get('/:bid', (req, res, next) => {
    res.json({
        bno: 1,
        author: '웅치킨',
        title: '웅치킨짱',
        contents: '웅치킨짱짱맨',
        hits: 0,
        regdate: "2020. 07. 03"
    })
})

function getNextSeq(seqName){
    var counter = new Counter();
    var seq = counter.findOneAndUpdate(
        {_id: seqName},
        {update: {$inc: {seq_value:1}}},
        (err, seq) => {
            if(err) console.log(err)
            else 
        }
    )
    console.log(seq.seq_value)
 }

module.exports = router;