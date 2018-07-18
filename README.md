ObjectHandler
=========

Overloading square bracket operator [] and other array methods to any object with container using es6 proxy.

### Use cases

With this library you can forget about creating new arrays and keep your code clean. For example you have an object with points container 
and you trying to iterate through _X_ values. You can create _ObjectHandler_ of _X_ points and manipulate _X_ data inside object like in array. This is helpfull when you use charting libraries and when you fetching data from server.
```
let obj = { points : [{x: 1, y: 2}, {x: 10, y: 20}, {x: -1, y: -2}]};
let x = new ObjectHandler(obj, p => p.points, p => p.x, (p, v) => p.x = v);
let mean = (x[0] + x[1] + x[2]) / x.length();
x.map(x => x*x);
console.log(x.join(", "));
```

### Installation

If you use new node.js or modern browsers just install npm package `npm i object-handler` or run command `npm run build:browser` to build web page script. With es5 environment you need to think about babel and [harmony-reflect](https://github.com/tvcutsem/harmony-reflect).

### 2do
* Do we really need setters here? Maybe we need to create smaller library.

### Contributing

Feel free to contribute.
