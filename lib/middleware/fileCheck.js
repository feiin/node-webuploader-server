'use strict';
var _ = require('lodash'),
    utils = require('../utils');

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
}

function fileCheckExists(config) {
    var fileCheck = config.fileCheckExists || function (req, cb) {
            return cb(null, {exists: false});
        };

    return function (req, res, next) {
        utils.createContext(req, config);
        var error = validate(req);
        if (error) {
            req.webUploader.error = error;
            return next();
        }

        fileCheck(req, function (error, result) {
            var checkResult = {};
            if (error) {
                req.webUploader.error = error;
            } else {
                checkResult = result;
            }

            req.webUploader.fileCheckResult = checkResult;
            next();
        });
    };
}

module.exports = fileCheckExists;