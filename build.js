
var fs = require('fs');
var path = require('path');
var postcss = require('postcss');
var colors = require('colors.css');
var Color = require('color');
var cssstats = require('cssstats');
var filesize = require('filesize');


// TO DO:
// - custom properties

var themes = Object.keys(colors).map(function(key) {
  var hex = colors[key];
  var dark = Color(hex).dark();
  var rules = [
    postcss.rule({ selector: '.monotone-' + key, after: ' ' })
      .append(postcss.decl({ prop: 'color', value: hex, before: ' ' })),
    postcss.rule({ selector: '.monotone-' + key + ' a', })
      .append(postcss.decl({ prop: 'color', value: hex }))
      .append(postcss.decl({ prop: 'text-decoration', value: 'underline' })),
    postcss.rule({ selectors: [
        '.monotone-' + key + ' hr',
        '.monotone-' + key + ' .border',
        '.monotone-' + key + ' .border-top',
        '.monotone-' + key + ' .border-right',
        '.monotone-' + key + ' .border-bottom',
        '.monotone-' + key + ' .border-left',
        '.monotone-' + key + ' input',
        '.monotone-' + key + ' select',
      ]})
      .append(postcss.decl({ prop: 'border-color', value: hex })),
    postcss.rule({
        selectors: [
          '.monotone-' + key + ' input:focus',
          '.monotone-' + key + ' select:focus',
        ]
      })
      .append(postcss.decl({ prop: 'box-shadow', value: '0 0 0 2px ' + hex })),
    postcss.rule({
        selectors: [
          '.monotone-' + key + ' code',
          '.monotone-' + key + ' pre',
        ]
      })
      .append(postcss.decl({ prop: 'background-color', value: 'color(' + hex + ' alpha(.25))' })),
    postcss.rule({
        selectors: [
          '.monotone-' + key + '.inverse',
          '.monotone-' + key + ' .inverse',
          '.monotone-' + key + ' .button',
        ]
      })
      .append(postcss.decl({ prop: 'color', value: dark ? 'white' : colors.black }))
      .append(postcss.decl({ prop: 'background-color', value: hex })),
    postcss.rule({
        selectors: [
          '.monotone-' + key + '.inverse .button',
          '.monotone-' + key + ' .inverse .button',
        ]
      })
      .append(postcss.decl({ prop: 'color', value: hex }))
      .append(postcss.decl({ prop: 'background-color', value: dark ? 'white' : colors.black })),
    postcss.rule({
        selectors: [
          '.monotone-' + key + '.inverse a',
          '.monotone-' + key + ' .inverse a',
        ]
      })
      .append(postcss.decl({ prop: 'color', value: dark ? 'white' : colors.black })),
    postcss.rule({
        selectors: [
          '.monotone-' + key + '.inverse hr',
          '.monotone-' + key + ' .inverse hr',
          '.monotone-' + key + '.inverse .border',
          '.monotone-' + key + ' .inverse .border',
          '.monotone-' + key + '.inverse .border-top',
          '.monotone-' + key + ' .inverse .border-top',
          '.monotone-' + key + '.inverse .border-right',
          '.monotone-' + key + ' .inverse .border-right',
          '.monotone-' + key + '.inverse .border-bottom',
          '.monotone-' + key + ' .inverse .border-bottom',
          '.monotone-' + key + '.inverse .border-left',
          '.monotone-' + key + ' .inverse .border-left',
          '.monotone-' + key + '.inverse input',
          '.monotone-' + key + ' .inverse input',
          '.monotone-' + key + '.inverse select',
          '.monotone-' + key + ' .inverse select',
        ]
      })
      .append(postcss.decl({ prop: 'border-color', value: dark ? 'white' : colors.black })),
  ];

  return {
    name: key,
    rules: rules
  }
});

var root = postcss.root({ after: '\n' });

themes.forEach(function(theme) {

  var themeRoot = postcss.root({ after: '\n' });

  root.append(theme.rules);
  themeRoot.append(theme.rules);

  var css = themeRoot.toResult().css;
  var stats = cssstats(css);

  console.log(theme.name + ' stats');
  console.log(filesize(stats.size));
  console.log(filesize(stats.gzipSize) + ' gzipped');
  console.log(stats.rules.length + ' rules');
  console.log(stats.aggregates.selectors + ' selectors');
  console.log(stats.aggregates.declarations + ' declarations\n');

  fs.writeFileSync('monotone-' + theme.name + '.css', css);

});

var css = root.toResult().css;

fs.writeFileSync('monotone.css', css);

