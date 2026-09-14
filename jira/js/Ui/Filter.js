App.Ui.Filter = (() => {
    const Filter = (ctx) => {
        const space = ctx.closest('[ui-filter-space]');
        const lane = space.getAttribute('ui-filter-lane');
        const query = space.querySelector('[ui-filter-query]').value.trim().toLowerCase();
        const selector = lane ? `[ui-filter-item][ui-filter-lane="${lane}"]` : '[ui-filter-item]';
        space.querySelectorAll(selector).forEach(el => {
            el.style.display = el.getAttribute('ui-filter-item').toLowerCase().includes(query) ? '' : 'none';
        });
    };

    return { Filter };
})();
