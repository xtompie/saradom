const Todo = (() => {
    const Add = (ctx) => {
        const space = ctx.up('[todo-space]');
        const add = space.one('[todo-add]');
        space.one('[todo-items]').vappend([{ ...add.val(), status: 'todo'}]);
        add.val({ text: '' });
        Output(space);
    };
    const Check = (ctx) => {
        ctx.up('[todo-item]').val(d => ({ ...d, status: d.status === 'done' ? 'todo' : 'done' }));
        Output(ctx.up('[todo-space]'));
    };
    const Remove = (ctx) => {
        const space = ctx.up('[todo-space]');
        ctx.up('[todo-item]').remove();
        Output(space);
    };
    const Output = (space) => {
        space.one('[todo-output]').textContent = JSON.stringify(space.one('[todo-items]').varr(), null, 4);
    }
    return {
        Add,
        Check,
        Remove,
    }
})();