(() => {
    const Group = (el) => {
        const name = el.getAttribute('group');
        if (!name) {
            return undefined;
        }
        const sel = el.getAttribute('boundary');
        return {
            name,
            put: sel
                ? (to, from) => to.el.closest(sel) === from.el.closest(sel)
                : true,
        };
    };
    class SortableElement extends HTMLElement {
        connectedCallback() {
            if (this._sortable || typeof Sortable === 'undefined') {
                return;
            }
            this._sortable = new Sortable(this, {
                group: Group(this),
                animation: Number(this.getAttribute('animation')) || 150,
                handle: this.getAttribute('handle') || undefined,
                onEnd: (event) => {
                    const key = this.getAttribute('sort-store');
                    if (key) {
                        const order = Array.from(this.querySelectorAll('[sort-item]')).map((el) => el.getAttribute('sort-item'));
                        localStorage.setItem(key, JSON.stringify(order));
                    }
                    const code = this.getAttribute('onsort');
                    if (code) new Function('event', code).call(this, event);
                },
            });
        }
        restore() {
            const key = this.getAttribute('sort-store');
            if (!key) {
                return;
            }
            JSON.parse(localStorage.getItem(key) || '[]').forEach((name) => {
                const item = this.querySelector('[sort-item="' + name + '"]');
                if (item) {
                    this.appendChild(item);
                }
            });
        }
        disconnectedCallback() {
            if (this._sortable) {
                this._sortable.destroy();
                this._sortable = null;
            }
        }
    }
    customElements.define('s-sortable', SortableElement);
})();
