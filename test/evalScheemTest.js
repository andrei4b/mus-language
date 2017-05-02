var assert = chai.assert;

suite('quote', function() {
    test('a number', function() {
        assert.deepEqual(
            evalScheem(['quote', 3], {}),
            3
        );
    });
    test('an atom', function() {
        assert.deepEqual(
            evalScheem(['quote', 'dog'], {}),
            'dog'
        );
    });
    test('a list', function() {
        assert.deepEqual(
            evalScheem(['quote', [1, 2, 3]], {}),
            [1, 2, 3]
        );
    });

    test('error number of arguments', function() {
        assert.throws(function() {
            evalScheem(['quote', [1, 2, 3], 'x'], {});
        });
    });
});



suite('add', function() {
    test('two numbers', function() {
        assert.deepEqual(
            evalScheem(['+', 3, 5], {}),
            8
        );
    });

    test('three numbers', function() {
        assert.deepEqual(
            evalScheem(['+', 3, 5, 7], {}),
            15
        );
    });

    test('5 numbers/expressions', function() {
        assert.deepEqual(
            evalScheem(['+', 3, ['+', 5, 2], 7, ['+', 1, 1, 1], 10], {}),
            30
        );
    });

    test('a number and an expression', function() {
        assert.deepEqual(
            evalScheem(['+', 3, ['+', 2, 2]], {}),
            7
        );
    });

    test('error not number', function() {
        assert.throws(function() {
            evalScheem(['+', ['quote', 1, 2, 3], 5], {});
        });
    });

    test('error number of arguments', function() {
        assert.throws(function() {
            evalScheem(['+'], {});
        });
    });
});



suite('multiply', function() {
    test('two numbers', function() {
        assert.deepEqual(
            evalScheem(['*', 3, 5], {}),
            15
        );
    });

    test('three numbers', function() {
        assert.deepEqual(
            evalScheem(['*', 3, 5, 7], {}),
            105
        );
    });

    test('5 numbers/expressions', function() {
        assert.deepEqual(
            evalScheem(['*', 3, ['*', 5, 2], 7, ['*', 1, 1, 1], 10], {}),
            2100
        );
    });

    test('a number and an expression', function() {
        assert.deepEqual(
            evalScheem(['*', 3, ['*', 2, 2]], {}),
            12
        );
    });

    test('error not number', function() {
        assert.throws(function() {
            evalScheem(['*', ['quote', 1, 2, 3], 5], {});
        });
    });

    test('error number of arguments', function() {
        assert.throws(function() {
            evalScheem(['*'], {});
        });
    });
});




suite('subtract', function() {
    test('two numbers', function() {
        assert.deepEqual(
            evalScheem(['-', 3, 5], {}),
            -2
        );
    });

    test('three numbers', function() {
        assert.deepEqual(
            evalScheem(['-', 3, 5, 7], {}),
            -9
        );
    });

    test('5 numbers/expressions', function() {
        assert.deepEqual(
            evalScheem(['-', 3, ['-', 5, 2], 7, ['-', 1, 1, 1], 10], {}),
            -16
        );
    });

    test('a number and an expression', function() {
        assert.deepEqual(
            evalScheem(['-', 3, ['-', 2, 2]], {}),
            3
        );
    });

    test('error not number', function() {
        assert.throws(function() {
            evalScheem(['-', ['quote', 1, 2, 3], 5], {});
        });
    });

    test('error number of arguments', function() {
        assert.throws(function() {
            evalScheem(['-'], {});
        });
    });
});



suite('define & set number', function() {
    var env = {};
    test('define first', function() {
        evalScheem(['define', 'a', 5], env);
        assert.deepEqual(
            env,
            {
                bindings: {'a': 5},
                outer: {}
            }
        );
    });

    test('define second', function() {
        evalScheem(['define', 'b', 6], env);
        assert.deepEqual(
            env,
            {
                bindings: {'a': 5, 'b': 6},
                outer: {}
            }
        );
    });

    test('set when defined', function() {
        evalScheem(['set!', 'a', 10], env);
        assert.deepEqual(
            env,
            {
                bindings: {'a': 10, 'b': 6},
                outer: {}
            }
        );
    });

    test('error set when not defined', function() {       
        assert.throws(function() {
            evalScheem(['set!', 'c', 10], env);
        });
    });

    test('error define number of arguments', function() {
        assert.throws(function() {
            evalScheem(['define', 'd', 2, 3], {});
        });
    });

    test('error define type of arguments', function() {
        assert.throws(function() {
            evalScheem(['define', 3, 2], {});
        });
    });

    test('error set number of arguments', function() {
        assert.throws(function() {
            evalScheem(['set!', 'd', 2, 3], {});
        });
    });

    test('error set type of arguments', function() {
        assert.throws(function() {
            evalScheem(['set!', 3, 2], {});
        });
    });
    
});




