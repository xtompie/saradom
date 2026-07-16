const Kanban = (() => {
    const rules = [
        [
            { path: 'title', rules: [{ min: 2 }] },
            { path: 'color', rules: [] },
        ],
    ];

    const Space = (ctx) => ctx.up('[kanban-space]');
    const Modal = (ctx) => Space(ctx).one('[kanban-modal]');
    const Form  = (ctx) => Space(ctx).one('[kanban-form]');

    const Close = (ctx) => {
        const modal = Modal(ctx);
        modal.vpatch({ hidden: true });
        Vld.Form.Clear(modal);
    };

    const Add = (ctx) => {
        const cards = ctx.up('[kanban-column]').one('[kanban-cards]');
        Modal(ctx).vset({ anchor: cards, mode: 'add', hidden: false, focus: true });
        Form(ctx).vset({ title: '' });
    };

    const Edit = (ctx) => {
        const card = ctx.up('[kanban-card]');
        Modal(ctx).vset({ anchor: card, mode: 'edit', hidden: false, focus: true });
        Form(ctx).vset(card.vget());
    };

    const Save = async (ctx) => {
        const modal = Modal(ctx);
        const { anchor, mode } = modal.vget();
        const value = Form(ctx).vget();
        if (!(await Vld.Form.Validate(modal, rules, value))) return;
        mode === 'edit' ? anchor.vset(value) : anchor.vappend([value]);
        Close(ctx);
    };

    const Delete = (ctx) => {
        const { anchor, mode } = Modal(ctx).vget();
        if (mode === 'edit' && confirm('Delete this card?')) {
            anchor.remove();
            Close(ctx);
        }
    };

    const Init = (ctx, input) => Space(ctx).vset(input);

    return { Init, Add, Edit, Save, Delete, Close };
})();
