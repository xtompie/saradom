(() => {
    class ResizerElement extends HTMLElement {
        connectedCallback() {
            const scope = this.closest('[resizer-space]');
            if (!scope) {
                return;
            }
            const num = (v, fallback) => (v !== null && Number.isFinite(Number(v)) ? Number(v) : fallback);
            const varName = this.getAttribute('var') || '--panel-w';
            const store = this.getAttribute('store');
            const min = num(this.getAttribute('min'), 240);
            const max = num(this.getAttribute('max'), 640);
            const clamp = w => Math.max(min, Math.min(max, w));
            const read = () => {
                const v = parseFloat(getComputedStyle(scope).getPropertyValue(varName));
                return Number.isFinite(v) ? v : 316;
            };

            const saved = store && Number(localStorage.getItem(store));
            if (Number.isFinite(saved) && saved) {
                scope.style.setProperty(varName, clamp(saved) + 'px');
            }
            this.style.touchAction = 'none';
            this.setAttribute('role', 'separator');
            this.setAttribute('aria-orientation', 'vertical');

            this.onpointerdown = (e) => {
                e.preventDefault();
                this.setPointerCapture(e.pointerId);
                this.setAttribute('resizing', '');
                const startX = e.clientX;
                const startW = read();
                const move = (ev) => {
                    scope.style.setProperty(varName, clamp(startW + (startX - ev.clientX)) + 'px');
                };
                const up = () => {
                    this.removeAttribute('resizing');
                    this.removeEventListener('pointermove', move);
                    this.removeEventListener('pointerup', up);
                    this.removeEventListener('pointercancel', up);
                    if (store) {
                        localStorage.setItem(store, String(Math.round(read())));
                    }
                };
                this.addEventListener('pointermove', move);
                this.addEventListener('pointerup', up);
                this.addEventListener('pointercancel', up);
            };
        }
    }
    customElements.define('s-resizer', ResizerElement);
})();
