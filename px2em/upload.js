/**
 * @file node 文件上传模块
 *
 * @author luobata(batayao@sohu-inc.com)
 */
var http = require('http');
var path = require('path');
var fs = require('fs');
var Q = require('q');


/**
 * 封装req头
 *
 * @param {Array} fileKeyValue 文件信息数组
 */
function blockReq (fileKeyValue, req) {
    var boundaryKey = Math.random().toString(16);
    var enddata = '\r\n----' + boundaryKey + '--';
    var files = new Array();

    for (var i = 0; i < fileKeyValue.length; i++) {
        var content = "\r\n----" + boundaryKey + "\r\n" +
            "Content-Type: multipart/form-data\r\n" +
            "Content-Disposition: form-data; name=\"" +
            fileKeyValue[i].urlKey + "\"; filename=\"" +
            path.basename(fileKeyValue[i].urlValue) + "\"\r\n" +
            "Content-Transfer-Encoding: binary\r\n\r\n";
        //当编码为ascii时，中文会乱码。
        var contentBinary = new Buffer(content, 'utf-8');
        files.push({
            contentBinary: contentBinary,
            filePath: fileKeyValue[i].urlValue
        });
    }
    var contentLength = 0;
    for (var i = 0; i < files.length; i++) {
        var stat = fs.statSync(files[i].filePath);
        contentLength += files[i].contentBinary.length;
        contentLength += stat.size;
    }
    req.setHeader('Content-Type', 'multipart/form-data; boundary=--' + boundaryKey);
    req.setHeader('Content-Length', contentLength + Buffer.byteLength(enddata));
    var fileIndex = 0;
    postFile(fileIndex, req, boundaryKey, files);
}

/**
 * 上传文件
 *
 * @param {number} fileIndex 数组指针
 * @param {Object} req 请求头
 * @param {string} boundaryKey
 * @param {Array} files 文件数组
 */
function postFile (fileIndex, req, boundaryKey, files) {
    req.write(files[fileIndex].contentBinary);
    var fileStream = fs.createReadStream(files[fileIndex].filePath, {
        bufferSize: 4 * 1024
    });
    fileStream.pipe(req, {
        end: false
    });
    fileStream.on('end', function() {
        fileIndex++;
        if (fileIndex == files.length) {
            var enddata = '\r\n----' + boundaryKey + '--';
            req.end(enddata);
        } else {
            postFile(fileIndex, req, boundaryKey, files);
        }
    });
}

/**
 * 上传文件入口
 *
 * @param {Object} options
 * @param {Array} files 上传文件
 * @param {Function} callback 回调
 */
module.exports = function (options, fileKeyValue, callback) {
    var url;
    var req = http.request(options, function(res) {
        console.log("RES:" + res);
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding("utf8");
        res.on("data", function(chunk) {
            console.log("BODY:" + chunk);
            url = JSON.parse(chunk).url;
            callback(url);
        });
    });

    req.on('error', function(e) {
        console.log('problem with request:' + e.message);
        console.log(e);
    });

    blockReq(fileKeyValue, req);
    //var fileIndex = 0;
    //postFile(fileIndex, req);
}