const Vld = (() => {
    const ResolveRule = (def) => {
        if (typeof def === 'string') return { fn: Vld.Rule[def], args: {}, key: def, msg: undefined };
        if (typeof def === 'function') return { fn: def, args: {}, key: undefined, msg: undefined };
        if (!('rule' in def)) {
            const name = Object.keys(def)[0];
            const val = def[name];
            const plain = val != null && typeof val === 'object' && Object.getPrototypeOf(val) === Object.prototype;
            return { fn: Vld.Rule[name], args: plain ? val : { value: val }, key: name, msg: undefined };
        }
        const { rule, msg, key, ...args } = def;
        const fn = typeof rule === 'string' ? Vld.Rule[rule] : rule;
        return { fn, args, key: key ?? (typeof rule === 'string' ? rule : undefined), msg };
    };

    const IsEmpty = (v) => v === undefined || v === null || v === '';

    const CheckErrors = async (check, data) => {
        const input = check.path == null ? data : data[check.path];
        const path = check.errorPath ?? check.path ?? null;
        if (IsEmpty(input)) {
            if (check.required === false) return [];
            return [{ key: 'required', message: check.requiredMsg ?? Vld.Msg.required, path }];
        }
        for (const def of check.rules) {
            const { fn, args, key, msg } = ResolveRule(def);
            const result = await fn(input, args);
            if (result !== true) {
                const message = msg ?? (typeof result === 'string' ? result : Vld.msg(key, args));
                return [{ key, message, path }];
            }
        }
        return [];
    };

    const Validate = async (rules, data) => {
        for (const checks of rules) {
            const errors = (await Promise.all(checks.map(check => CheckErrors(check, data)))).flat();
            if (errors.length) return errors;
        }
        return [];
    };

    return { Validate };
})();

Vld.Msg = {
    required: 'This field is required',
    email: 'Not a valid email address',
    url: 'Not a valid URL',
    min: 'Must be at least {value} characters',
    max: 'Must be at most {value} characters',
    between: 'Must be between {min} and {max} characters',
    length: 'Must be exactly {value} characters',
    alpha: 'Only letters are allowed',
    alnum: 'Only letters and numbers are allowed',
    digits: 'Only digits are allowed',
    numeric: 'Must be a number',
    integer: 'Must be a whole number',
    gte: 'Must be {value} or more',
    lte: 'Must be {value} or less',
    in: 'Must be one of: {value}',
    notIn: 'Must not be one of: {value}',
    regex: 'Invalid format',
    same: 'Must match',
    different: 'Must be different',
    confirmed: 'Confirmation does not match',
};

Vld.msg = (key, args = {}) => (Vld.Msg[key] ?? '').replace(/\{(\w+)\}/g, (_, k) => args[k] ?? '');

Vld.Rule = {
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    url: (v) => { try { new URL(v); return true; } catch { return false; } },
    min: (v, a) => String(v ?? '').length >= a.value,
    max: (v, a) => String(v ?? '').length <= a.value,
    between: (v, a) => { const n = String(v ?? '').length; return n >= a.min && n <= a.max; },
    length: (v, a) => String(v ?? '').length === a.value,
    alpha: (v) => /^[a-zA-Z]+$/.test(v),
    alnum: (v) => /^[a-zA-Z0-9]+$/.test(v),
    digits: (v) => /^[0-9]+$/.test(v),
    numeric: (v) => v !== '' && !isNaN(Number(v)),
    integer: (v) => Number.isInteger(Number(v)),
    gte: (v, a) => Number(v) >= a.value,
    lte: (v, a) => Number(v) <= a.value,
    in: (v, a) => a.value.includes(v),
    notIn: (v, a) => !a.value.includes(v),
    regex: (v, a) => a.value.test(v),
    same: (data, a) => data[a.first] === data[a.second],
    different: (data, a) => data[a.first] !== data[a.second],
    confirmed: (data, a) => data[a.value] === data[`${a.value}_confirmation`],
};

Vld.Form = (() => {
    const EscapeHtml = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const FormEl = (space) => space.matches('[vld-form]') ? space : space.querySelector('[vld-form]');

    const FormValues = (form) => {
        const data = {};
        for (const [name, value] of new FormData(form)) {
            data[name] = name in data ? [].concat(data[name], value) : value;
        }
        return data;
    };

    const Clear = (root, attr = 'vld-error') => root.querySelectorAll(`[${attr}]`).forEach(el => { el.innerHTML = ''; });

    const Apply = (root, errors, tpl, attr = 'vld-error') => {
        const selector = tpl ?? root.getAttribute('vld-error-tpl');
        const template = selector && document.querySelector(selector)?.innerHTML;

        Clear(root, attr);
        if (!template) return errors;

        errors.forEach(e => {
            const el = root.querySelector(`[${attr}="${CSS.escape(e.path ?? '')}"]`);
            el?.insertAdjacentHTML('beforeend', template.replace(/\{(\w+)\}/g, (_, k) => EscapeHtml(e[k] ?? '')));
        });

        return errors;
    };

    const Validate = async (root, rules, data, tpl, attr) => {
        const errors = await Vld.Validate(rules, data);
        Apply(root, errors, tpl, attr);
        return errors.length === 0;
    };

    const Submit = async (ctx, event, rules, data) => {
        event?.preventDefault();
        const space = ctx.closest('[vld-space]');
        return Validate(space, rules, data ?? FormValues(FormEl(space)));
    };

    return { Clear, Validate, Submit };
})();
