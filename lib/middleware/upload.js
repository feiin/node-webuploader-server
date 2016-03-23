'use strict';

var multer = require('multer');
var path = require('path');
var utils = require('../utils');
var mkdir = require('mkdir-p');

function getSaveDir(config, req) {
    var dir = config.uploadDir;

    if (req.body.chunks !== undefined && req.body.chunks > 0) {
        dir = path.join(dir, utils.getChunksTempDir(req.body));
        mkdir.sync(dir);
    }
    return dir;
};

function getSaveFileName(config, req) {
    var fileName = '';

    if (req.body.chunks !== undefined && req.body.chunks > 0) {
        fileName = utils.getChunkFileName(req.body);
    } else {
        fileName = utils.getUniqueFileName(req.body) + '.tmp';
    }
    return fileName;
};

function getUploadConfig(config) {

    var uploadConfig = {
        inMemory: false,
        fileFilter: function (req, file, cb) {

            var ext = path.extname(file.originalname);
            if (!ext) {
                return cb(new Error("extension error"), false);
            }
            var limitExtension = config.limitExtension;
            if (limitExtension.indexOf(ext.toLowerCase()) < 0) {
                return cb(new Error("extension not allowed"), false);
            }
            req.webUploader = {};
            req.webUploader.isChunked = (req.body.chunks !== undefined && req.body.chunks > 0);
            cb(null, true)

        },
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, getSaveDir(config, req));
            },
            filename: function (req, file, cb) {
                cb(null, getSaveFileName(config, req));
            }
        })
    };

    return uploadConfig;
};


function upload(config) {

    var config = getUploadConfig(config);

    return multer(config).single('file');
};

module.exports = upload;