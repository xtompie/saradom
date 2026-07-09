const Filter = (() => {
    const up = (el, sel) => el.matches(sel) ? el : el.closest(sel);

    const Filter = (ctx) => {
        const space = up(ctx, '[filter-space]');
        const lane = space.getAttribute('filter-lane');
        const query = space.querySelector('[filter-query]').value.trim().toLowerCase();
        const selector = lane ? `[filter-item][filter-lane="${lane}"]` : '[filter-item]';
        space.querySelectorAll(selector).forEach(el => {
            el.style.display = el.getAttribute('filter-item').toLowerCase().includes(query) ? '' : 'none';
        });
    };

    return { Filter };
})();
