const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        return res.status(401).json({ message: '다시 로그인 해주세요.' })
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err) {
            return res.status(403).json({ message: '유효하지 않은 토큰입니다.', error: err.message });
        }

        req.user = decoded;
        next();
    });
};

module.exports = authenticateToken;