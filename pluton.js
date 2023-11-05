export default class Pluton {

    constructor() {
        this.instances = {};

        this.loadModules().then(classes => {
            this.classes = classes;
            this.setup();
        });
    }

    async loadModules() {
        const modules = import.meta.glob('../../../resources/js/parts/*.js');
        const promises = [];
        const paths = Object.keys(modules);

        for (let index = 0; index < paths.length; index++) {
            promises.push(modules[paths[index]]());
        }

        const loaded = await Promise.all(promises);

        return new Promise(resolve => {
            const classes = {};

            loaded.forEach(mod => {
                const code = mod.default;
                classes[code.selector] = code;
            });

            resolve(classes);
        });
    }

    setup(root) {
        for (var className in this.classes) {
            this.setupComponent(className, this.classes[className], root);
        }
    }

    setupComponent(className, component, root) {
        if (! component.selector) {
            return;
        }

        [].forEach.call((root||document).querySelectorAll(component.selector), (el) => {
            if (! this.instances[className]) {
                this.instances[className] = [];
            }

            this.instances[className].push(new component(el));
        });
    }
}