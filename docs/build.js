
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var colors = require('colors.css');
var data = require('../package.json');
var cssstats = require('cssstats');
var filesize = require('filesize');

var template = _.template(fs.readFileSync(path.join(__dirname, './template.html'), 'utf8'));
var html;


data.filesize = filesize;
data.sections = Object.keys(colors).map(function(key) {
  var color = colors[key];
  var title = _.capitalize(key);
  var css = fs.readFileSync('monotone-' + key + '.css', 'utf8');

  return {
    name: key,
    title: title,
    css: css,
    stats: cssstats(css),
  }
});

data.sections = data.sections.filter(function(s) {
  return s.name !== 'white' && s.name !== 'silver';
});

html = template(data);

fs.writeFileSync(path.join(__dirname, '../index.html'), html);

