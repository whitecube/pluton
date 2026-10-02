export default class Pluton {

    constructor(modules) {
        this.modules = modules;
        this.instances = {};

        this.loadModules().then(classes => {
            this.classes = classes;
            this.setup();
        });
    }

    async loadModules() {
        // IMPORTANT: `{ eager: true }` must stay a literal `true`. Vite's production
        // glob transform (Rolldown) only recognises static literals and silently
        // falls back to lazy imports for anything else (e.g. a minifier's `!0`).
        // This file is therefore shipped unminified on purpose.
        const modules = this.modules ?? import.meta.glob('/resources/js/parts/*.js', { eager: true });

        const entries = await Promise.all(
            Object.entries(modules).map(async ([path, mod]) => [
                path,
                typeof mod === 'function' ? await mod() : mod,
            ])
        );

        const classes = {};

        for (const [path, mod] of entries) {
            const component = mod?.default;
 
            if (!component?.selector) {
                console.warn(`[Pluton] "${path}" has no default export with a static "selector" and was skipped.`);
                continue;
            }
 
            classes[component.selector] = component;
        }

        return classes;
    }

    setup(root) {
        for (var className in this.classes) {
            this.setupComponent(className, this.classes[className], root);
        }
    }

    setupComponent(className, component, root) {
        if (!component.selector) {
            return;
        }

        (root || document).querySelectorAll(component.selector).forEach(el => {
            if (!this.instances[className]) {
                this.instances[className] = [];
            }
 
            this.instances[className].push(new component(el));
        });
    }

    call(className, fn, parameters) {
        if (!this.instances[className]) return;
        
        for (var i = this.instances[className].length - 1; i >= 0; i--) {
            this.instances[className][i][fn](parameters);
        }
    }
}