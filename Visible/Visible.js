const Visible = (() => {
    const up = (el, sel) => el.matches(sel) ? el : el.closest(sel);

    const Visible = (ctx, tags) => {
        const space = up(ctx, '[visible-space]');
        const lane = space.getAttribute('visible-lane');
        const selector = lane ? `[visible-tag][visible-lane="${lane}"]` : '[visible-tag]';
        space.querySelectorAll(selector).forEach(el => {
            el.style.display = tags.includes(el.getAttribute('visible-tag')) ? '' : 'none';
        });
        space.setAttribute('visible-state', tags.join(' '));
    };

    const Toggle = (ctx, when, then, otherwise) => {
        const space = up(ctx, '[visible-space]');
        Visible(space, space.getAttribute('visible-state').split(' ').includes(when) ? then : otherwise);
    };

    return { Visible, Toggle };
})();
