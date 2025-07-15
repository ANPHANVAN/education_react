//  import from library
const express = require('express');
const morgan = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');
const multer = require('multer');
const cors = require('cors');

require('dotenv').config();

const FINAL_HOST = process.env.FINAL_HOST;
const VITE_API_URL = process.env.VITE_API_URL;

// import from my file
const route = require('./routes');
const mongodb = require('./config/db/mongodb');
mongodb.connect();

const hideFooter = require('./middleware/hideFooter');
app = express();
const port = 3000;
const server = http.createServer(app);
const io = new Server(server);
// initSocket(io)

app.use(morgan('combined'));
app.use(express.json()); // Đọc body dạng JSON
app.use(express.urlencoded({ extended: true })); // Đọc form (x-www-form-urlencoded)
app.use(hideFooter); // Middleware để ẩn footer

// all another frontend can use this backend
app.use(
  cors({
    origin: [FINAL_HOST, VITE_API_URL],
    credentials: true,
  })
);

app.set('view engine', 'ejs');
app.set('views', 'src/views');
app.set('layout', './partials/layout'); // Đảm bảo layout chính được chỉ định
app.use(expressLayouts);
app.use(cookieParser());

route(app);

server.listen(port, () => {
  console.log(`Server is running on ${FINAL_HOST}:${port}`);
});
