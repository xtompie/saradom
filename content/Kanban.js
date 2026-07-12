const Kanban = (() => {
    const rules = [
        [{ path: 'title', rules: [{ min: 2 }] }],
    ];

    const Modal = (ctx) => ctx.up('[kanban-space]').one('[kanban-modal]');

    const Select = (ctx, value) =>
        ctx.all('[kanban-option]').each(o => o.flag('kanban-selected', o.attr('kanban-option') === value));

    const Open = (ctx, anchor, data) => {
        const m = Modal(ctx);
        m._kanban = anchor;
        m.one('[kanban-form]').vset(data);
        m.attr('kanban-modal-mode', anchor.matches('[kanban-card]') ? 'edit' : 'add').flag('hidden', false);
        m.one('[kanban-input]').focus();
    };

    const Close = (ctx) => {
        const m = Modal(ctx);
        m.flag('hidden', true);
        Vld.Form.Clear(m);
    };

    const Add = (ctx) => Open(ctx, ctx.up('[kanban-column]').one('[kanban-cards]'),
        { title: '', color: Modal(ctx).one('[kanban-option]').attr('kanban-option') });

    const Edit = (ctx) => {
        const card = ctx.up('[kanban-card]');
        Open(ctx, card, card.vget());
    };

    const Save = async (ctx) => {
        const m = Modal(ctx);
        const data = m.one('[kanban-form]').vget();
        if (!(await Vld.Form.Validate(m, rules, data))) return;
        if (m._kanban.matches('[kanban-card]')) {
            m._kanban.vset(data);
        } else {
            m._kanban.vappend([data]);
        }
        Close(ctx);
    };

    const Delete = (ctx) => {
        const m = Modal(ctx);
        if (m._kanban.matches('[kanban-card]') && confirm('Delete this card?')) {
            m._kanban.remove();
            Close(ctx);
        }
    };

    const Init = (ctx, input) =>
        ctx.up('[kanban-space]')
            .vset(input)
            .compute('kanban-onchange')
            .all('[kanban-drag]').each(i => new Sortable(i, { group: 'kanban', animation: 150 }));

    return { Init, Add, Edit, Save, Delete, Close, Select };
})();
