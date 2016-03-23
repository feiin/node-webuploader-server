'use strict';

var multer = require('multer');
var path = require('path');
var utils = require('../utils');
var fse = require('fs-extra');

function getSaveDir(config, req) {
    var dir = config.uploadDir;

    if (req.body.chunks !== undefined && req.body.chunks > 0) {
        dir = path.join(dir, utils.getChunksTempDir(req.body));

    }
    fse.ensureDirSync(dir);
    return dir;
};

function getSaveFileName(config, req, file) {
    var fileName = '';

    if (req.body.chunks !== undefined && req.body.chunks > 0) {
        fileName = utils.getChunkFileName(req.body);
    } else {
        var ext = req.body.ext || path.extname(file.originalname);
        fileName = utils.getUniqueFileName(req.body) + utils.formatExtname(ext);
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
            utils.createContext(req, config);
            req.webUploader.isChunked = (req.body.chunks !== undefined && req.body.chunks > 0);
            cb(null, true)

        },
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, getSaveDir(config, req));
            },
            filename: function (req, file, cb) {
                cb(null, getSaveFileName(config, req, file));
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