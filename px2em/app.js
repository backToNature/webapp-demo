var fs = require('fs');
var tools = require('nodejs-tools');

var odir = '../src/';
var ndir = '../output/';

tools.file.rmdir(ndir);
tools.file.cpdir(odir, ndir);
tools.file.rmdir(ndir + 'page/');

var walk = function (dir) {
    fs.readdirSync(dir).forEach(function (item) {
        var fileName = dir.replace(/\\/g, '\/') + '/' + item;
        var stat = fs.statSync(fileName);
        if (!stat.isDirectory()) {
            if (fileName.match(/(widget|layout).*html$/)) {
                tools.file.rm(fileName);
            }
            return;
        }

        walk(fileName);
    });
};
walk(ndir);

require('./index.js');