suite('define & set list', function() {
    var env = {};
    test('define quoted atom', function() {
        evalScheem(['define', 'a', ['quote', 'a']], env);
        assert.deepEqual(
            env,
            {
                bindings: {'a': 'a'},
                outer: {}
            }
        );
    });
    
    test('define quoted list', function() {
        evalScheem(['define', 'b', ['quote', [1, 2, 3]]], env);
        assert.deepEqual(
            env,
            {
                bindings: {'a': 'a', 'b': [1, 2, 3]},
                outer: {}
            }
        );
    });

    test('set deep list', function() {
        evalScheem(['set!', 'b', ['quote', [1, 2, [3,  4, [5]]]]], env);
        assert.deepEqual(
            env,
            {
                bindings: {'a': 'a', 'b': [1, 2, [3,  4, [5]]]},
                outer: {}
            }
        );
    });

});



suite('cons', function() {
    test('atom and list', function() {
        assert.deepEqual(
            evalScheem(['cons', ['quote', 'x'], ['quote', [1, 2, 3, 'a']]], {}),
            ['x', 1, 2, 3, 'a']
        );
    });

    test('atom and empty list', function() {
        assert.deepEqual(
            evalScheem(['cons', ['quote', 'x'], ['quote', []]], {}),
            ['x']
        );
    });

    test('list and list', function() {
        assert.deepEqual(
            evalScheem(['cons', ['quote', ['a', 'b']], ['quote', [1, 2, 3]]], {}),
            [['a', 'b'], 1, 2, 3]
        );
    });

    test('double cons', function() {
        assert.deepEqual(
            evalScheem(['cons', ['quote', ['a', 'b']], ['cons', ['quote', 'x'], ['quote', []]]], {}),
            [['a', 'b'], 'x']
        );
    });

    test('error not list', function() {
        assert.throws(function() {
            evalScheem(['cons', 3, 'x'], {});
        });
    });

    test('error number of arguments', function() {
        assert.throws(function() {
            evalScheem(['cons', 3, 'x', 5], {});
        });
    });
});



suite('car', function() {
    test('atom', function() {
        assert.deepEqual(
            evalScheem(['car', ['quote', [1, 2, 3]]], {}),
            1
        );
    });

    test('list', function() {
        assert.deepEqual(
            evalScheem(['car', ['quote', [[5, 6], 2, 3]]], {}),
            [5, 6]
        );
    });

    test('error not list', function() {
        assert.throws(function() {
            evalScheem(['car', 3], {});
        });
    });

    test('error number of arguments', function() {
        assert.throws(function() {
            evalScheem(['car', 3, 'x', 5], {});
        });
    });
});



suite('cdr', function() {
    test('simple list', function() {
        assert.deepEqual(
            evalScheem(['cdr', ['quote', [1, 2, 3]]], {}),
            [2, 3]
        );
    });

    test('deep list', function() {
        assert.deepEqual(
            evalScheem(['cdr', ['quote', [7, [5, [6]], 2, 3]]], {}),
            [[5, [6]], 2, 3]
        );
    });

    test('error not list', function() {
        assert.throws(function() {
            evalScheem(['cdr', 3], {});
        });
    });

    test('error number of arguments', function() {
        assert.throws(function() {
            evalScheem(['cdr', 3, 'x', 5], {});
        });
    });
});



