var assert = chai.assert;

suite('parse', function() {
    test('a number', function() {
        assert.deepEqual(
            SCHEEM.parse('42'),
            42
        );
    });

    test('a variable', function() {
        assert.deepEqual(
            SCHEEM.parse('x'),
            'x'
        );
    });

    test('arithmetic expression', function() {
        assert.deepEqual(
            SCHEEM.parse('(* (+ 2 (- 6 5)))'),
            ['*', ['+', 2, ['-', 6, 5]]]
        );
    });
});