'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var tape = _interopDefault(require('tape'));

/**
 * This class overloads operator[] and array methods to given object.
 * For example you have object with vector of points `let V = {points: [{x: 1, y: 2}, {x: 10, y: 20}, {x: -1, y: -2}]}`.
 * You can create pseudo-array of x points by `let X = new ObjectHandler(V, x => x.points, x => x.x, (x, v) => x.x = v`.
 * And access the elements of an pseudo-array like it ordinary array `(X[0] + X[1]) / X.length` and `X.filter(func)`
 */
class ObjectHandler {

  /**
   * @constructor ObjectHandler constructor
   * @param object Target object with data
   * @param container Function that return iterable container
   * @param getter Getter inside container
   * @param setter Setter indide container
   */
  constructor(object, container, getter, setter = null) {
    this.proxy = new Proxy(object, this.handler(container, getter, setter));
    //this.proxy.toString = Function.prototype.bind(object);
    return this.proxy;
  }

  handler(container, getter, setter) {
    return {

      get: (object, key) => {
        if (key === 'length') {
          return container(object).length;
        } else if (typeof Array.prototype[key] == 'function') { //array methods
          if (typeof this[key] == 'function') {
            return this[key]();
          } else {
            return this.emulateArrayMethod(object, key, container, getter);
          }
        } else { 
          try {                                               //access array by index
            if(key === parseInt(key).toString()) {
              if(0 <= key && key < this.length) {
                return getter(container(object)[key]);
              } else {
                throw "index out of bondary";
              }
            } else {
              throw "float index";
            }
          } catch (err) {                                   //access to object by literal
            return Reflect.get(object, key);
          }
        }
      },

      set: (object, key, value) => {
        setter(container(object)[key], value);
        return true;
      }

    }
  }

  emulateArrayMethod(object, key, container, getter) {
    return (...args) => {
      try {
        console.log("Deprecated emulation. Better to define method " + key + "() by hands.");
        return Reflect.apply([][key], container(object), args).map(x => getter(x));
      } catch (err) {
        throw "Array method can not be emulated!";
      }
    }
  }

  get length() {
    return this.proxy.length;
  }

  slice() {
    return (start, end = this.length) => {
      let result = [];
      for (let i = start; i < end; i++) {
        result.push(this.proxy[i]);
      }
      return result;
    }
  }

  forEach() {
    return (func) => {
      for(let i = 0; i < this.length; i++) {
        func(this.proxy[i], i, this.proxy);
      }
      return this.proxy;
    }
  }

  map() {
    return (op) => {
      for (let i = 0; i < this.length; i++) {
        this.proxy[i] = op(this.proxy[i], i, this.proxy);
      }
      return this.proxy;
    }
  }

  filter() {
    return (op) => {
      let result = [];
      for (let i = 0; i < this.length; i++) {
        if (op(this.proxy[i], i, this.proxy)) {
          result.push(this.proxy[i]);
        }
      }
      return result;
    }
  }

  reduce() {
    return (op, init) => {
      let total = init;
      for (let i = 0; i < this.length; i++) {
        total = op(total, this.proxy[i], i, this.proxy);
      }
      return total;
    }
  }
  
  every() {
    return (op) => {
      let isEvery = true;
      for(let i = 0; i < this.length; i++) {
        if (op(this.proxy[i], i, this.proxy)) {
          continue;
        } else {
          isEvery = false;
          break;
        }
      }
      return isEvery;
    }
  }

  reverse() {
    return () => {
      for (let i = 0; i < Math.floor(this.length / 2); i++) {
        let temp = this.proxy[i];
        this.proxy[i] = this.proxy[this.length - i - 1];
        this.proxy[this.length - i - 1] = temp;
      }
      return this.proxy;
    }
  }

  join() {
    return (separator) => {
      let result = "";
      for (let i = 0; i < this.length - 1; i++) {
        result += this.proxy[i] + separator;
      }
      return result + this.proxy[this.length - 1];
    }
  }

  toString() {
    return () => {
      let result = "[ ";
      for (let i = 0; i < this.length - 1; i++) {
        result += this.proxy[i] + ", ";
      }
      return result + this.proxy[this.length - 1] + " ]";
    }
  }

  get [Symbol.toStringTag]() {
    return "ObjectHandler";
  }
}

let obj = { "arr": [{ x: 1, d: {y: '100'}},
                    { x: 2, d: {y: '200'}},
                    { x: 3, d: {y: '300'}}],
            "literal": 123 };
let test = new ObjectHandler(obj, p => p.arr, p => p.d.y, (p, val) => { p.d.y = val; });
let test2 = new ObjectHandler(obj, p => p.arr, p => p.x, (p, val) => { p.x = val; });

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
  t.equal(test['literal'] == 123, true, 'Ordinary property of object unavailable');
  t.end();
});

tape('Method slice()', function(t) {
  t.deepEqual(test.slice(0, 2), ['100', '200'], true, 'Method slice() is wrong');
  t.end();
});

tape('Method forEach()', function(t) {
  let temp = [];
  test.forEach((item, i) => { temp[i] = item / 100;});
  t.deepEqual(temp, test2.slice(0), true, 'Method forEach() is wrong');
  t.end();
});

tape('Method map()', function(t) {
  test2.map((item, i) => item * 100 / (i + 1));
  t.deepEqual(test2.slice(0), [100,100,100], true, 'Method map() is wrong');
  test2.map((item, i) => i + 1);
  t.end();
});

tape('Method filter()', function(t) {
  let p = test.filter((item, i) => parseInt(item) > 150).length / 2;
  let q = test2.filter((item, i) => (item / (i + 1)) == 1).map(x => (x * 100 * p).toString());
  t.deepEqual(q.slice(0), test.slice(0), true, 'Method filter() is wrong');
  t.end();
});

tape('Method reduce()', function(t) {
  let p = test2.reduce((sum, item, i) => sum += item * i, 0);
  t.equal(p, 8, true, 'Method reduce() is wrong');
  t.end();
});

tape('Method every()', function(t) {
  let p = test2.every((item, i) => 1 <= item && item <= 3 && 0 <= i && i < 3);
  let q = test2.every((item, i) => 100 <= item && item <= 300 && 0 <= i && i < 3);
  t.deepEqual([p, q], [true, false], true, 'Method every() is wrong');
  t.end();
});

tape('Method reverse()', function(t) {
  t.deepEqual(test2.reverse().slice(0), [3, 2, 1], true, 'Method every() is wrong');
  t.end();
  test2.reverse();
});

tape('Method join()', function(t) {
  t.deepEqual(test2.join('*'), "1*2*3", true, 'Method join() is wrong');
  t.end();
});

tape('Method toString()', function(t) {
  t.deepEqual(test2.toString(), '[ 1, 2, 3 ]', true, 'Method toString() is wrong');
  t.end();
});
