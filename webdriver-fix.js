#!/usr/bin/env node
var fs = require('fs'),
fileList = './node_modules/webdriver-manager/built/lib/files/downloader.js';

fs.readFile(fileList, function(err, data) {
    if(err) throw err;
    data = data.toString();
	const matcher = data.match(/if \(stats.size \!\= resContentLength\)/);
	if (matcher) {
		data = data.replace(/if \(stats.size \!\= resContentLength\)/, 'if (error && stats.size != resContentLength)');
		fs.writeFile(fileList, data, function(err) {
			err || console.log('File: "downloader.js" was fixed');
		});
	} else {
		console.log('File: "downloader.js" already fixed');
	}
});