(() => {
    class InitElement extends HTMLElement {
        connectedCallback() {
            if (this._ran) {
                return;
            }
            this._ran = true;
            const parent = this.parentElement;
            const code = this.getAttribute('run');
            if (parent && code) {
                (function () { return eval(code); }).call(parent)(parent);
            }
        }
    }
    customElements.define('s-init', InitElement);
})();
