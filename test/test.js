
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var cssnext = require('cssnext');
var validate = require('css-validator');

var files = fs.readdirSync(path.join(__dirname, '..'));

files = files.filter(function(filename) {
  return filename.match(/\.css$/);
});


describe('monotone', function() {

  files.forEach(function(filename) {
    var src = fs.readFileSync(path.join(__dirname, '../' + filename), 'utf8');
    var css = cssnext(src);
    it(filename + ' should be a string', function() {
      assert.equal(typeof css, 'string');
    });
  });

  var src = fs.readFileSync(path.join(__dirname, '../monotone-red.css'), 'utf8');
  var css;

  it('should compile to css', function() {
    assert.doesNotThrow(function() {
      var css = cssnext(src);
    });
  });

  it('should be valid CSS', function(done) {
    validate({ text: css }, function(err, data) {
      if (err) { console.log(err); }
      assert.equal(data.validity, true);
      done();
    });
  });

});

