ObjectHandler
=========

Overloading square bracket operator [] and other array methods to any object with container using es6 proxy.

### Use cases

With this library you can forget about creating new arrays and keep your code clean. For example you have an object with points container `let obj = { points : [{x: 1, y: 2}, {x: 10, y: 20}, {x: -1, y: -2}], ...}` and you trying to iterate through X values. You can create `ObjectHandler` of x points by `let X = new ObjectHandler(obj, x => x.points, x => x.x, (x, v) => x.x = v` and manipulate X data inside object like in array. For example `(X[0]+X[1]+X[2]) / X.length()` or `X.map(x => x*x)`. This is helpfull when you use charting libraries and when you fetching data from server.`

### Installation

If you use new node.js or modern browsers just install npm package `npm i object-handler` or run command `npm run build:browser` to build web page script. With es5 environment you need to think about babel and [harmony-reflect](https://github.com/tvcutsem/harmony-reflect).

### 2do
* Do we really need setters here? Maybe we need to create smaller library.

### Contributing

Feel free to contribute.