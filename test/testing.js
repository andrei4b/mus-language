var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs');

var data = fs.readFileSync('scheemGrammar.peg', 'utf-8');

//console.log(data);

var parse = PEG.generate(data).parse;

assert.deepEqual( parse("(a b c)"), ["a", "b", "c"]);
assert.deepEqual( parse("(a (b (c d)))"), ["a", ["b", ["c", "d"]]]);

assert.deepEqual( parse("(\t + b '(- a   b)  \n)"), ["+", "b", ["quote", ["-", "a", "b"]]]);

assert.deepEqual( parse("(+ b ';;abc\n (- a b))"), ["+", "b", ["quote", ["-", "a", "b"]]]);