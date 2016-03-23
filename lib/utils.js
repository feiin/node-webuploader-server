'use strict';
var path = require('path');
var async = require('async');
var fs = require('fs');

var utils = {
    getUniqueFileName: function (fileInfo) {
        return fileInfo.md5 + '-' + fileInfo.size;
    },
    getChunkFileName: function (fileInfo) {
        return fileInfo.chunk + '.part.tmp';
    },
    getChunksTempDir: function (fileInfo) {
        return fileInfo.md5 + '-' + fileInfo.size;
    },
    chunksMerge: function (chunksDir, targetSteam, total, callback) {

        var index = 0;
        async.whilst(
            function () {
                return index < total;
            },
            function (done) {

                var chunkPathName = utils.getChunkFileName({chunk: index});
                var readStream = fs.createReadStream(path.join(chunksDir, chunkPathName));
                readStream.pipe(targetSteam, {end: false})
                readStream.on('end', function () {
                    index++;
                    done();
                });

            },
            function (err) {
                callback(err);
            });
    },
    formatExtname(extname) {
        if(extname) {
            if (extname.indexOf('.') == 0) {
                return extname;
            }
            return '.' + extname;
        }
        return extname;
    },
    createContext(req,config) {
        if (!req.webUploader) {
            req.webUploader = {};
        }
        req.webUploader.config = config;
    }
}

module.exports = utils;