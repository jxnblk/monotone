
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
  var color = Color(hex);
  var dark = color.dark();
  var rules = [
    postcss.rule({ selector: '.monotone-' + key, after: ' ' })
      .append(postcss.decl({ prop: 'color', value: hex, before: ' ' })),
    postcss.rule({ selector: '.monotone-' + key + '.readable', after: ' ' })
      .append(postcss.decl({ prop: 'background-color', value: dark ? 'white' : colors.black, before: ' ' })),
    postcss.rule({ selector: '.monotone-' + key + ' a:not(.button)', })
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
    postcss.rule({ selectors: [
        '.monotone-' + key + ' input',
        '.monotone-' + key + ' select',
      ]})
      .append(postcss.decl({ prop: 'color', value: hex }))
      .append(postcss.decl({ prop: 'background-color', value: 'transparent' }))
      .append(postcss.decl({ prop: 'border-width', value: '1px' }))
      .append(postcss.decl({ prop: 'border-style', value: 'solid' }))
      .append(postcss.decl({ prop: 'border-radius', value: '3px' })),
    postcss.rule({ selectors: [
        '.monotone-' + key + ' input:focus',
        '.monotone-' + key + ' select:focus',
      ]})
      .append(postcss.decl({ prop: 'box-shadow', value: '0 0 0 3px' }))
      .append(postcss.decl({ prop: 'outline', value: 'none' })),
    postcss.rule({
        selectors: [
          '.monotone-' + key + ' input:focus',
          '.monotone-' + key + ' select:focus',
        ]
      }),
    postcss.rule({
        selectors: [
          '.monotone-' + key + ' code',
          '.monotone-' + key + ' pre',
        ]
      })
      .append(postcss.decl({ prop: 'background-color', value: color.alpha(.25).rgbString() })),
    postcss.rule({
        selectors: [
          '.monotone-' + key + '.inverse',
          '.monotone-' + key + ' .inverse',
          '.monotone-' + key + ' .button',
        ]
      })
      .append(postcss.decl({ prop: 'color', value: 'white' }))
      .append(postcss.decl({ prop: 'background-color', value: hex })),
    postcss.rule({
      selectors: [
        '.monotone-' + key + '.inverse.readable',
        '.monotone-' + key + '.readable .inverse',
        '.monotone-' + key + '.readable .button',
      ]
    })
      .append(postcss.decl({ prop: 'color', value: dark ? 'white' : colors.black })),
    postcss.rule({
        selectors: [
          '.monotone-' + key + '.inverse .button',
          '.monotone-' + key + ' .inverse .button',
        ]
      })
      .append(postcss.decl({ prop: 'color', value: hex }))
      .append(postcss.decl({ prop: 'background-color', value: 'white' })),
      //.append(postcss.decl({ prop: 'background-color', value: dark ? 'white' : colors.black })),
    postcss.rule({
        selectors: [
          '.monotone-' + key + '.inverse a',
          '.monotone-' + key + ' .inverse a',
        ]
      })
      .append(postcss.decl({ prop: 'color', value: 'white' })),
      //.append(postcss.decl({ prop: 'color', value: dark ? 'white' : colors.black })),
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
      .append(postcss.decl({ prop: 'border-color', value: 'white' })),
      //.append(postcss.decl({ prop: 'border-color', value: dark ? 'white' : colors.black })),
    postcss.rule({
        selectors: [
          '.monotone-' + key + '.inverse input',
          '.monotone-' + key + ' .inverse input',
          '.monotone-' + key + '.inverse select',
          '.monotone-' + key + ' .inverse select',
        ]
      })
      .append(postcss.decl({ prop: 'color', value: 'white' }))
      //.append(postcss.decl({ prop: 'color': value: 'white' }))
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

fs.writeFileSync('docs/monotone.css', css);

