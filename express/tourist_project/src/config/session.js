const JWT_SECRET = process.env.JWT_SECRET

const session = require('express-session');

module.exports = session({
  secret: JWT_SECRET, // Thay bằng một chuỗi bí mật mạnh
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }, // Cookie sống 1 ngày
});