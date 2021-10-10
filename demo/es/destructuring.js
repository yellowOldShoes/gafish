let [a, b, c] = [11, 22, 33];
console.log(a, b, c)

let [a1, b1, c1 = 3] = [11, 22];
console.log(a1, b1, c1)

let {a2 = 10, b2 = 10, c2 = 10} = {a2: 1, b2: 2}
console.log(a2, b2, c2)

let {aa: a3, bb: b3} = {aa: 111, bb: 222}
console.log(a3, b3)

let {aa: [a4, {b4}]} = {aa: [1, {b4: 2}]}
console.log(a4, b4)
// console.log(aa)

let {sin, cos} = Math;
console.log(sin)

let {0: first} = [1, 2, 3];
console.log(first)

let [a5, b5, c5] = 'hello';
console.log(a5, b5)

let {length: len} = 'hello'
console.log(len)

let {toString: a6} = true;
console.log(a6 === Boolean.prototype.toString)

function add ({a, b}){
  return a+b;
}
console.log(add({a:1,b:10}))

function move ({a = 0, b = 0} = {}){
  return a+b;
}
console.log(move({a:1,b:10}))
console.log(move({a:1}))
console.log(move({}))
console.log(move())

let a7 = 123;
[(a7)] = [321]
console.log(a7)

let a8 = 1;
let b8 = 2;
[a8, b8] = [b8, a8]
console.log(a8, b8)

function example (){
  return {
    a9: 1,
    b9: 2,
    c9: 3
  }
}
let {a9, b9, c9} = example();
console.log(a9, b9, c9)