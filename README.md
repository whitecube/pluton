# pluton
A javascript dispatcher that links JS classes to dom elements.  
It is the main part of our JS workflow at [whitecube](https://www.whitecube.be).

## Requirements

Pluton relies on [Vite](https://vite.dev)'s `import.meta.glob` to auto-load your files, so it must be used in a project bundled with Vite (5 or later).

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

The only requirement is that they must be the file's **default export** and have a static `selector` property (or getter) returning a css-like query-selector string that will be used to map this class to dom elements. Files that don't meet this requirement are skipped with a console warning.

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

By default, Pluton loads every file matching `/resources/js/parts/*.js`. The leading `/` means this path starts at your project's root (Vite's `root` option).

To load your files from somewhere else, pass the result of your own `import.meta.glob` call to the constructor. Relative paths are resolved from the file where you write the glob:

```js
// All files are bundled together with your main script
new Pluton(import.meta.glob('./my-js-dir/my-subdir/*.js', { eager: true }));

// Each file is split into its own chunk and loaded on demand
new Pluton(import.meta.glob('./my-js-dir/my-subdir/*.js'));
```

> Vite resolves `import.meta.glob` at build time, so its arguments must be written as plain literals: a variable or a computed path will not work.

(For more infos about `import.meta.glob` refer to [Vite's documentation](https://vite.dev/guide/features.html#glob-import)).

## Methods

Pluton comes with a few methods that will be very useful when building dynamic applications.

Your files are loaded asynchronously, so the methods below should only be used once Pluton is ready. Most of the time they are called later on (after a user action, a page transition...) and this is already the case. If you need them right after creating the instance, wait for the `ready` promise first:

```js
let pluton = new Pluton();

await pluton.ready;
```

### Setup

The original page's setup is done automatically, but sometimes it is necessary to initialize new components manually. This can be done by calling the `setup` method. Just provide a _root_ element including all the new nodes and Pluton will initialize all the contained components:

```js
let temp = document.createElement('DIV');

temp.innerHTML = '<div class="some-component"><h1>Some fresh HTML</h1><p>Hello world.</p></div>';

pluton.setup(temp);
```

### Call

If you need to call a method on one of your classes from wherever you defined your Pluton instance, you can use the `call` method. It will call it on every instance of that class.

It works like this: 
```js
pluton.call('.counter', 'reset'); // Without parameter
pluton.call('.counter', 'increment', 5); // With parameter
```

### Clear

If you are doing page transitions with tools like barba.js, you will have to clear the previous pluton class instances and rerun the setup after the new page has been added to the DOM. 

```js
barba.hooks.afterLeave(() => pluton.clear()); // Remove instances once the leave transition is over
barba.hooks.after(({ next }) => pluton.setup(next.container)); // Re-run pluton on the new page
```


## Made with ❤️ for open source
At [whitecube](https://www.whitecube.be) we use a lot of open source software as part of our daily work.  
So when we have an opportunity to give something back, we're super excited!  
We hope you will enjoy this small contribution from us and would love to [hear from you](mailto:hello@whitecube.be) if you find it useful in your projects.
