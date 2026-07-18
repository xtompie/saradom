const Switch = (() => {
    // Tag elements inside a switch space; one call decides each one's on/off from
    // the active tags and applies an effect. By default it shows the on ones and
    // hides the rest, and writes the active set to `switch-state`.
    //
    // The space is always given as a selector — the second argument — resolved from
    // `ctx` with `closest`. There is no implicit space, so nested spaces never pick
    // the wrong one: you name the target space.
    //
    // Config on the space element (the one the selector matches):
    //   switch-config-tag — the attribute that holds a target's tag(s). Default `switch-tag`.
    //   switch-state      — the active set, space-separated. Written on each call, read by Toggle.
    //
    // Config on each tagged element:
    //   switch-onchange — the effect, `(on) => ...` with `this` the element. Each target
    //                     decides its own. Left out, the target is shown when on and hidden
    //                     when off.
    //
    // A target is on when any of its space-separated tags is in the active set (OR).
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
