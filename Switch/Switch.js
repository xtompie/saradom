const Switch = (() => {
    const apply = (space, tags) => {
        tags = Array.isArray(tags) ? tags : String(tags).split(/\s+/).filter(Boolean);
        const attr = space.getAttribute('switch-config-tag') || 'switch-tag';
        space.querySelectorAll(`[${attr}]`).forEach(el => {
            const on = el.getAttribute(attr).split(/\s+/).some(t => tags.includes(t));
            const change = el.getAttribute('switch-onchange');
            if (change) (function () { return eval(change); }).call(el)(on);
            else el.style.display = on ? '' : 'none';
        });
        space.setAttribute('switch-state', tags.join(' '));
    };

    const To = (ctx, space, tags) => apply(ctx.closest(space), tags);

    const Toggle = (ctx, space, when, then, otherwise) => {
        space = ctx.closest(space);
        const active = (space.getAttribute('switch-state') || '').split(/\s+/);
        apply(space, active.includes(when) ? then : otherwise);
    };

    return { To, Toggle };
})();
