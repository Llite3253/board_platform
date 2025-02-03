const express = require('express');
const Board = require('../models/Board');
const authenticateToken = require('../models/auth');

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
    const { title, content } = req.body;

    if(!title || !content) {
        return res.status(400).json({ message: '모든 내용을 입력해주세요.' });
    }

    try {
        const newBoard = await Board.create({ title, content, author: req.user.username });
        res.status(201).json({ message: '글 작성 성공!', board: newBoard });
    } catch(error) {
        res.status(500).json({ message: '글 작성 실패', error: error.message });
    }
})

router.get('/', async (req, res) => {
    try {
        const boards = await Board.find();
        res.status(200).json({
            boards: boards.map((board) => ({
                id: board._id,
                title: board.title,
                author: board.author, 
            })),
        });
    } catch(error) {
        res.status(500).json({ message: '글 목록 조회 실패', error: error.message });
    }
})

router.get('/:id', async (req, res) => {
    try{
        const board = await Board.findById(req.params.id);
        if(!board) {
            return res.status(404).json({ message: '글을 찾을 수 없습니다.'});
        }
        res.status(200).json(board);
    } catch(error) {
        res.status(500).json({ message: '글 조회 실패', error: error.message });
    }
})

router.put('/:id', async (req, res) => {
    const { title, content } = req.body;

    if(!title || !content) {
        return res.status(400).json({ message: '모든 내용을 입력해주세요.' });
    }

    try {
        const updateBoard = await Board.findByIdAndUpdate(
            req.params.id,
            { title, content },
            { new: true }
        );
        if(!updateBoard) {
            return res.status(404).json({ message: '글을 찾을 수 없습니다.' });
        }
        res.status(200).json({ message: '글 수정 성공!', board: updateBoard });
    } catch(error) {
        res.status(500).json({ message: '글 수정 실패', error: error.message });
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const deleteBoard = await Board.findByIdAndDelete(req.params.id);
        if(!deleteBoard) {
            return res.status(404).json({ message: '글을 찾을 수 없습니다.' });
        }
        res.status(200).json({ message: '글 삭제 성공!' });
    } catch(error) {
        res.status(500).json({ message: '글 삭제 실패', error: error.message });
    }
})

module.exports = router;