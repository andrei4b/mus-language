var lookup = function (env, v) {
    if (!(env.hasOwnProperty('bindings')))
        throw new Error(v + " not found");
    if (env.bindings.hasOwnProperty(v))
        return env.bindings[v];
    return lookup(env.outer, v);
};

var update = function (env, v, val) {
    if(env.bindings.hasOwnProperty(v))
        env.bindings[v] = val;
    else
        update(env.outer, v, val);
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
            return evalScheem(expr[1], env) +
                   evalScheem(expr[2], env);
        case 'let-one':
            var _var = expr[1];
            var _expr = expr[2];
            var _body = expr[3];
            var new_env = {};
            new_env.bindings = {};
            new_env.bindings[_var] = evalScheem(_expr, env);
            new_env.outer = env;
            return evalScheem(_body, new_env);
            
    }
};

var evalScheem = function (expr, env) {
    if (typeof expr === 'number') {
        return expr;
    }
    if (typeof expr === 'string') {
        return lookup(env, expr);
    }
    // Look at head of list for operation
    switch (expr[0]) {
        case '+':
            return evalScheem(expr[1], env) +
                   evalScheem(expr[2], env);
        case 'quote':
            return expr[1];
        default: 
            var f = lookup(env, expr[0]);
            return f(evalScheem(expr[1], env));
        
    }
};



var evalScheem = function (expr, env) {
    if (typeof expr === 'number') {
        return expr;
    }
    if (typeof expr === 'string') {
        return lookup(env, expr);
    }
    // Look at head of list for operation
    switch (expr[0]) {
        case '+':
            return evalScheem(expr[1], env) +
                   evalScheem(expr[2], env);
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
            // Simple application
            var func = evalScheem(expr[0], env);
            var arg = evalScheem(expr[1], env);
            return func(arg);
    }
};

var add_binding = function (env, v, val) {
    env.bindings[v] = val;
};