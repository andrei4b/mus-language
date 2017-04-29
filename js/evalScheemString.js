var evalScheem = require('./evalScheem').evalScheem;
const parse = require('./parser').SCHEEM.parse;

var evalScheemString = function(expr, env)
{
	return evalScheem(parse(expr), env);
}

//---------------------------------------------------

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '-> '
});

rl.prompt();

rl.on('line', (line) => {
  switch(line) {
    case 'close':
      rl.close();
      break;
    default:
    try {
      console.log(evalScheemString(line, {}));
     } catch (e) {console.log(e.message);}
      break;
  }
  rl.prompt();

}).on('close', () => {
  console.log('Have a great day!');
  process.exit(0);
});

if (typeof module !== 'undefined') {
	module.exports.evalScheemString = evalScheemString;
}