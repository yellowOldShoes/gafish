'use strict';

var inputs = [1, 2, 3];
inputs = inputs.map(function (item, i) {
  if (i == 1) return;
  return item + i * 100;
});
console.log(inputs);

var a = 'test';
for (var _i = a.length - 1; _i >= 0; _i--) {
  console.log(a[_i]);
};
console.log(i);
