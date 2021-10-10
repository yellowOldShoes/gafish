'use strict';


var inputs = [1,2,3];
inputs = inputs.map((item, i) => {
  if (i == 1) return;
  return item + i*100;
});
console.log(inputs);

let a = 'test';
for (let i = a.length - 1; i >= 0; i--) {
  (function() {
    console.log(a[i]);
  })()
};
// console.log(i);

var tmp = 123;

if (true){
  // console.log(tmp)
  let tmp;
}

{
  {
    {
      var b = 11111000;
      console.log(b)
    }
  }
}

function test(){
  console.log('test')
}
if (true){
  function test(){
    console.log('test123')
  }
  test();
}
test();

const aa = 123;
// aa = 456;
console.log(aa)
console.log(window.aa)

console.log(new Set([1, 2, 3, 3, 4]))