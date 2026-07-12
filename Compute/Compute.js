const Compute = (() => {
    const Debounce = (fn, ms) => {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), ms);
        };
    };
    const Run = (el, name) => {
        const code = el.getAttribute(name);
        return (function () {
            return eval(code).call(el);
        }).bind(el)();
    };
    const All = (root, name) => {
        root.querySelectorAll(`[${name}]`).forEach(el => Run(el, name));
    };
    const Init = (root, name, opts = {}) => {
        const store = root._compute ??= {};
        if (store[name]) {
            return;
        }
        const config = { childList: true, subtree: opts.subtree !== false };
        let observer;
        const run = () => {
            observer.disconnect();
            All(root, name);
            observer.observe(root, config);
        };
        const fire = opts.debounce ? Debounce(run, opts.debounce) : run;
        observer = new MutationObserver(fire);
        store[name] = observer;
        run();
    };
    const Stop = (root, name) => {
        const store = root._compute;
        if (!store || !store[name]) {
            return;
        }
        store[name].disconnect();
        delete store[name];
    };
    return { Init, Stop };
})();
HTMLElement.prototype.compute = function (name, opts) {
    Compute.Init(this, name, opts);
    return this;
};
HTMLElement.prototype.uncompute = function (name) {
    Compute.Stop(this, name);
    return this;
};
