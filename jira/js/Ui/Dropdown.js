App.Ui.Dropdown = (() => {
    const menu = (ctx) => ctx.closest('[ui-dropdown-space]').querySelector('[ui-dropdown-menu]');

    const fire = (m) => {
        const space = m.closest('[ui-dropdown-space]');
        const code = space.getAttribute(m.matches(':popover-open') ? 'ui-dropdown-onopen' : 'ui-dropdown-onclose');
        if (!code) {
            return;
        }
        const value = new Function('return (' + code + ')').call(space);
        if (typeof value === 'function') {
            value.call(space);
        }
    };

    const close = (m) => {
        m.hidePopover();
        fire(m);
    };

    const open = (m) => {
        m.setAttribute('tabindex', '-1');
        m.showPopover();
        fire(m);
    };

    const Toggle = (btn) => {
        const m = menu(btn);
        m.matches(':popover-open') ? close(m) : open(m);
    };

    const Open = (btn) => {
        const m = menu(btn);
        if (!m.matches(':popover-open')) {
            open(m);
        }
    };

    const Close = (ctx) => {
        const m = menu(ctx);
        if (m.matches(':popover-open')) {
            close(m);
        }
    };

    const unpinned = () => Array.from(document.querySelectorAll('[ui-dropdown-menu]:popover-open'))
        .filter(m => !m.hasAttribute('ui-dropdown-pin'));

    const Down = (e) => {
        unpinned().forEach(m => {
            if (!m.closest('[ui-dropdown-space]').contains(e.target)) {
                close(m);
            }
        });
    };

    const Out = (e) => {
        if (!e.relatedTarget) {
            return;
        }
        unpinned().forEach(m => {
            if (!m.closest('[ui-dropdown-space]').contains(e.relatedTarget)) {
                close(m);
            }
        });
    };

    const Esc = (e) => {
        if (e.key === 'Escape') {
            unpinned().forEach(close);
        }
    };

    return { Toggle, Open, Close, Down, Out, Esc };
})();
