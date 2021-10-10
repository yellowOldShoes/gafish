let obj = {
    test(){
        console.log('test')
    },
    add(){
        console.log('add')
    },
}
obj.test();
obj.add();

let test2 = () => console.log('test2')
let add2 = () => console.log('add2')
let obj2 = {test2, add2,}
obj2.test2()
obj2.add2()

console.log(Object.is({a:1}, {a:1}))

let target = {a:1};
console.log(Object.assign(target, {b:1}, {c:1}))
console.log(target)
console.log(Object.assign({a:1}, {b:1}, {c:1}))

let obj3 = {
    a: 1,
    'b b b': 1,
    0: 1,
}
console.log(Object.keys(obj3))
console.log(Object.getOwnPropertyNames(obj3))
console.log(Object.getOwnPropertySymbols(obj3))
console.log(Reflect.ownKeys(obj3))

console.log(typeof Symbol())