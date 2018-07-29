Overload bracket
=========

Overloading square bracket operator [] and other array methods to any object with container using es6 proxy.

### Disclamer

This project was just for fun, use it as a reference for your own proxy.

### Use cases

With this library you can forget about creating new arrays and keep your code clean. For example you have an object with points container 
and you trying to iterate through X values. You can create ObjectHandler of X points and manipulate X data inside object like in array. This is helpfull when you use charting libraries and when you fetching data from server.
```javascript
let obj = { points : [{x: 1, y: 2}, {x: 10, y: 20}, {x: -1, y: -2}]};
let x = new ObjectHandler(
  obj,                                        //target object
  p => p.points,                              //target array
  p => p.x,                                   //getter
  (p, v) => p.x = v                           //setter
);
let mean = (x[0] + x[1] + x[2]) / x.length(); //calculate (1 + 10 - 1) / 3
x.map(x => x*x);                              //map array to [1, 100, 1]
console.log(x.join(", "));                    //console.log("1, 10, -1");
```

### Installation

If you use new node.js or modern browsers just install npm package `npm i overload-bracket` or run command `npm run build:browser` to build script for web page. With es5 environment you need to think about babel, babel-proxy-plugin or harmony-reflect.

### Contributing

Feel free to contribute.