suite('=', function() {
    test('two numbers true', function() {
        assert.deepEqual(
            evalScheem(['=', 3, 3], {}),
            '#t'
        );
    });

    test('two numbers false', function() {
        assert.deepEqual(
            evalScheem(['=', 3, 5], {}),
            '#f'
        );
    });

    test('three numbers true', function() {
        assert.deepEqual(
            evalScheem(['=', 4, 4, 4], {}),
            '#t'
        );
    });

    test('a number and an expression true', function() {
        assert.deepEqual(
            evalScheem(['=', 3, ['+', 2, 1]], {}),
            '#t'
        );
    });

    test('a number and an expression false', function() {
        assert.deepEqual(
            evalScheem(['=', 3, ['+', 2, 2]], {}),
            '#f'
        );
    });

    test('5 numbers/expressions true', function() {
        assert.deepEqual(
            evalScheem(['=', 7, ['+', 5, 2], 7, ['+', 1, 1, 1, 4], 7], {}),
            '#t'
        );
    });

    test('5 numbers/expressions false', function() {
        assert.deepEqual(
            evalScheem(['=', 6, ['+', 5, 2], 7, ['+', 1, 1, 1, 4], 7], {}),
            '#f'
        );
    });

    test('error not number', function() {
        assert.throws(function() {
            evalScheem(['=', ['quote', 1, 2, 3], 5], {});
        });
    });

    test('error number of arguments', function() {
        assert.throws(function() {
            evalScheem(['=', 2], {});
        });
    });
});


suite('>', function() {
    test('two numbers true', function() {
        assert.deepEqual(
            evalScheem(['>', 5, 3], {}),
            '#t'
        );
    });

    test('two numbers false', function() {
        assert.deepEqual(
            evalScheem(['>', 1, 3], {}),
            '#f'
        );
    });

    test('two equal numbers false', function() {
        assert.deepEqual(
            evalScheem(['>', 3, 3], {}),
            '#f'
        );
    });

    test('a number and an expression true', function() {
        assert.deepEqual(
            evalScheem(['>', 5, ['+', 2, 1]], {}),
            '#t'
        );
    });

    test('two expressions false', function() {
        assert.deepEqual(
            evalScheem(['>', ['+', 1, 2], ['+', 2, 2]], {}),
            '#f'
        );
    });

    test('error not number', function() {
        assert.throws(function() {
            evalScheem(['>', ['quote', 1, 2, 3], 5], {});
        });
    });

    test('error number of arguments', function() {
        assert.throws(function() {
            evalScheem(['>', 2], {});
        });
    });
});



suite('<', function() {
    test('two numbers true', function() {
        assert.deepEqual(
            evalScheem(['<', 1, 3], {}),
            '#t'
        );
    });

    test('two numbers false', function() {
        assert.deepEqual(
            evalScheem(['<', 5, 3], {}),
            '#f'
        );
    });

    test('two equal numbers false', function() {
        assert.deepEqual(
            evalScheem(['<', 3, 3], {}),
            '#f'
        );
    });

    test('a number and an expression true', function() {
        assert.deepEqual(
            evalScheem(['<', 2, ['+', 2, 1]], {}),
            '#t'
        );
    });

    test('two expressions false', function() {
        assert.deepEqual(
            evalScheem(['<', ['+', 4, 2], ['+', 2, 2]], {}),
            '#f'
        );
    });

    test('error not number', function() {
        assert.throws(function() {
            evalScheem(['<', ['quote', 1, 2, 3], 5], {});
        });
    });

    test('error number of arguments', function() {
        assert.throws(function() {
            evalScheem(['<', 2], {});
        });
    });
});


suite('if', function() {
    test('true', function() {
        assert.deepEqual(
            evalScheem(['if', ['=', 2, ['+', 1, 1]], ['quote', 'x'], ['quote', 'y']], {}),
            'x'
        );
    });

    test('false', function() {
        assert.deepEqual(
            evalScheem(['if', ['>', 5, 6], 5, 3], {}),
            3
        );
    });

    test('error not predicate', function() {
        assert.throws(function() {
            evalScheem(['if', ['quote', 1, 2, 3], 5, 7], {});
        });
    });

    test('error number of arguments', function() {
        assert.throws(function() {
            evalScheem(['if', 2], {});
        });
    });
});



suite('begin', function() {
    test('define, set, result', function() {
        assert.deepEqual(
            evalScheem(['begin', ['define', 'a', 2], ['define', 'b', 0], ['set!', 'b', ['+', 'a', 2]], 'b'], {}),
            4
        );
    });

    test('define, set, simple expression', function() {
        assert.deepEqual(
            evalScheem(['begin', ['define', 'a', 2], ['define', 'b', 0], ['set!', 'b', 10], ['cons', ['+', 1, 0], ['cons', 'a', ['cons', 'b', ['quote', []]]]]], {}),
            [1, 2, 10]
        );
    });    
});


suite('other errors', function() {
    
    test('error unknown function', function() {
        assert.throws(function() {
            evalScheem([1, [1, 2, 3], 'x'], {});
        });
    });
});
