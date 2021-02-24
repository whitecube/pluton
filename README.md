# pluton
A javascript dispatcher that links JS classes to dom elements.  
It is the main part of our JS workflow at [whitecube](https://www.whitecube.be).

## Installation

### NPM
`npm i @whitecube/pluton`

### Yarn
`yarn add @whitecube/pluton`

and then in your code, import it:

```js
import Pluton from '@whitecube/pluton';
```

## Usage
All you have to do is create an instance of the class, for example :

```js
let pluton = new Pluton();
```

It will then auto-load all your JS files and link them to your dom nodes.

> Note: Pluton will create an instance of the appropriate class for each matching node it finds. This allows a truly object-oriented approach, where each component is its own stand-alone package, independent from the rest.

If you're wondering what these classes are, it's super simple: they're just regular ES6 classes.

The only requirement is that they must have a static getter called `selector`, that returns a css-like query-selector string that will be used to map this class to dom elements.

And there's only one more thing worth noting : When Pluton finds a dom node corresponding to that selector, it will create an instance of the class, and give the dom node as an argument to the constructor.

Here's an example:

```js
export default class Counter {
    static get selector() {
      return '.counter';
    }
    
    constructor(el) {
      this.el = el;
    }
}
```


## Configuration
We found that auto-loading is necessary for Pluton to work comfortably, as we like to make our code as modular as possible. We ended up having to `import` a whole lot of files into Pluton manually in each project, and auto-loading fixes that.

In your webpack config, you need to define a constant with the path to the folder that contains all your Pluton classes.  

You can create subfolders as well and everything will be loaded properly from simply specifying the root folder.

Here's an example, just a little sample:

### With Laravel Mix
The easiest method is to use the `laravel-mix-pluton` extension, [which can be found here](https://github.com/voidgraphics/laravel-mix-pluton).

If you need to do it manually:
```js
let pluton_path = __dirname + '/resources/assets/js/parts';

mix.webpackConfig(webpack => {
    return {
        plugins: [
            new webpack.DefinePlugin({
                PLUTON_PATH: JSON.stringify(pluton_path)
            })
        ]
    };
})
```

### With regular webpack
```js
// webpack.config.js
let pluton_path = __dirname + '/resources/assets/js/parts';

module.exports = {
    // ...
    plugins: [
        new webpack.DefinePlugin({
            PLUTON_PATH: JSON.stringify(pluton_path)
        })
    ]
};
```



## Methods

Pluton comes with a few methods that will be very useful when building dynamic applications.

### Setup

The original page's setup is done automatically, but sometimes it is necessary to initialize new components manually. This can be done by calling the `setup` method. Just provide a _root_ element including all the new nodes and Pluton will initialize all the contained components:

```js
let pluton = new Pluton(),
    temp = document.createElement('DIV');

temp.innerHTML = '<div class="some-component"><h1>Some fresh HTML</h1><p>Hello world.</p></div>';

pluton.setup(temp);
```

### Call

If you need to call a method on one of your classes from wherever you defined your Pluton instance, you can use the `call` method. It will call it on every instance of that class.

It works like this: 
```js
let pluton = new Pluton();
pluton.call('.counter', 'reset'); // Without parameter
pluton.call('.counter', 'increment', 5); // With parameter
```

### Resetting pluton

If you are doing page transitions with tools like barba.js, you will have to clear the previous pluton class instances and rerun the setup after the new page has been added to the DOM. 

```js
barba.hooks.afterLeave(() => pluton.clear()); // Remove instances once the leave transition is over
barba.hooks.after({ next } => pluton.setup(next.container)); // Re-run pluton on the new page
```


## Made with ❤️ for open source
At [whitecube](https://www.whitecube.be) we use a lot of open source software as part of our daily work.  
So when we have an opportunity to give something back, we're super excited!  
We hope you will enjoy this small contribution from us and would love to [hear from you](mailto:hello@whitecube.be) if you find it useful in your projects.
