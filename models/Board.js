const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
    title: { type: String, required: true},
    content: { type: String, required: true},
    author: { type: String, required: true},
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now},
}, { timestamps: true });

const Board = mongoose.model('Board', boardSchema);
module.exports = Board;