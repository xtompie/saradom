const Formsend = (() => {
    const form = (ctx) => (ctx.matches('form') ? ctx : ctx.closest('form'));

    const scalar = (f, name, value) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value === null || value === undefined ? '' : value;
        f.appendChild(input);
    };

    // An object flattens to PHP-style bracket names: name[key], name[key][sub], ...
    const val = (f, name, value) => {
        if (value !== null && typeof value === 'object') {
            Object.entries(value).forEach(([k, v]) => val(f, `${name}[${k}]`, v));
        } else {
            scalar(f, name, value);
        }
    };

    // The next free index of an array field, read from the form's current data.
    const next = (f, name) => {
        let max = -1;
        for (const [key] of new FormData(f)) {
            if (key.startsWith(name + '[')) {
                const n = parseInt(key.slice(name.length + 1), 10);
                if (!isNaN(n)) max = Math.max(max, n);
            }
        }
        return max + 1;
    };

    const Set = (ctx, name, value) => {
        const f = form(ctx);
        val(f, name, value);
        f.submit();
    };

    const Add = (ctx, name, values) => {
        const f = form(ctx);
        values.forEach((value) => val(f, `${name}[${next(f, name)}]`, value));
        f.submit();
    };

    const Send = (ctx) => form(ctx).submit();

    return { Set, Add, Send };
})();
