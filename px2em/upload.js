/**
 * @file node �ļ��ϴ�ģ��
 *
 * @author luobata(batayao@sohu-inc.com)
 */
var http = require('http');
var path = require('path');
var fs = require('fs');
var Q = require('q');


/**
 * ��װreqͷ
 *
 * @param {Array} fileKeyValue �ļ���Ϣ����
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
        //������Ϊasciiʱ�����Ļ����롣
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
 * �ϴ��ļ�
 *
 * @param {number} fileIndex ����ָ��
 * @param {Object} req ����ͷ
 * @param {string} boundaryKey
 * @param {Array} files �ļ�����
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
 * �ϴ��ļ����
 *
 * @param {Object} options
 * @param {Array} files �ϴ��ļ�
 * @param {Function} callback �ص�
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