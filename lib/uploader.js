'use strict';
var _ = require('lodash');
var config = require('./config');
var middleware = require('./middleware');
var path = require('path');

function uploader(options) {
    var uploadConfig = _.extend(config,options);
    var middlewares = middleware;

    this.config = uploadConfig;
    if(!this.config.uploadDir || !path.isAbsolute(this.config.uploadDir)) {
        throw new Error('config.uploadDir must be an absolute Directory');
    }

    this.middlewares = {};

    this.middlewares.fileCheck = middlewares.fileCheck(config);
    this.middlewares.chunkCheck = middlewares.chunkCheck(config);
    this.middlewares.uploadMulter = middlewares.upload(config);
    this.middlewares.chunksMerge = middlewares.chunksMerge(config);
}

uploader.prototype.mount = function(router) {

    router.get('/filecheck', this.middlewares.fileCheck, this.config.fileChecked);
    router.get('/chunkcheck', this.middlewares.chunkCheck, this.config.chunkChecked);
    router.post('/', this.middlewares.uploadMulter, this.config.uploaded);
    router.post('/chunksmerge', this.middlewares.chunksMerge, this.config.chunksMerged);
};

module.exports = uploader;