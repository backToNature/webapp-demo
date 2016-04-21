/**
 * @file px2em.js px转换em
 *
 * @author luobata(batayao@sohu-inc.com)
 */

var fs = require('fs');
var paths = require('path');
var upload = require('./upload');
var download = require('./download');
var reg = {
    // 数字+px 10px
    px: /\d+px/g,
    // font-size 10px
    fontSize: /font-size.*\d+px/g,
    // number
    num: /[^0-9.]+/g,
    // backgtound url
    background: /background.*url.*;/,
    // url('')
    backgroundUrl: /url\(.*[\"|\']([^\"]*)[\"|\'].*\)/
};


module.exports = function (config) {

    var emConfig = config || require('./config');
    var config = emConfig.regrex;
    var ignore = emConfig.baseUrl.ignore;

    /*
     * 寻找目标文件夹下所有css文件
     *
     * @param {string} path 入口文件夹路径
     */
    var findCssFile = function (path) {
        if (ignore && ignore.indexOf(path) !== -1) {
            console.log(path + ' ignored');
            return;
        }
        fs.readdir(path, function (err, data) {
            // data src文件夹下的文件
            if (err) {
                console.log(err);
                return;
            } else {
                for (var i = 0; i < data.length; i++) {
                    var pathChild = path + '/' + data[i];
                    var file = fs.statSync(pathChild);
                    if (file.isDirectory()) {
                        findCssFile(pathChild);
                    } else if (pathChild.indexOf(config.file) !== -1) {
                        // TODO 匹配css文件换成正则更好
                        cssFormate(pathChild);
                    }
                }
            }
        });
    };

    /*
     * 处理css文件
     *
     * @param {stirng} css文件路径
     */
    var cssFormate = function (path) {
        var file = fs.createReadStream(path);
        var fileContent = [];
        file.setEncoding('utf8');
        file.on('data', function (chunk) {
            fileContent = chunk.split('}');
            cssBlock(fileContent, function (emFile) {
                emToFile(path, emFile);
            });
        });
        file.on('end', function () {
        });
    };

    /**
     * pxToem 文本内容处理
     *
     * @param {string} path 写文件的路径
     * @param {string} chunk 文本内容
     * @param {Number} px 处理时转换的值
     * @return {string} emFile 拼接后文本
     */
    var pxToem = function (chunk, px) {
        var emChunk = chunk.replace(/[\d\.]+px/g, function () {
            var args = Array.prototype.slice.call(arguments)[0];
            var num = args.split('px')[0];
            // 特殊处理1px的情况
            return (num / px * 12 < 1) ? ('1px') : (num / px).toFixed(config.fixNumber) + config.type;
        });
        return emChunk;
    };

    /*
     * 分割成css块 .main{}
     *
     * @param {Array} cssfile 的数组
     * @param {Function} callback 写文件回调
     */
    var cssBlock = function (cssfile, callback) {
        var emFile = '';
        for (var i = 0; i < cssfile.length; i++) {
            var fontSize = 0;

            if (cssfile[i].indexOf('{') !== -1) {
                cssfile[i] += '}';
            }
            if (cssfile[i].indexOf('font-size') !== -1) {
                // 先把font-size/14处理
                cssfile[i] = cssfile[i].replace(reg.fontSize, function () {
                    var args = Array.prototype.slice.call(arguments)[0];
                    fontSize = args.replace(reg.num, '');
                    return 'font-size: ' + (fontSize / config.px) + config.type;
                });
            }
            fontSize = (fontSize && config.type !== 'rem') ? fontSize : config.px;
            emFile += pxToem(cssfile[i], fontSize);

            // add background: url('.../v2/');
            if (cssfile[i].match(reg.background)) {
                emFile += addCss(cssfile[i], config.cssClass);
            }
        }
        callback(emFile);
    };


    /*
     * 给css增加一个background：url的特殊处理块
     *
     * @param {string} css 块css语义文本
     * @param {string} className 多定义的class名
     * @return {string} css 修改后的css内容
     */
    var addCss = function (css, className) {
        // find class and add out class
        var fullClass = '';
        var urlPath = '';
        var fullClasses = css.split('{')[0].split(',');
        for (var i = 0; i < fullClasses.length; i++) {
            fullClasses[i] = fullClasses[i].replace(/\r\n/, '');
            fullClasses[i] = '.' + className + ' ' + fullClasses[i];
            fullClass += fullClasses[i];
            if (i < fullClasses.length - 1) {
                fullClass += ',\r\n';
            }
        }
        //var url = css.match(reg.backgroundUrl)[1];
        css = css.match(reg.background)[0];
        var background = css.replace(reg.backgroundUrl, function () {
            var url = Array.prototype.slice.call(arguments)[1];
            urlPath = url;
            var splitName = (url.indexOf('images') !== -1) ? 'images' : 'img';
            var images = url.split(splitName);
            url = "url('" + images[0] + splitName + '_v2' + images[1]+ "')";
            return url;
        });
        // path需要加前缀 有问题
        imgResize(urlPath, urlPath.split('/').pop().replace(/\?.*$/, ''));
        var cssBlock = '\r\n'
            + fullClass + ' {\r\n'
            + '    ' + background + '\r\n'
            + '}\r\n'
        // 上传图片 并下载
        return cssBlock;
    };

    /**
     *  处理图片
     *
     *  @param {string} dir 图片地址
     */
    function imgResize (dir, name) {
        dir = './build/' + dir;
        dir = dir.replace(/\?.*$/, '');
        if (!fs.existsSync(dir)) {
            console.log(dir + ' not exist!');
            return;
        }
        var files = [
            {
                urlKey: "imgFile",
                urlValue: dir
            }
        ];
        var downloadPath = paths.dirname(dir) + '_v2/';
        upload(emConfig.uploadOpts, files, function (url) {
            // Download img
            if (!fs.existsSync(downloadPath)) {
                fs.mkdir(downloadPath);
            }
            download.down(url, downloadPath, name);
        });
    }

    /*
     * 替换后的css写入文件
     *
     * @param {string} path 写文件的路径
     * @param {string} emChunk em后的文件
     */
    var emToFile = function (path, emChunk) {
        fs.writeFile(path, emChunk, 'utf-8', function () {
            console.log(path + ' formate success!');
        });
    };
    var init = function () {
        var files = emConfig.baseUrl.file;
        for (var i = 0; i < files.length; i++) {
            // TODO 封装
            findCssFile(files[i]);
        }
    };
    init();
}
