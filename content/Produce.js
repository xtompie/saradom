const Produce = (() => {
    const Init = (ctx, items) => {
        const space = ctx.up('[produce-space]');
        space.one('[produce-list]')
            .vappend(items.map(p => ({ ...p, match: `${p.name} ${p.category}` })), space.one('[produce-row-tpl]'));
    };

    return { Init };
})();
