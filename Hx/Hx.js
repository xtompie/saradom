const hx = (() => {

    const main = (source, event = null) => {
        if (isDisabled(source)) return;

        preventDefault(source, event);

        const task = createTask(source);
        if (!task) return;

        show(task.indicator);

        fetch(task.url, task.options)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.text();
            })
            .then(html => render(html, task.target, task.swap, task.select))
            .finally(() => hide(task.indicator));
    };

    const isDisabled = el => el.hasAttribute('hx-disable');

    const preventDefault = (el, event) => {
        const tag = el.tagName;
        if ((tag === 'FORM' || tag === 'A' || el.hasAttribute('hx-get') || el.hasAttribute('hx-post')) && event?.preventDefault) {
            event.preventDefault();
        }
    };

    const queryElements = (el, descriptor) => {
        if (!descriptor || descriptor === 'this') return [el];
        if (descriptor.startsWith('closest ')) {
            const parts = descriptor.split(' ');
            const base = el.closest(parts[1]);
            if (!base) return [];
            const sub = parts.slice(2).join(' ');
            if (sub) return Array.from(base.querySelectorAll(sub));
            return [base];
        }
        if (descriptor.startsWith('find ')) {
            return Array.from(el.querySelectorAll(descriptor.slice(5)));
        }
        return Array.from(document.querySelectorAll(descriptor));
    };

    const createTask = el => {
        const [method, rawUrl] = resolveMethodAndUrl(el);
        const target = findTarget(el);
        if (!method || !rawUrl || !target) return null;

        const url = applyQuery(el, rawUrl);
        const body = buildBody(el, method);
        const options = buildOptions(method, body);
        const swap = param(el, 'hx-swap') || 'innerHTML';
        const select = param(el, 'hx-select');
        const indicator = findIndicator(el);

        return { method, url, options, swap, select, target, indicator };
    };

    const resolveMethodAndUrl = el => {
        const names = ['get', 'post', 'put', 'delete', 'patch'];
        for (const name of names) {
            const url = param(el, `hx-${name}`);
            if (url) return [name.toUpperCase(), url];
        }

        if (el.tagName === 'A' && el.hasAttribute('href')) return ['GET', el.getAttribute('href')];
        if (el.tagName === 'FORM') {
            return ['POST', el.getAttribute('action') || location.href];
        }

        return [null, null];
    };

    const buildBody = (el, method) => {
        if (method === 'GET') return null;
        if (el.tagName === 'FORM') return new URLSearchParams(new FormData(el)).toString();
        const vals = valsBody(el);
        if (vals !== null) return vals;
        if (!el.name) return null;
        if (el.type === 'checkbox' || el.type === 'radio') {
            if (!el.checked) return null;
        }
        return `${encodeURIComponent(el.name)}=${encodeURIComponent(el.value || '')}`;
    };

    const evalVals = (el, name) => {
        const code = param(el, name);
        if (!code) return null;
        try {
            const fn = new Function('return (' + code + ')').call(el);
            return fn.call(el) || null;
        } catch {
            return null;
        }
    };

    const enc = s => encodeURIComponent(s).replace(/%20/g, '+');
    const dec = s => decodeURIComponent(s.replace(/\+/g, ' '));

    const flatten = params => {
        const out = [];
        const walk = (key, val) => {
            if (val === true) val = '1';
            if (val === false) val = '0';
            if (val === null || val === undefined) return;
            if (typeof val === 'object') {
                Object.entries(val).forEach(([k, v]) => walk(`${key}[${k}]`, v));
            } else {
                out.push([key, val]);
            }
        };
        Object.entries(params).forEach(([k, v]) => walk(k, v));
        return out;
    };

    const parsePairs = qs => qs ? qs.split('&').filter(Boolean).map(p => {
        const i = p.indexOf('=');
        return i < 0 ? [dec(p), ''] : [dec(p.slice(0, i)), dec(p.slice(i + 1))];
    }) : [];

    const mergePairs = pairs => {
        const map = new Map();
        for (const [k, v] of pairs) map.set(k, v);
        return [...map];
    };

    const encodePairs = pairs => pairs.map(([k, v]) => `${enc(k)}=${enc(v)}`).join('&');

    const valsBody = el => {
        const obj = evalVals(el, 'hx-vals-body');
        return obj ? encodePairs(flatten(obj)) : null;
    };

    const applyQuery = (el, url) => {
        const obj = evalVals(el, 'hx-vals-query');
        const additions = obj ? flatten(obj) : [];
        if (!additions.length) return url;
        const hash = url.indexOf('#');
        const frag = hash < 0 ? '' : url.slice(hash);
        const rest = hash < 0 ? url : url.slice(0, hash);
        const qi = rest.indexOf('?');
        const base = qi < 0 ? rest : rest.slice(0, qi);
        const existing = qi < 0 ? '' : rest.slice(qi + 1);
        const merged = mergePairs([...parsePairs(existing), ...additions]);
        return base + '?' + encodePairs(merged) + frag;
    };

    const buildOptions = (method, body) => {
        if (method === 'GET') return { method };
        return {
            method,
            headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' }),
            body
        };
    };

    const param = (el, name) => attrOwner(el, name)?.getAttribute(name) || null;

    const attrOwner = (el, name) => el.closest(`[${name}]`);

    const findTarget = el => {
        const owner = attrOwner(el, 'hx-target') || el;
        return queryElements(owner, owner.getAttribute('hx-target'))[0] || null;
    };

    const findIndicator = el => {
        const owner = attrOwner(el, 'hx-indicator');
        return owner ? queryElements(owner, owner.getAttribute('hx-indicator'))[0] || null : null;
    };

    const show = el => {
        if (el) el.style.display = '';
    };

    const hide = el => {
        if (el) el.style.display = 'none';
    };

    const render = (html, target, swap, select) => {
        const frag = document.createElement('template');
        frag.innerHTML = html.trim();
        const content = select ? frag.content.querySelector(select) : frag.content;
        if (!content || !target?.parentNode) return;

        if (swap === 'outerHTML') {
            target.replaceWith(...content.children);
        } else if (swap === 'append') {
            target.append(...content.children);
        } else if (swap === 'prepend') {
            target.prepend(...Array.from(content.children).reverse());
        } else if (swap === 'none') {
            return;
        } else {
            target.innerHTML = '';
            target.append(...content.children);
        }
    };

    return main;
})();
