'use strict';
var _ = require('lodash');
var config = require('./config');
var middleware = require('./middleware');
var path = require('path');

function uploader(options) {
    var uploadConfig = _.merge(options, config);
    var middlewares = middleware;

    this.config = uploadConfig;
    if(!this.config.uploadDir || !path.isAbsolute(this.config.uploadDir)) {
        throw new Error('uploadDir must be an Absolute Directory');
    }

    this.middlewares = {};
    this.middlewares.chunkCheck = middlewares.chunkCheck(config);
    this.middlewares.fileCheck = middlewares.fileCheck(config);
    this.middlewares.chunksMerge = middlewares.chunksMerge(config);
    this.middlewares.uploadMulter = middlewares.upload(config);
}

uploader.prototype.mount = function(router) {
    router.get('/chunkcheck', this.middlewares.chunkCheck, this.config.chunkChecked);
    router.get('/filecheck', this.middlewares.fileCheck, this.config.fileChecked);
    router.post('/', this.middlewares.uploadMulter, this.config.uploaded);
    router.post('/chunksmerge', this.middlewares.chunksMerge, this.config.chunksMerged);
}

module.exports = uploader;