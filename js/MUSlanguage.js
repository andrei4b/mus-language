var prelude = function(expr) {
    return { tag: 'seq', 
               left: {tag: 'note', pitch: 'd4', dur: 500 },
               right: expr };
};

var reverse = function(expr) {
    if(expr.tag == 'note')
       return expr;
    else 
        return {tag: 'seq', left: reverse(expr.right), right: reverse(expr.left)};
};

var endTime = function (time, expr) {
    var duration = function(expr) {
        if(expr.tag == 'note')
            return expr.dur;
        else
            return duration(expr.left) + duration(expr.right);
    };
    
    return time + duration(expr);
};

var convertToMIDI = function(note) {
    var dict = {a: 21, b: 23, c: 12, d: 14, e: 16, f: 17, g: 19};
    var letter = (note.charAt(0)).toLowerCase();
    var number = parseInt(note.charAt(note.length - 1));
    var alteration = 0;
    if(note.length == 3)
        if(note.charAt(1).toLowerCase() == 'b')
            alteration = -1;
        if(note.charAt(1).toLowerCase() == '#')
            alteration = 1;
    var result = dict[letter] + number * 12 + alteration;

    return result;
}
 
var compile = function (expr) {
    
    var list = [];
    
    var compileT = function (musexpr, time) {
        switch(musexpr.tag) {
            case 'rest': {
                var notexpr = { tag: 'rest', start: time, dur: musexpr.dur};
                list.push(notexpr);
                return time + notexpr.dur;
            }
            break;

            case 'note': {
                var notexpr = { tag: 'note', pitch: convertToMIDI(musexpr.pitch), start: time, dur: musexpr.dur};
                list.push(notexpr);
                return time + notexpr.dur;
            }
            break;

            case 'seq': {
                return compileT(musexpr.right, compileT(musexpr.left, time));
            }
            break;

            case 'par': {
                return Math.max(compileT(musexpr.left, time), compileT(musexpr.right, time));
            }
            break;

            case 'repeat': {
                var i;
                var t = time;
                for(i = 1; i <= musexpr.count; ++i) {
                    t = compileT(musexpr.section, t);

                }
                return t;
            }
        }     
    };
    
    compileT(expr,0);
    
    return list;
};

var playMUS = function(musexpr) {
    playNOTE(compile(musexpr));
};

var m1 =
    { tag: 'seq',
      left: 
       { tag: 'par',
         left: { tag: 'note', pitch: 'a#4', dur: 250 },
         right: { tag: 'note', pitch: 'c4', dur: 250 } },
      right:
       { tag: 'seq',
         left: { tag: 'rest', dur: 500 },
         right: { tag: 'note', pitch: 'd4', dur: 500 } } };

var m2 = { tag: 'repeat',
              section: { tag: 'par',
                         left: { tag: 'note', pitch: 'a#4', dur: 250 },
                         right: { tag: 'note', pitch: 'c4', dur: 250 } },
              count: 3 };

var melody_mus = 
    { tag: 'seq',
      left: 
       { tag: 'par',
         left: { tag: 'note', pitch: 'a#4', dur: 250 },
         right: 
            { tag: 'repeat',
              section: { tag: 'note', pitch: 'c4', dur: 250 },
              count: 3 } },
      right:
       { tag: 'seq',
         left: { tag: 'rest', dur: 500 },
         right: { tag: 'note', pitch: 'd4', dur: 500 } } };

console.log(m2);
console.log("\nCompiled:");
console.log(compile(m2));