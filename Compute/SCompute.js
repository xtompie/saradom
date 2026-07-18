(() => {
    const Debounce = (fn, ms) => {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), ms);
        };
    };
    const Run = (el) => {
        const code = el.getAttribute('run');
        if (!code) {
            return;
        }
        return (function () {
            return eval(code).call(el);
        }).bind(el)();
    };
    const Guard = (el) => {
        const code = el.getAttribute('guard');
        if (!code) {
            return true;
        }
        return (function () {
            return eval(code).call(el);
        }).bind(el)();
    };
    class ComputeElement extends HTMLElement {
        connectedCallback() {
            if (this._observer) {
                return;
            }
            const config = { childList: true, subtree: !this.hasAttribute('shallow') };
            const ms = Number(this.getAttribute('debounce')) || 0;
            const fire = () => {
                this._observer.disconnect();
                if (Guard(this)) Run(this);
                this._observer.observe(this, config);
            };
            this._observer = new MutationObserver(ms ? Debounce(fire, ms) : fire);
            const start = () => {
                Run(this);
                this._observer.observe(this, config);
            };
            document.readyState === 'loading'
                ? document.addEventListener('DOMContentLoaded', start, { once: true })
                : start();
        }
        disconnectedCallback() {
            if (this._observer) {
                this._observer.disconnect();
                this._observer = null;
            }
        }
    }
    customElements.define('s-compute', ComputeElement);
})();
