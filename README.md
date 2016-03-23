# node-webuploader-server

基于webuploader的大文件分块、并发上传，支持断点续传的Node服务端组件。

##安装

```
npm install node-webuploader-server --save

```

##例子
```
....
var webUploader = require('node-webuploader-server');
var router = express.Router();
var uploaderConfig = {uploadDir:path.join(__dirname, 'public','uploads'),limitExtension:null ....};

var uploder = new webUploader(uploaderConfig);
uploder.mount(router);
app.use('/upload',loginChecker,router);

function loginChecker(req, res, next) {
    //todo check user login
    next();
}
....
```
[examples/express4](https://github.com/feiin/node-webuploader-server/tree/master/examples/express4)

##配置

[config](https://github.com/feiin/node-webuploader-server/blob/master/lib/config.js)

##TODO

  ....
