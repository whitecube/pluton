export default class Pluton {

    constructor() {
        this.classes = this.importAll();
        this.instances = {};
        this.setup();
    }

    clear() {
        this.instances = {};
    }

    setup(root) {
        for (var className in this.classes) {
            this.setupComponent(className, this.classes[className], root);
        }
    }

    setupComponent(className, component, root) {
        if (!component.selector) return;
        [].forEach.call((root||document).querySelectorAll(component.selector), (el) => {
            if (!this.instances[className]) this.instances[className] = [];
            this.instances[className].push(new component(el));
        });
    }

    call(className, fn, parameters) {
        if (!this.instances[className]) return;
        for (var i = this.instances[className].length - 1; i >= 0; i--) {
            this.instances[className][i][fn](parameters);
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
