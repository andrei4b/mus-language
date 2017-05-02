var lookup = function (env, v) {
    if (!(env.hasOwnProperty('bindings')))
        throw new Error(v + " not found");
    if (env.bindings.hasOwnProperty(v))
        return env.bindings[v];
    return lookup(env.outer, v);
};

var update = function (env, v, val) {
    if (!(env.hasOwnProperty('bindings')))
        throw new Error(v + " not found");
    if(env.bindings.hasOwnProperty(v))
        env.bindings[v] = val;
    else
        update(env.outer, v, val);
};

var add_binding = function (env, v, val) {
    env.bindings[v] = val;
};

var evalScheem = function (expr, env) {
    // Numbers evaluate to themselves
    if (typeof expr === 'number') {
        return expr;
    }
    // Strings are variable references
    if (typeof expr === 'string') {
        return lookup(env, expr);
    }
    // Look at head of list for operation
    switch (expr[0]) {
        case '+':
            if(expr.length < 3)
                throw new Error("Wrong number of arguments!");

            var len = expr.length;
            var sum = 0;
            for(var i = 1; i < len; ++i)
            {
                var term = evalScheem(expr[i], env);
                if(typeof term != 'number')
                    throw new Error("Only numbers can be added!");

                sum = sum + term;
            }

            return sum;

        case '*':
            if(expr.length < 3)
                throw new Error("Wrong number of arguments!");

            var len = expr.length;
            var product = 1;
            for(var i = 1; i < len; ++i)
            {
                var term = evalScheem(expr[i], env);
                if(typeof term != 'number')
                    throw new Error("Only numbers can be added!");

                product = product * term;
            }

            return product;    

        case '-':
            if(expr.length < 3)
                throw new Error("Wrong number of arguments!");

            var len = expr.length;

            var term = evalScheem(expr[1], env);
            if(typeof term != 'number')
                throw new Error("Only numbers can be added!");
            var sum = term;

            for(var i = 2; i < len; ++i)
            {
                term = evalScheem(expr[i], env);
                if(typeof term != 'number')
                    throw new Error("Only numbers can be added!");

                sum = sum - term;
            }

            return sum;    
                   
        case 'define':
                if(expr.length != 3)
                    throw new Error("Wrong number of arguments!");
                if(typeof expr[1] != 'string')
                    throw new Error("variable must be string!");

                if(!(env.hasOwnProperty('bindings')))
                    env.bindings = {};
                if(!(env.hasOwnProperty('outer')))
                    env.outer = {};
                if(env.hasOwnProperty(expr[1]))
                    throw new Error("Already defined!");

                add_binding(env, expr[1], evalScheem(expr[2], env));

                return 0;
          
        case 'set!':
                if(expr.length != 3)
                    throw new Error("Wrong number of arguments!");
                if(typeof expr[1] != 'string')
                    throw new Error("variable must be string!");

                update(env, [expr[1]], evalScheem(expr[2], env));

                return 0;

        case 'begin':
            if(expr.length < 2)
                    throw new Error("Wrong number of arguments!");
                
            var len = expr.length;
            for(var i = 1; i < len - 1; ++i)
            {
                evalScheem(expr[i], env);
            }
            return evalScheem(expr[len - 1], env);

        case 'quote':
            if(expr.length != 2)
                    throw new Error("Wrong number of arguments!");

            return expr[1];

        case 'cons':
            if(expr.length != 3)
                    throw new Error("Wrong number of arguments!");

            var l = evalScheem(expr[2], env);   
            if(Array.isArray(l) == false)
                throw new Error("Second argument must be list!");
            
            l.unshift(evalScheem(expr[1], env));

            return l;

        case 'car':
            if(expr.length != 2)
                    throw new Error("Wrong number of arguments!");

            var l2 = evalScheem(expr[1], env);
            if(Array.isArray(l2) == false)
                throw new Error("Argument must be list!");    

            return l2[0];

        case 'cdr':
            if(expr.length != 2)
                    throw new Error("Wrong number of arguments!");
            
            var l3 = evalScheem(expr[1], env);
            if(Array.isArray(l3) == false)
                throw new Error("Argument must be list!");

            l3.splice(0, 1);

            return l3;

        case '=':
            if(expr.length < 3)
                throw new Error("Wrong number of arguments!");

            var len = expr.length;

            var arg = evalScheem(expr[1], env);
            if(typeof arg != 'number')
                    throw new Error("Only numbers can be compared!");

            var value = arg;    

            for(var i = 2; i < len; ++i)
            {
                arg = evalScheem(expr[i], env);
                if(typeof arg != 'number')
                    throw new Error("Only numbers can be compared!");

                if(arg != value)
                    return '#f';
            }

            return '#t';

        case '>':
            if(expr.length < 3)
                throw new Error("Wrong number of arguments!");

            var len = expr.length;

            var arg = evalScheem(expr[1], env);
            if(typeof arg != 'number')
                    throw new Error("Only numbers can be compared!");
            var value = arg;

            for(var i = 2; i < len; ++i)
            {
                arg = evalScheem(expr[i], env);
                if(typeof arg != 'number')
                    throw new Error("Only numbers can be compared!");

                if(arg >= value)
                    return '#f';

                value = arg;
            }

            return '#t';

        case '<':
            if(expr.length < 3)
                throw new Error("Wrong number of arguments!");

            var len = expr.length;

            var arg = evalScheem(expr[1], env);
            if(typeof arg != 'number')
                    throw new Error("Only numbers can be compared!");
            var value = arg;

            for(var i = 2; i < len; ++i)
            {
                arg = evalScheem(expr[i], env);
                if(typeof arg != 'number')
                    throw new Error("Only numbers can be compared!");

                if(arg <= value)
                    return '#f';

                value = arg;
            }

            return '#t';    

        case 'if':
            if(expr.length != 4)
                    throw new Error("Wrong number of arguments!");

            var if_cond = evalScheem(expr[1], env);
            
            if (if_cond === '#t') 
                return evalScheem(expr[2], env);
            else if (if_cond === '#f') 
                    return evalScheem(expr[3], env);
                else 
                    throw new Error("First argument must be a predicate!");

        case 'let-one':
            var _var = expr[1];
            var _expr = expr[2];
            var _body = expr[3];
            var new_env = {};
            new_env.bindings = {};
            new_env.bindings[_var] = evalScheem(_expr, env);
            new_env.outer = env;
            return evalScheem(_body, new_env);

        case 'lambda-one':
            var _var = expr[1];
            var _body = expr[2];
            var f = function(_arg) {
                var new_env = {};
                new_env.bindings = {};
                new_env.outer = env;
                new_env.bindings[_var] = _arg;
                return evalScheem(_body, new_env);
            };
            return f;

        default: 
            var f = lookup(env, expr[0]);
            return f(evalScheem(expr[1], env));        
            
    }
};

if (typeof module !== 'undefined') {
    module.exports.evalScheem = evalScheem;
}