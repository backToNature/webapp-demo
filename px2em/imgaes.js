/**
 * @file node 图片处理
 *
 * @author luobata(batayao@sohu-inc.com)
 */
var fs = require('fs');
var path = require('path');
var Q = require('q');
var image = {};

/**
 * 获取图片大小
 *
 * @param {string} dir 图片路径
 * @param {Function} callback 图片尺寸
 */
image.getSize = function (dir, callback) {
    // TODO 判断类型
    var type = path.extname(dir);
    switch (type) {
        case '.png':
            // png　promise
            var size = getPngSize(dir, callback);
            break;
        case '.jpeg':
        case '.jpg':
            // jpg same to jpeg
            getJpgSize(dir, callback);
            break;
        case '.gif':
            break;
        default:
    }
}

/**
 * 获取png图片大小
 *
 * @param {string} dir 图片路径
 * @param {Function} callback 图片尺寸
 */
function getPngSize(dir, callback) {
    var size = {};
    var fileStream = fs.createReadStream(dir, {
        bufferSize: 4,
        start: 16,
        end: 23
    });
    fileStream.on('data', function (chunk) {
        // 0-3 width 4-7 height
        var widStr = chunk[0].toString(16) + chunk[1].toString(16) + chunk[2].toString(16) + chunk[3].toString(16);
        var heiStr = chunk[4].toString(16) + chunk[5].toString(16) + chunk[6].toString(16) + chunk[7].toString(16);
        var width = parseInt(widStr, 16);
        var height = parseInt(heiStr, 16);
        size.width = width;
        size.height = height;
    });
    fileStream.on('end', function () {
        callback(size);
    });
}

/**
 * 获取jpg图片大小
 *
 * @param {string} dir 图片路径
 * @param {Function} callback 图片尺寸
 */
function getJpgSize(dir, callback) {
    var size = {};
    var fileStrem = fs.createReadStream(dir, {
        bufferSize: 16
    });
    fileStrem.on('data', function (chunk) {
        for(var i = 0; i < chunk.length; i++) {
            if (chunk[i].toString(16) === 'ff' && chunk[i + 1].toString(16) === 'c0') {
                // offset 3 bytes
                var heiStr = chunk[i + 5].toString(16) + chunk[i + 6].toString(16);
                var widStr = chunk[i + 7].toString(16) + chunk[i + 8].toString(16);
                var width = parseInt(widStr, 16);
                var height = parseInt(heiStr, 16);
                size.width = width;
                size.height = height;
                break;
            }
        }
    });
    fileStrem.on('end', function () {
        callback(size);
    });
}



var dir = "C:\\Users\\Yaodoggy\\Desktop\\zp.jpg";
image.getSize(dir, function (size){
    console.log(size.width);
    console.log(size.height);
});



module.exports = image;