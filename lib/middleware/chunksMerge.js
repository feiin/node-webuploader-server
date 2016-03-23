'use strict';

var fs = require('fs'),
    fse = require("fs-extra"),
    utils = require('../utils'),
    async = require('async'),
    util = require('util'),
    _ = require('lodash'),
    path = require('path');

function merge(config, req, cb) {
    var fileInfo = {md5: req.body.md5, size: req.body.size, chunks: req.body.chunks, ext: req.body.ext};
    var chunksDirName = utils.getChunksTempDir(fileInfo);
    var chunksDirPath = path.join(config.uploadDir, chunksDirName);
    var mergeFileName = utils.getUniqueFileName(fileInfo) + utils.formatExtname(fileInfo.ext);
    var savePath = path.join(config.uploadDir, mergeFileName);
    var targetStream = fs.createWriteStream(savePath);

    async.series([
            function (done) {
                //ensure chunksDir exits and all part ready
                fs.readdir(chunksDirPath, function (error, data) {
                    if (error) {
                        return done(error);
                    }
                    if (data.length == fileInfo.chunks) {
                        return done(null);
                    } else {
                        done(new Error('can\'t merge the file'));
                    }
                })
            },
            function (done) {
                //merge file

                utils.chunksMerge(chunksDirPath, targetStream, req.body.chunks, function (error) {
                    if (error) {
                        return done(error);
                    }
                    targetStream.end(function () {
                        fse.removeSync(chunksDirPath);
                        done(null, savePath);
                    });
                });
            }],
        function (error, results) {
            if (error) {
                return cb(error);
            }
            cb(null, results[1]);
        });
}


function validate(req) {
    var error;

    if (!req.body.md5) {
        error = new Error('Invalid md5');
        return error;
    }
    if (!req.body.size || !_.isInteger(req.body.size)) {
        error = new Error('Invalid size');
        return error;
    }

    if (!req.body.chunks || !_.isInteger(req.body.chunks)) {
        error = new Error('Invalid chunks');
        return error;
    }
}

function chunksMerge(config) {
    return function (req, res, next) {

        utils.createContext(req, config);

        var error = validate(req);
        if (error) {
            req.webUploader.error = error;
            return next();
        }
        merge(config, req, function (error, result) {
            var mergeResult = {};
            if (error) {
                req.webUploader.error = error;
            } else {
                mergeResult.path = path.relative(req.webUploader.config.uploadDir,result);//relative path
                mergeResult.absolutePath = result;
            }
            req.webUploader.chunksMergeResult = mergeResult;
            next();
        });
    };
}

module.exports = chunksMerge;