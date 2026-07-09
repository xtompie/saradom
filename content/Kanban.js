const Kanban = (() => {
    // Title validation, ordered: an empty title reports "required" and stops there; a
    // one-character title gets past that and reports the length rule. Just a plain value
    // handed to Vld.Form — Vld knows nothing about where it's kept.
    const rules = [
        [{ path: 'title', rules: ['required', { rule: 'min', arg: 2 }] }],
    ];

    // A column recounts itself: it holds as many cards as it holds. Every place that
    // changes a column's cards owns that column, so it recounts by calling Count directly.
    const Count = (col) => col.one('[kanban-count]').vset({ count: col.all('[kanban-card]').length });

    // Make a card list draggable, from the list's own val-set as it renders. The _sortable
    // guard keeps it idempotent: re-rendering never wires a second Sortable onto the list.
    // A drag moves a card between columns, so on sort the list recounts its own column.
    const Drag = (list) => {
        if (list._sortable) return;
        list._sortable = new Sortable(list, { group: 'kanban', animation: 150, onSort: () => Count(list.up('[kanban-column]')) });
    };

    // The swatches are static markup (it's a demo), so the picker is only selection: flag
    // the swatch whose colour matches — one step behind both a click and loading for edit.
    const Pick = (colors, color) => colors.all('[kanban-swatch]').each(s => s.flag('kanban-selected', s.dataset.color === color));

    // Read the selected colour back, so the form's vget returns { title, colour } as one.
    const Picked = (colors) => ({ color: colors.one('[kanban-selected]')?.dataset.color ?? null });

    // Open the modal filled with data, in the given mode, focused. The mode is an attribute
    // because CSS reads it (it hides Delete while adding).
    const Open = (modal, mode, data) => {
        const dialog = modal.one('[kanban-dialog]');
        dialog.vset(data);
        Vld.Clear(dialog);
        modal.attr('kanban-modal-mode', mode).flag('hidden', false);
        modal.one('[kanban-input]').focus();
    };

    // Add: remember the target column on the modal, open blank with the first colour. The
    // working reference lives on the modal element, so every board instance keeps its own.
    const Add = (ctx) => {
        const board = ctx.up('[kanban-space]');
        const modal = board.one('[kanban-modal]');
        modal._card = null;
        modal._target = ctx.up('[kanban-column]');
        Open(modal, 'add', { title: '', color: board.one('[kanban-swatch]').dataset.color });
    };

    // Edit: remember the card on the modal, open filled straight from it.
    const Edit = (ctx) => {
        const modal = ctx.up('[kanban-space]').one('[kanban-modal]');
        const card = ctx.up('[kanban-card]');
        modal._card = card;
        modal._target = null;
        Open(modal, 'edit', card.vget());
    };

    // Save: read the form once, validate it, and bail on any error (Vld.Form has already
    // rendered the message under the field). Otherwise write it into the remembered card,
    // or append a new one to the remembered column and recount it. Editing changes nothing
    // countable.
    const Save = async (ctx) => {
        const modal = ctx.up('[kanban-space]').one('[kanban-modal]');
        const dialog = modal.one('[kanban-dialog]');
        const data = dialog.vget();
        if ((await Vld.Form(dialog, rules, data)).length) return;
        if (modal.attr('kanban-modal-mode') === 'edit') {
            modal._card.vset(data);
        } else {
            modal._target.one('[kanban-cards]').vappend([data]);
            Count(modal._target);
        }
        Close(ctx);
    };

    const Delete = (ctx) => {
        const modal = ctx.up('[kanban-space]').one('[kanban-modal]');
        const card = modal._card;
        if (card && confirm('Delete this card?')) {
            const col = card.up('[kanban-column]');
            card.remove();
            Count(col);
            Close(ctx);
        }
    };

    const Close = (ctx) => {
        const modal = ctx.up('[kanban-space]').one('[kanban-modal]');
        modal.flag('hidden', true);
        modal._card = null;
        modal._target = null;
    };

    // The whole board is one value. Writing it lets val fan out: data renders the columns,
    // and the column template nests an Arr over cards (whose val-set wires the drag). The
    // JavaScript names no template — the HTML does, in val-tpl. Then each column counts itself.
    const Init = (ctx, input) => {
        const board = ctx.up('[kanban-space]');
        board.vset(input);
        board.all('[kanban-column]').each(Count);
    };

    return {
        Init,
        Column:  { Count, Drag },
        Palette: { Pick, Picked },
        Modal:   { Add, Edit, Save, Delete, Close },
    };
})();
