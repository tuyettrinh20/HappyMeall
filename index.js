const express = require("express");
const flash = require('express-flash');
const session = require('express-session');
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const multer = require("multer");


const storageEngine = multer.diskStorage({
  destination: "./images",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});
const upload = multer({
  storage: storageEngine,
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});
const checkFileType = function (file, cb) {
  //Allowed file extensions
  const fileTypes = /jpeg|jpg|png|gif|svg/;

  //check extension names
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb("Error: You can Only Upload Images!!");
  }
};

io.on("connection", function (socket) {
  console.log("User connected", socket.id);
});

app.use(express.json());
var cors = require('cors');
app.use(cors());
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var expressValidator = require('express-validator');

const cookie = require("cookie-parser");
app.use(express.urlencoded({extended:"true"}));
app.use(cookie());
require('mysql2');
const db = require('./dbsetup');

app.use(session({
  secret: 'happyfood',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());


app.use(express.static("public"));
app.use(express.static("views"));
app.set("view engine", "ejs");



app.use('/', require('./routes/auth'));
app.get('/chat', async (req,res) => {
  res.render('chatBox');
});


db.connect(function (err) {
  if(err){
      console.log("error occurred while connecting");
  }
  else{
      console.log("connection created with Mysql successfully");
  }
});


http.listen(3001, () => {
  console.log("Server running on port 3001");
});
