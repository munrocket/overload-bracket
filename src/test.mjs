import tape from 'tape';
import ObjectHandler from './index';

let obj = { "arr": [{ x: 1, d: {y: '100'}},
                    { x: 2, d: {y: '200'}},
                    { x: 3, d: {y: '300'}}],
            "literal": 123 };
let test = new ObjectHandler(obj, p => p.arr, p => p.d.y, (p, val) => { p.d.y = val });
let test2 = new ObjectHandler(obj, p => p.arr, p => p.x, (p, val) => { p.x = val });

tape('Square bracket getter', function(t) {
  t.equal(test[0] == 100, true);
  t.end();
});

tape('Length property', function(t) {
  t.equal(test.length == obj.arr.length, true);
  t.end();
});

tape('Setter accessor', function(t) {
  let temp = test[test.length - 1];
  test[test.length - 1] = "set";
  t.equal(test[test.length - 1] == "set", true);
  test[test.length - 1] = temp;
  t.end();
});

tape('Access to ordinary property', function(t) {
  t.equal(test['literal'] == 123, true);
  t.end();
});

tape('Method slice()', function(t) {
  t.deepEqual(test.slice(0, 2), ['100', '200']);
  t.end();
});

tape('Method forEach()', function(t) {
  let temp = []
  test.forEach((item, i) => { temp[i] = item / 100});
  t.deepEqual(temp, test2.slice(0));
  t.end();
});

tape('Method map()', function(t) {
  let a = test2.map((item, i) => item * 100 / (i + 1));
  console.log(a, test2);
  t.deepEqual(a.slice(0), [100,100,100]);
  test2.map((a, i) => i + 1);
  t.end();
});

tape('Method filter()', function(t) {
  let p = test.filter((item, i) => parseInt(item) > 150).length / 2;
  let q = test2.filter((item, i) => (item / (i + 1)) == 1).map(x => (x * 100 * p).toString());
  t.deepEqual(q.slice(0), test.slice(0));
  t.end();
});

tape('Method reduce()', function(t) {
  let p = test2.reduce((sum, item, i) => sum += item * i, 0);
  t.equal(p, 8);
  t.end();
});

tape('Method every()', function(t) {
  let p = test2.every((item, i) => 1 <= item && item <= 3 && 0 <= i && i < 3);
  let q = test2.every((item, i) => 100 <= item && item <= 300 && 0 <= i && i < 3);
  t.deepEqual([p, q], [true, false]);
  t.end();
});

tape('Method every() thisarg', function(t) {
  let that = {'foo':42};
  let fn = function(item, i) { return this && this.foo === 42 && 1 <= item && item <= 3 && 0 <= i && i < 3 };
  let p = test2.every( fn, that );
  let p2 = test2.every( fn );
  let p3 = test2.every((item, i) => 1 <= item && item <= 3 && 0 <= i && i < 3);
  t.ok(p);
  t.notOk(p2);
  t.ok(p3);
  t.end();
});


tape('Method reverse()', function(t) {
  t.deepEqual(test2.reverse().slice(0), [3, 2, 1]);
  test2.reverse();
  t.end();
});

tape('Method join()', function(t) {
  t.deepEqual(test2.join('*'), "1*2*3");
  t.end();
});

tape('Method toString()', function(t) {
  t.deepEqual(test2.toString(), '[ 1, 2, 3 ]');
  t.end();
});
