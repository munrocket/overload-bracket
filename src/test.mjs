import tape from 'tape';
import ObjectHandler from './index';

let obj = { "arr": [{ x: 1, d: {y: '100'}},
                    { x: 2, d: {y: '200'}},
                    { x: 3, d: {y: '300'}}],
            "literal": 123 };
let test = new ObjectHandler(obj, p => p.arr, p => p.d.y, (p, val) => { p.d.y = val });
let test2 = new ObjectHandler(obj, p => p.arr, p => p.x, (p, val) => { p.x = val });

tape('Square bracket getter', function(t) {
  t.equal(test[0] == 100, true, 'Accessing by square bracket fail');
  t.end();
});

tape('Length property', function(t) {
  t.equal(test.length == obj.arr.length, true, 'Length property not defined');
  t.end();
});

tape('Setter accessor', function(t) {
  let temp = test[test.length - 1];
  test[test.length - 1] = "set";
  t.equal(test[test.length - 1] == "set", true, 'Setter accessor fail');
  test[test.length - 1] = temp;
  t.end();
});

tape('Ordinary property of object', function(t) {
  t.equal(test['literal'] == 123, true, 'Ordinary property of object unavailable')
  t.end();
});

tape('Method slice()', function(t) {
  t.deepEqual(test.slice(0, 2), ['100', '200'], true, 'Method slice() is wrong')
  t.end();
});

tape('Method forEach()', function(t) {
  let temp = []
  test.forEach((item, i) => { temp[i] = item / 100});
  t.deepEqual(temp, test2.slice(0), true, 'Method forEach() is wrong')
  t.end();
});

tape('Method map()', function(t) {
  test2.map((item, i) => item * 100 / (i + 1));
  t.deepEqual(test2.slice(0), [100,100,100], true, 'Method map() is wrong')
  test2.map((item, i) => i + 1);
  t.end();
});

tape('Method filter()', function(t) {
  let p = test.filter((item, i) => parseInt(item) > 150).length / 2;
  let q = test2.filter((item, i) => (item / (i + 1)) == 1).map(x => (x * 100 * p).toString());
  t.deepEqual(q.slice(0), test.slice(0), true, 'Method filter() is wrong')
  t.end();
});

tape('Method reduce()', function(t) {
  let p = test2.reduce((sum, item, i) => sum += item * i, 0);
  t.equal(p, 8, true, 'Method reduce() is wrong')
  t.end();
});

tape('Method every()', function(t) {
  let p = test2.every((item, i) => 1 <= item && item <= 3 && 0 <= i && i < 3);
  let q = test2.every((item, i) => 100 <= item && item <= 300 && 0 <= i && i < 3);
  t.deepEqual([p, q], [true, false], true, 'Method every() is wrong')
  t.end();
});

tape('Method reverse()', function(t) {
  t.deepEqual(test2.reverse().slice(0), [3, 2, 1], true, 'Method every() is wrong')
  t.end();
  test2.reverse();
});

tape('Method join()', function(t) {
  t.deepEqual(test2.join('*'), "1*2*3", true, 'Method join() is wrong')
  t.end();
});

tape('Method toString()', function(t) {
  t.deepEqual(test2.toString(), '[ 1, 2, 3 ]', true, 'Method toString() is wrong')
  t.end();
});
