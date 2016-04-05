var path = require('path');
var fs = require('fs');
var util = {
    // 获取页面velocity变量
    getvariable: function (asts, key) {
        var value, key;
        asts.some(function (item) {
            if (item.type === 'set' && item.equal && item.equal.length) {
                if (item.equal[0].id === key) {
                    if (item.equal[1].type === 'array') {
                        value = [];
                        item.equal[1].value.forEach(function (v) {
                            value.push(v.value);
                        });
                    } else if (item.equal[1].type === 'map') {
                        value = {};
                        var temp;
                        for (key in item.equal[1].value) {
                            temp = [];
                            if (item.equal[1].value[key].value.length) {
                                item.equal[1].value[key].value.forEach(function (vv) {
                                     temp.push(vv.value);
                                });
                                value[key] = temp;
                            } else {
                                value[key] = item.equal[1].value[key].value;
                            }
                        }
                    } else {
                        value = item.equal[1].value;
                    }
                }
            }
        });
        return value;
    },
    getPageConf: function (pagename) {
        var pagePath = path.join(__dirname, '../../src/page', pagename + '.conf');
        return fs.readFileSync(pagePath, 'utf8');
    },
    getSortModulesArr: function (modules) {
        var key, arr = [];
        for (key in modules) {
            modules[key].forEach(function (item) {
                arr.push(item);
            });
        }
        return arr;
    },
    getPages: function () {
        var pagesPath = path.join(__dirname, '../../src/page');
        var pages = fs.readdirSync(pagesPath);
        pages = pages.map(function(item) {
            return path.basename(item, '.conf');
        });
        return pages;
    }
};

module.exports = util;