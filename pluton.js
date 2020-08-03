export default class Pluton {

    constructor() {
        this.classes = this.importAll();
        this.setup();
    }

    setup(root) {
        for (var className in this.classes) {
            this.setupComponent(className, this.classes[className], root);
        }
    }

    setupComponent(className, component, root) {
        if (!component.selector) return;
        [].forEach.call((root||document).querySelectorAll(component.selector), (el) => {
            if (!this[className]) this[className] = [];
            this[className].push(new component(el));
        });
    }

    call(className, fn, parameters) {
        if (!this[className]) return;
        for (var i = this[className].length - 1; i >= 0; i--) {
            this[className][i][fn](parameters);
        }
    }

    importAll() {
        var context = require.context(PLUTON_PATH, true, /\.js$/);
        var obj = {};
        context.keys().forEach(key => {
            let code = context(key);
            obj[code.default.selector] = code.default;
        });
        return obj;
    }
}