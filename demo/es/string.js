let s1 = 'hello';
for(let s of s1){
  console.log(s)
}
// for(var s in s1){
//   console.log(s1[s])
// }

let text = String.fromCodePoint(0x20BB7);
for (let i of text) {
  console.log(i);
}

let s2 = 'Hello world!'
console.log(s2.includes('Hello'))
console.log(s2.startsWith('Hello'))
console.log(s2.endsWith('!'))

console.log('gafish '.repeat(3))

// console.log('190'.padStart(10, 0))
// console.log('0.1'.padEnd(4, 0))

let name = "Bob", time = "today";
console.log(`Hello ${name},
  how are you ${time}?`)