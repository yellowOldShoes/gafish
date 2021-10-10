let ps = document.querySelectorAll('p');
console.log(ps)
Array.from(ps).map(p => console.log(p))

console.log([...document.querySelectorAll('p')])

console.log(Array.from('hello'))

let a1 = [1, 2, 3]
let b1 = Array.from(a1).map(n => n+1)
console.log(a1, b1)

console.log(Array.from({}))
console.log(Array.from({length:5}))

console.log(Array.from([1, 2, 3], x => x*100))