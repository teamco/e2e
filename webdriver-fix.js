#!/usr/bin/env node
const fs = require('fs'),
    fileList = './node_modules/webdriver-manager/built/lib/files/downloader.js';

fs.readFile(fileList, (err, data) => {
  if (err) throw err;
  let file = data.toString();
  const regex = /if \(stats.size != resContentLength\)/;
  const matcher = file.match(regex);
  if (matcher) {
    file = file.replace(regex, 'if (error && stats.size != resContentLength)');
    fs.writeFile(fileList, file, err => {
      err || console.log('File: "downloader.js" was fixed');
    });
  } else {
    console.log('File: "downloader.js" already fixed');
  }
  console.log('\n');
});