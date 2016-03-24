var express = require('express');
var bodyParser = require('body-parser');
var webUploader = require('node-webuploader-server');//require('../../index');
var path = require('path');

var app = express();

var router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express["static"](path.join(__dirname, 'public')));

var uploaderConfig = {uploadDir:path.join(__dirname, 'public','uploads'),limitExtension:null};

var uploder = new webUploader(uploaderConfig);
uploder.mount(router);
app.use('/upload',loginChecker,router);

function loginChecker(req, res, next) {
    //check user login
    next();
}

app.get('/', function (req, res) {
    res.redirect('/index.html');
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});