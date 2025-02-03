const express = require('express');
const Comment = require('../models/Comment');
const Board = require('../models/Board');
const authenticateToken = require('../models/auth');
const router = express.Router();

router.post('/:boardId/comments', authenticateToken, async (req, res) => {
    const { content } = req.body;
    const { boardId } = req.params;

    if(!content) {
        return res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
    }

    try {
        const board = await Board.findById(boardId);
        if(!board) {
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }

        const comment = await Comment.create({
            content,
            author: req.user.username,
            boardId,
        })

        board.comments.push(comment._id);
        await board.save();

        res.status(201).json({ message: '댓글 작성 성공!', comment });
    } catch(error) {
        res.status(500).json({ message: '댓글 작성 실패', error: error.message });
    }
})

router.get('/:boardId/comments', async (req, res) => {
    const { boardId } = req.params;

    try {
        const board = await Board.findById(boardId).populate('comments');
        if(!board) {
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }

        res.status(200).json({ comments: board.comments });
    } catch(error) {
        res.status(500).json({ message: '댓글 조회 실패', error: error.message });
    }
})

router.delete('/:commentId/comments', authenticateToken, async (req, res) => {
    const { commentId } = req.params;

    try {
        const comment = await Comment.findById(commentId);
        if(!comment) {
            return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
        }
        
        if(comment.author !== req.user.username) {
            return res.status(403).json({ message: '삭제 권한이 없습니다.' });
        }

        await Comment.findByIdAndDelete(commentId);

        await Board.updateOne(
            { comments: commentId },
            { $pull: { comments: commentId } }
        )

        res.status(200).json({ message: '댓글 삭제 성공!' });
    } catch(error) {
        res.status(500).json({ message: '댓글 삭제 실패', error: error.message });
    }
})

module.exports = router;