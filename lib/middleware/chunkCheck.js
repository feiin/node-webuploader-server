'use strict';

var fs = require('fs'),
    utils = require('../utils'),
    util = require('util'),
    _ = require('lodash'),
    path = require("path");

function chunkCheck(config, req, cb) {
    var fileInfo = {md5: req.query.md5, size: req.query.size, chunk: req.query.chunk};
    var chunksDir = utils.getChunksTempDir(fileInfo);
    var chunkPart = utils.getChunkFileName(fileInfo);
    var chunkPath = path.join(config.uploadDir, chunksDir, chunkPart);

    fs.stat(chunkPath, function (error, stats) {
        if (error || stats.size != fileInfo.size) {
            return cb(null, {exists: false});
        } else {
            return cb(null, {exists: true});
        }
    });
}

function validate(req) {
    var error;

    if (!req.query.md5) {
        error = new Error('Invalid md5');
        return error;
    }
    if (!req.query.size || !_.isInteger(parseInt(req.query.size))) {
        error = new Error('Invalid size');
        return error;
    }
    if (!req.query.chunk || !_.isInteger(parseInt(req.query.chunk))) {
        error = new Error('Invalid chunk');
        return error;
    }
    return;
}

function chunkCheckExists(config) {
    var chunkPartCheck = config.chunkCheck;

    if (!util.isFunction(chunkPartCheck)) {

        chunkPartCheck = chunkCheck;
    }

    return function (req, res, next) {
        utils.createContext(req, config);
        var error = validate(req);
        if (error) {
            req.webUploader.error = error;
            return next();
        }
        chunkPartCheck(config, req, function (error, result) {
            var checkResult = {};
            if (error) {
                req.webUploader.error = error;
            }
            req.webUploader.chunkCheckResult = checkResult;
            next();
        });
    };
}

module.exports = chunkCheckExists;