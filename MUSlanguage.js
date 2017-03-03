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

var compile = function (musexpr) {
    var list = [];
    var time = 0;
    
    var create_list = function(musexpr) {
        if(musexpr.tag == 'note') {
            musexpr.start = time;
            time += musexpr.dur;
            list.push(musexpr);
        }
        else {
            create_list(musexpr.left);
            create_list(musexpr.right);
        }
    };
        
    create_list(musexpr);
    return list;
};

var playMUS = function(musexpr) {
    playNOTE(compile(musexpr));
};

var compile = function (musexpr) {
    
    var list = [];
    
    var compileT = function (musexpr, time) {
        if(musexpr.tag == 'note') {
            musexpr.start = time;
            list.push(musexpr);
            return time + musexpr.dur;
        }
        else if(musexpr.tag == 'seq') {
        
            return compileT(musexpr.right, compileT(musexpr.left, time));
        
            } else 
                if (musexpr.tag == 'par') {
                    return Math.max(compileT(musexpr.left, time), compileT(musexpr.right, time));
                }   
    };
    
    compileT(musexpr,0);
    
    return list;
};
