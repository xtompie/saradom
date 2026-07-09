const Vld = (() => {
    const up = (el, sel) => el.matches(sel) ? el : el.closest(sel);

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

    const Form = async (root, rules, data, tpl, attr = 'vld-error') => {
        const errors = await Validate(rules, data);
        const template = tpl ?? root.querySelector('template[vld-error-tpl]')?.innerHTML ?? defaultTpl;

        root.querySelectorAll(`[${attr}]`).forEach(el => { el.innerHTML = ''; });

        errors.forEach(e => {
            const el = root.querySelector(`[${attr}="${e.path ?? ''}"]`);
            el?.insertAdjacentHTML('beforeend', template.replace(/\{(\w+)\}/g, (_, k) => escapeHtml(e[k] ?? '')));
        });

        return errors;
    };

    const Submit = async (ctx, event, rules, data) => {
        event?.preventDefault();
        const space = up(ctx, '[vld-space]');
        return Form(space, rules ?? space.vldRules, data ?? Object.fromEntries(new FormData(space)));
    };

    return { Rule, Validate, Form, Submit };
})();
