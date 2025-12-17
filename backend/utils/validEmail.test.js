const { isValidEmail } = require('./validEmail')

describe('isValidEmail', () => {
    test('valid email passes', () => {
        expect(isValidEmail('test@example.com')).toBe(true);
    });

    test('missing @ fails', () => {
        expect(isValidEmail('testexample.com')).toBe(false);
    });

    test('missing domain fails', () => {
        expect(isValidEmail('test@')).toBe(false);
    });
});