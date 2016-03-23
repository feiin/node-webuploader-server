'use strict';
var fs = require('fs');

function loadDirectory(exports, directory) {
    fs.readdirSync(directory).forEach(function (filename) {
        var fullPath,
            stat,
            match;

        if (filename === 'index.js' || /^\./.test(filename)) {
            return;
        }

        fullPath = directory + '/' + filename;
        stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            exports[filename] = {};
            loadDirectory(exports[filename], fullPath);
        } else {
            match = /(\w+)\.js$/.exec(filename);

            if (match) {
                exports.__defineGetter__(match[1], function () {
                    return require(fullPath);
                });
            }
        }
    });

    return exports;
}

loadDirectory(exports, __dirname);