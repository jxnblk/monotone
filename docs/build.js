
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var colors = require('colors.css');
var data = require('../package.json');

//var files = fs.readdirSync(path.join(__dirname, '..'));
var template = _.template(fs.readFileSync(path.join(__dirname, './template.html'), 'utf8'));
//var data = {};
var html;

//files = files.filter(function(filename) {
//  return filename.match(/\.css$/) && filename.match(/monotone\-/) && filename !== 'monotone-white.css';
//});


data.sections = Object.keys(colors).map(function(key) {
  var color = colors[key];
  //var name = filename.replace(/^monotone\-|\.css$/g, '');
  var title = _.capitalize(key);

  return {
    name: key,
    title: title,
  }
});

data.sections = data.sections.filter(function(s) {
  return s.name !== 'white' && s.name !== 'silver';
});

html = template(data);

fs.writeFileSync(path.join(__dirname, '../index.html'), html);

