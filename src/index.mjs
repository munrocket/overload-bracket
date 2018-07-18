/**
 * This class overloads operator[] and array methods to given object.
 * For example you have object with vector of points `let V = {points: [{x: 1, y: 2}, {x: 10, y: 20}, {x: -1, y: -2}]}`.
 * You can create pseudo-array of x points by `let X = new ObjectHandler(V, x => x.points, x => x.x, (x, v) => x.x = v`.
 * And access the elements of an pseudo-array like it ordinary array `(X[0] + X[1]) / X.length` and `X.filter(func)`
 */
export default class ObjectHandler {

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
        setter(container(object)[key], value)
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
          result.push(this.proxy[i])
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
