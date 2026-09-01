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
                    const key = this.getAttribute('store');
                    if (key) {
                        const order = Array.from(this.querySelectorAll('[sort-item]')).map((el) => el.getAttribute('sort-item'));
                        localStorage.setItem(key, JSON.stringify(order));
                    }
                    const code = this.getAttribute('onsort');
                    if (code) new Function('event', code).call(this, event);
                },
            });
            this.restore();
            if (this.getAttribute('store') && document.readyState === 'loading') {
                // During initial parsing the children are still streaming in:
                // keep restoring as they arrive, stop when the document is done.
                this._observer = new MutationObserver(() => this.restore());
                this._observer.observe(this, { childList: true });
                document.addEventListener('DOMContentLoaded', () => {
                    if (this._observer) {
                        this._observer.disconnect();
                        this._observer = null;
                    }
                }, { once: true });
            }
        }
        restore() {
            const key = this.getAttribute('store');
            if (!key) {
                return;
            }
            const order = JSON.parse(localStorage.getItem(key) || '[]');
            const items = order.map((name) => this.querySelector('[sort-item="' + name + '"]')).filter(Boolean);
            const current = Array.from(this.querySelectorAll('[sort-item]')).filter((el) => items.includes(el));
            if (items.every((el, i) => el === current[i])) {
                return;
            }
            items.forEach((el) => this.appendChild(el));
        }
        disconnectedCallback() {
            if (this._observer) {
                this._observer.disconnect();
                this._observer = null;
            }
            if (this._sortable) {
                this._sortable.destroy();
                this._sortable = null;
            }
        }
    }
    customElements.define('s-sortable', SortableElement);
})();
