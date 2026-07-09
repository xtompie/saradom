const Vld = (() => {
    const Rule = {
        required: (input) => (input !== undefined && input !== null && input !== '') ? null : 'This field is required',
        email: (input) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input) ? null : 'Not a valid email address',
        min: (input, arg) => String(input ?? '').length >= Number(arg) ? null : `Must be at least ${arg} characters`,
        same: (input, arg) => input[arg[0]] === input[arg[1]] ? null : 'Must match',
    };

    const resolveRule = (def) => {
        if (typeof def === 'string') return { fn: Rule[def], arg: undefined, key: def, msg: undefined };
        if (typeof def === 'function') return { fn: def, arg: undefined, key: undefined, msg: undefined };
        const fn = typeof def.rule === 'string' ? Rule[def.rule] : def.rule;
        const key = def.key ?? (typeof def.rule === 'string' ? def.rule : undefined);
        return { fn, arg: def.arg, key, msg: def.msg };
    };

    const checkErrors = async (check, data) => {
        const input = check.path == null ? data : data[check.path];
        for (const def of check.rules) {
            const { fn, arg, key, msg } = resolveRule(def);
            const result = await fn(input, arg);
            if (result !== null) {
                return [{ key, message: msg ?? result, path: check.errorPath ?? check.path ?? null }];
            }
        }
        return [];
    };

    const Validate = async (rules, data) => {
        for (const checks of rules) {
            const errors = (await Promise.all(checks.map(check => checkErrors(check, data)))).flat();
            if (errors.length) return errors;
        }
        return [];
    };

    const escapeHtml = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const defaultTpl = '<div class="vld-error">{message}</div>';

    const Clear = (root, attr = 'vld-error') => root.querySelectorAll(`[${attr}]`).forEach(el => { el.innerHTML = ''; });

    const Form = async (root, rules, data, tpl, attr = 'vld-error') => {
        const errors = await Validate(rules, data);
        const template = tpl ?? root.querySelector('template[vld-error-tpl]')?.innerHTML ?? defaultTpl;

        Clear(root, attr);

        errors.forEach(e => {
            const el = root.querySelector(`[${attr}="${CSS.escape(e.path ?? '')}"]`);
            el?.insertAdjacentHTML('beforeend', template.replace(/\{(\w+)\}/g, (_, k) => escapeHtml(e[k] ?? '')));
        });

        return errors;
    };

    const formEl = (space) => space.matches('[vld-form]') ? space : space.querySelector('[vld-form]');

    const formData = (form) => {
        const data = {};
        for (const [name, value] of new FormData(form)) {
            data[name] = name in data ? [].concat(data[name], value) : value;
        }
        return data;
    };

    const Submit = async (ctx, event, rules, data) => {
        event?.preventDefault();
        const space = ctx.closest('[vld-space]');
        return Form(space, rules, data ?? formData(formEl(space)));
    };

    return { Rule, Validate, Clear, Form, Submit };
})();
