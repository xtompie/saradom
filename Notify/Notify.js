const Notify = (() => {
    const Run = (el, name, data) =>
        (function () { return eval(el.getAttribute(name)).call(el, data); }).bind(el)();

    const Up = (el, name, data, stop) => {
        for (let node = el.parentElement; node; node = node.parentElement) {
            if (stop && node.matches(stop)) return;
            if (node.hasAttribute(name)) Run(node, name, data);
        }
    };

    const Down = (el, name, data, stop) => {
        Array.from(el.children).forEach(node => {
            if (stop && node.matches(stop)) return;
            if (node.hasAttribute(name)) Run(node, name, data);
            Down(node, name, data, stop);
        });
    };

    const All = (name, data) => {
        document.querySelectorAll(`[${name}]`).forEach(node => Run(node, name, data));
    };

    return { Up, Down, All };
})();

HTMLElement.prototype.nup = function (name, data = null, stop = null) { Notify.Up(this, name, data, stop); return this; };
HTMLElement.prototype.ndown = function (name, data = null, stop = null) { Notify.Down(this, name, data, stop); return this; };
HTMLElement.prototype.nall = function (name, data = null) { Notify.All(name, data); return this; };
