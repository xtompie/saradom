const Visible = (() => {
    const Visible = (ctx, tags) => {
        const space = ctx.closest('[visible-space]');
        const lane = space.getAttribute('visible-lane');
        const selector = lane ? `[visible-tag][visible-lane="${lane}"]` : '[visible-tag]';
        space.querySelectorAll(selector).forEach(el => {
            el.style.display = tags.includes(el.getAttribute('visible-tag')) ? '' : 'none';
        });
        space.setAttribute('visible-state', tags.join(' '));
    };

    const Toggle = (ctx, when, then, otherwise) => {
        const space = ctx.closest('[visible-space]');
        Visible(space, space.getAttribute('visible-state').split(' ').includes(when) ? then : otherwise);
    };

    return { Visible, Toggle };
})();
