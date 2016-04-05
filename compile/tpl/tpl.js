/*
 * @author 郭豪
 * @date 2016/02/04
 * @description 模板拼接逻辑
 */

var Velocity = require('velocityjs');
var fs = require('fs');
var path = require('path');
var $$util = require('../util/util'); 


var outputTplString = function (pagename) {
    // 获取widget的模板
    var getWidgetTpl = function (name) {
        var baseUrl = path.join(__dirname, '../../src/widget'),
        resultPath = path.join(baseUrl, name, name +'.html');
        return fs.readFileSync(resultPath, 'utf8');
    };
    // 替换page.conf里的modules变量，把widget名替换为widget的tpl
    var replaceModulesObj = function (modules) {
        var key, newTpl = {};
        for (key in modules) {
            newTpl[key] = '';
            modules[key].forEach(function (item) {
                newTpl[key] += getWidgetTpl(item);
            });
        }
        return newTpl;
    };

    var pageConf = $$util.getPageConf(pagename);
    var Compile = Velocity.Compile;
    var asts = Velocity.parse(pageConf);
    var modulesTplObj = $$util.getvariable(asts, 'modules');
    var modulesTplData = replaceModulesObj(modulesTplObj);
    var layout = $$util.getvariable(asts, 'layout');

    var layoutTpl = fs.readFileSync(path.join(__dirname, '../../src/layout', layout, layout + '.html'), 'utf8');
    var asts_html = Velocity.parse(layoutTpl);
    var config_html = {
        escape : false
    }; 
    var mainHtml = (new Compile(asts_html, config_html)).render(modulesTplData);
    return mainHtml;
};

module.exports = outputTplString;