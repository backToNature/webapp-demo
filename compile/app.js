var css = require('./css/css');
var tpl = require('./tpl/tpl');
var $$util = require('./util/util');
var fs = require('fs');
var path = require('path');
var Velocity = require('velocityjs');
var Compile = Velocity.Compile;

var build = function (pagenName) {
	var pageTpl = fs.readFileSync(path.join(__dirname, '../src/layout/tpl.html'), 'utf8');
	var page_html = Velocity.parse(pageTpl);
	var config_page = {
	    escape : false
	};
	var macros = {
	  include: function(str) {
	    var content = fs.readFileSync(path.join(__dirname, 'src', str), 'utf8');
	    return content;
	  }
	};

	var endHtml = (new Compile(page_html, config_page)).render({
		mainHtml: tpl(pagenName),
		resourceCss: css(pagenName)
	}, macros);
	fs.writeFileSync(path.join(__dirname, '../src', pagenName + '.html'), endHtml, 'utf8');
};

var buildAll = function () {
	var pagesArr = $$util.getPages();
	pagesArr.forEach(function (item) {
		build(item);
	});
	console.log('build success');
};

var watch = function () {
	buildAll();
	var watchPath = path.join(__dirname, '../src');
	var staticPathArr = [
		path.join(watchPath, 'global'),
		path.join(watchPath, 'layout'),
		path.join(watchPath, 'page'),
		path.join(watchPath, 'widget')
	];
	var watchPathArr = [];
	watchPathArr = watchPathArr.concat(staticPathArr);
	staticPathArr.forEach(function (item) {
		var temp = [];
		fs.readdirSync(item).forEach(function (it) {
			if (!path.extname(it)) {
				temp.push(path.join(item, it));
			}
		});
		watchPathArr = watchPathArr.concat(temp);
	});
	watchPathArr.forEach(function (item) {
		fs.watch(item, function (event, filename) {
			if (filename) {
				// console.log('filename provided: ' + filename);
				buildAll();

			} else {
				console.log('filename not provided');
			}
		});
	});
};
watch();
