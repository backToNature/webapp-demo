/**
 * @file downolad
 *
 * @author luoobata(batayao@sohu-inc.com)
 */
var fs = require('fs');
var url = require('url');
var http = require('http');
var download = {};

/**
 * ÏÂÔØÈë¿Ú
 *
 * @param fileUrl
 * @param downloadUrl
 */
download.down = function(fileUrl, downloadUrl, name) {
    var options = {
        host: url.parse(fileUrl).hostname,
        port: url.parse(fileUrl).port || 80,
        path: url.parse(fileUrl).pathname
    };

    var file_name = url.parse(fileUrl).pathname.split('/').pop();
    var file = fs.createWriteStream(downloadUrl + file_name);

    http.get(options, function(res) {
        res.on('data', function(data) {
            //file.write(data);
            file.write(data, {
                end: false
            });
        }).on('end', function() {
            file.end();
            file.close();
            console.log(file_name + ' downloaded to ' + downloadUrl);
        });
    });
    //file.on('end', function (){
    //    fs.rename(downloadUrl + file_name, downloadUrl + name, function () {
    //        console.log(downloadUrl + name + 'changed');
    //    });
    //})
    file.on('error', function(e) {
        console.log('problem with request:' + e.message);
    });
};

module.exports = download;