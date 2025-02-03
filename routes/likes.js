const express = require('express');
const Board = require('../models/Board');
const authenticateToken = require('../models/auth');
const router = express.Router();

router.post('/:boardId', authenticateToken, async (req, res) => {
    const { boardId } = req.params;
    const userId = req.user.id;

    try {
        const board = await Board.findById(boardId);
        if(!board) {
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }

        const likedIndex = board.likes.indexOf(userId);

        if(likedIndex === -1) {
            board.likes.push(userId);
            await board.save();
            return res.status(200).json({ message: '좋아요 추가됨!', likes: board.likes.length });
        } else {
            board.likes.splice(userId);
            await board.save();
            return res.status(200).json({ message: '좋아요 취소됨!', likes: board.likes.length });
        }
    } catch(error) {
        res.status(500).json({ message: '좋아요 실패', error: error.message });
    }
})

router.post('/:boardId/user', authenticateToken, async (req, res) => {
    const { boardId } = req.params;
    const userId = req.user.id;

    try {
        const board = await Board.findById(boardId);
        if(!board) {
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }

        const isLiked = board.likes.includes(userId);
        res.status(200).json({ liked: isLiked });
    } catch(error) {
        res.status(500).json({ message: '좋아요 여부 조회 실패', error: error.message });
    }
})

router.get('/:boardId', async (req, res) => {
    try {
        const board = await Board.findById(req.params.boardId);
        if(!board) {
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }

        res.status(200).json({ likes: board.likes.length});
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
})

module.exports =  router;