(() => {
    // A declarative wrapper over SortableJS. The element is the drag container; its
    // children are the draggable items. It wires a Sortable when it connects and
    // destroys it when it leaves the DOM, so a list added later drags without a manual
    // `new Sortable` call.
    //
    // Attributes:
    //   group     — shared group name; lists with the same name exchange items.
    //   boundary  — a selector. Items only move between lists that share the same
    //               nearest ancestor matching it. Two boards under separate
    //               `[kanban-space]` roots stay isolated with one group name, no
    //               unique names to coordinate. Left out, the group name alone rules.
    //   animation — SortableJS animation in ms (default 150).
    //   handle    — a selector for the drag handle, passed straight through.
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
