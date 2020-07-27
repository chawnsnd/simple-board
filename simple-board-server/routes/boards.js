const express = require('express');
const router = express.Router();
const Board = require('../models/board');
const Counter = require('../models/counter')

//Board List
router.get('/', async (req, res, next) => {
    const page = req.query.page;
    const totalBoard = await Board.countDocuments({});
    const pageInfo = paging(page, totalBoard);
    Board.find({}, (err, boards) => {
        if(err) res.send(500);
        else res.json({boards: boards, pageInfo: pageInfo});
    }).sort({ bno: -1 })
    .skip(pageInfo.hideBoard)
    .limit(pageInfo.maxBoard)
})

//Create Board
router.post('/', async (req, res, next) => {
    const board = new Board(req.body.board);
    board.bno = await getNextSequence("bno");
    board.save((err) => {
        if(err) res.send(500);
        else res.json({bno : board.bno})
    })
})

//Read Board
router.get('/:bno', (req, res, next) => {
    Board.findOneAndUpdate({bno: req.params.bno}, {$inc: {hits: 1}}, (err, board) => {
        if(err) res.send(500);
        else res.json(board);
    })
})

//Update Board
router.put('/:bno', (req, res, next) => {
    const board = new Board(req.body.board);
    Board.findOneAndUpdate({bno: board.bno}, {$set: board}, (err, board) => {
        if(err) res.send(500);
        else res.json(board);
    });
})

//Delete Board
router.delete('/:bno', (req, res, next) => {
    Board.deleteOne({bno: req.params.bno}, (err) => {
        if(err) res.send(500);
        else res.send(200);
    })
})

// Create Comment
router.post('/:bno/comments', (req, res, next) => {
    const comment = req.body.comment;
    Board.findOneAndUpdate({bno: req.params.bno}, {$push: {comments: comment}}, (err, board) => {
        if(err) res.send(500);
        else res.json(board);
    });
})

//Delete Comment
router.delete('/:bno/comments/:cid', (req, res, next) => {
    Board.update({bno: req.params.bno}, {$pull: {comments:{_id:req.params.cid}}}, (err) => {
        if(err) res.send(500);
        else res.send(200);
    })
})

function getNextSequence(name){
    return new Promise(function(resolve, reject) {
        Counter.findOneAndUpdate({_id: name}, {$inc: {seq: 1}}, {new: true}, (err, counter) => {
            if(err) reject(err);
            else resolve(counter.seq);
        })
    })
}

function paging(page, totalBoard){
    const maxBoard = 20;
    const maxPage = 5;
    let currentPage = page ? parseInt(page) : 1;
    const hideBoard = page === 1 ? 0 : (page-1)*maxBoard;
    const totalPage = Math.ceil(totalBoard / maxBoard);

    if (currentPage > totalPage)  currentPage = totalPage;

    const startPage = Math.floor(((currentPage - 1) / maxPage)) * maxPage + 1;
    let endPage = startPage + maxPage - 1;
    
    if (endPage > totalPage) endPage = totalPage;
    
    return { startPage, endPage, hideBoard, maxBoard, totalPage, currentPage };
}

module.exports = router;