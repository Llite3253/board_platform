const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const boardRoutes = require('./routes/board');
const commentsRoutes = require('./routes/comments');
const likesRoutes = require('./routes/likes');

dotenv.config();
const app = express();

// 미들웨어
app.use(express.json());

// 라우터 연결
app.use('/api/auth', authRoutes);
app.use('/api/board', boardRoutes);
app.use('/api/board', commentsRoutes);
app.use('/api/likes', likesRoutes);

// MongoDB 연결
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB 연결 성공'))
  .catch((err) => console.error('MongoDB 연결 실패:', err));

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});

app.use(express.json());