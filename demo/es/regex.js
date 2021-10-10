console.log(new RegExp(/abc/ig, 'iu').flags)

var s = '𠮷';

console.log(/^.$/.test(s)) // false
console.log(/^.$/u.test(s)) // true
console.log(/\u{20BB7}/.test('ஷ'))
console.log(/\u{20BB7}/u.test('𠮷'))

var r = /hello\d/y;
console.log(r.sticky) // true