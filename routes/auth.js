const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({ message: '이미 사용중인 이메일입니다.' });
        }

        const user = new User({ username, email, password});
        await user.save();

        res.status(201).json({
            message: '회원가입 성공!',
            user: { userid: user._id, username: user.username, email: user.email },
        });
    } catch(err) {
        res.status(500).json({ message: '서버 오류 ', error: err.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
    }

    try {
        const user = await User.findOne({ email });
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!user || !isPasswordValid) {
            return res.status(401).json({ message: '이메일이나 비밀번호가 일치하지 않습니다.' });
        }
        
        const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({
            message: '로그인 성공!',
            token,
            user: { userid: user._id, username: user.username, email: user.email },
        })
    } catch(err) {
        res.status(500).json({ message: '서버 오류 ', error: err.message });
    }
})

module.exports = router;