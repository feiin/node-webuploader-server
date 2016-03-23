var path = require('path');

var config = {
    uploadDir: '/tmp/test',
    limitExtension: ['.gif', '.jpg', '.png', '.zip', '.pdf'],
    chunkChecked: function (req, res, next) {
        var result = req.webUploader.chunkCheckResult;
        if (req.webUploader.error) {
            return res.status(500).json({isSuc: false, exists: false, message: req.webUploader.error.message})
        }
        result.isSuc = true;
        return res.json(result);

    },
    fileCheckExists:function(req, callback) {
       //检查文件是否存在,实现秒传
        return callback(null, {exists: false});//callback(null, {exists: false,path:'ddd.ext'})
    },
    fileChecked: function (req, res, next) {
        var result = req.webUploader.fileCheckResult;
        if (req.webUploader.error) {
            return res.status(500).json({isSuc: false, exists: false, message: req.webUploader.error.message})
        }
        result.isSuc = true;
        return res.json(result);
    },
    chunksMerged: function (req, res, next) {
        var result = req.webUploader.chunksMergeResult;
        if (req.webUploader.error) {
            return res.status(500).json({isSuc: false, message: req.webUploader.error.message})
        }
        result.isSuc = true;
        return res.json({isSuc: true, path: result.path});
    },
    uploaded: function (req, res, next) {
        if (req.file.path && !req.webUploader.isChunked) {
            var fileRelativePath = path.relative(req.webUploader.config.uploadDir,req.file.path);
            return res.json({isSuc: true, path:fileRelativePath})
        }
        return res.json({isSuc: false})
    }

}

module.exports = config;