const Val = (() => {
    const Attr = (el, a, v) => {
        if (v === undefined) return el.getAttribute(a);
        if (v === null || v === false) { el.removeAttribute(a); return el; }
        el.setAttribute(a, v);
        return el;
    };
    const Allfd = (el, s) => Array.from(el.children)
        .filter(e => e instanceof HTMLElement)
        .reduce((r, e) => e.matches(s) ? r.concat(e) : r.concat(Allfd(e, s)), []);
    const Lane = el => el.closest('[val-lane]')?.getAttribute('val-lane') ?? null;
    const Fd = (el, lane, cur = Lane(el)) => Array.from(el.children)
        .filter(e => e instanceof HTMLElement)
        .reduce((r, e) => {
            const l = e.getAttribute('val-lane');
            const ec = l != null ? l : cur;
            if (e.hasAttribute('val')) return ec === lane ? r.concat(e) : r;
            return r.concat(Fd(e, lane, ec));
        }, []);
    const TplClone = t => t.content.firstElementChild.cloneNode(true);
    const Tpl = tpl => typeof tpl === 'string' ? document.querySelector(tpl) : tpl;

    const Fx = (el, write, v = null) => {
        const fx = Attr(el, 'val-fx');
        if (fx && fx !== '' && Val.Fx[fx]) {
            return write ? Val.Fx[fx].Set(el, v) : Val.Fx[fx].Get(el);
        }
    };
    const Sg = (el, write, v = null) => {
        const code = Attr(el, write ? 'val-set' : 'val-get');
        if (code) {
            return write
                ? (function () { return eval(code).call(el, v); }).bind(el)()
                : (function () { return eval(code).call(el); }).bind(el)()
            ;
        }
    };
    const Get = el => ({ ...Fx(el, false) || {}, ...Sg(el, false) || {} });
    const Set = (el, v) => { Fx(el, true, v); Sg(el, true, v); };
    const Frag = (tpl, data) => {
        const frag = TplClone(tpl);
        Obj(frag, data);
        return frag;
    };
    const Iter = (el, tpl, data, method) => {
        const t = Tpl(tpl);
        data.forEach(d => el[method](Frag(t, d)));
    };
    const Obj = (el, data = null, lane = null) => {
        lane = lane ?? Lane(el);
        if (data === null) {
            const d = {};
            if (el.hasAttribute('val')) Object.assign(d, Get(el));
            Fd(el, lane).reduce((r, e) => Object.assign(r, Get(e)), d);
            return Object.keys(d).length === 0 ? null : d;
        }
        if (el.hasAttribute('val')) Set(el, data);
        Fd(el, lane).forEach(e => Set(e, data));
    };
    const Arr = (el, data = undefined, tpl = null) => {
        if (data === undefined && tpl === null) {
            return Array.from(el.children).map(e => Obj(e));
        }
        el.innerHTML = '';
        if (data?.length) Iter(el, tpl, data, 'appendChild');
    };
    const Render = (el, tpl, data) => {
        el.innerHTML = '';
        if (data !== undefined && data !== null) el.appendChild(Frag(Tpl(tpl), data));
    };
    const Append = (el, data, tpl = null) => Iter(el, tpl === null ? Attr(el, 'val-tpl') : tpl, data, 'appendChild');
    const Prepend = (el, data, tpl = null) => Iter(el, tpl === null ? Attr(el, 'val-tpl') : tpl, data.reverse(), 'prepend');

    return { Get, Set, Append, Prepend, Obj, Arr, Render, Allfd, Fd, Lane, Attr };
})();

Val.Fx = {
    Obj: {
        Get: (el) => {
            const key = el.getAttribute('val-key');
            const d = {};
            Val.Fd(el, Val.Lane(el)).forEach(e => Object.assign(d, Val.Get(e)));
            return key ? { [key]: d } : d;
        },
        Set: (el, data) => {
            const key = el.getAttribute('val-key');
            const val = key ? data[key] : data;
            if (val === undefined || val === null) return;
            Val.Fd(el, Val.Lane(el)).forEach(e => Val.Set(e, val));
        }
    },
    Arr: {
        Get: (el) => ({ [el.getAttribute('val-key')]: Val.Arr(el) }),
        Set: (el, data) => Val.Arr(el, data[el.getAttribute('val-key')], el.getAttribute('val-tpl'))
    },
    Render: {
        Get: (el) => {
            const d = {};
            Val.Fd(el, Val.Lane(el)).forEach(e => Object.assign(d, Val.Get(e)));
            return { [el.getAttribute('val-key')]: d };
        },
        Set: (el, data) => Val.Render(el, el.getAttribute('val-tpl'), data[el.getAttribute('val-key')])
    },
    Text: {
        Get: (el) => ({ [el.getAttribute('val-key')]: el.textContent }),
        Set: (el, data) => { el.textContent = data[el.getAttribute('val-key')]; }
    },
    Html: {
        Get: (el) => ({ [el.getAttribute('val-key')]: el.innerHTML }),
        Set: (el, data) => { el.innerHTML = data[el.getAttribute('val-key')]; }
    },
    Input: {
        Get: (el) => ({ [el.getAttribute('val-key')]: el.value }),
        Set: (el, data) => { el.value = data[el.getAttribute('val-key')] || ''; }
    },
    Show: {
        Get: (el) => ({ [el.getAttribute('val-key')]: el.style.display !== 'none' }),
        Set: (el, data) => { el.style.display = data[el.getAttribute('val-key')] ? '' : 'none'; }
    },
    Hide: {
        Get: (el) => ({ [el.getAttribute('val-key')]: el.style.display === 'none' }),
        Set: (el, data) => { el.style.display = data[el.getAttribute('val-key')] ? 'none' : ''; }
    },
    Img: {
        Get: (el) => ({ [el.getAttribute('val-key')]: el.src }),
        Set: (el, data) => { el.src = data[el.getAttribute('val-key')]; }
    },
    Attr: {
        Get: (el) => ({ [el.getAttribute('val-key')]: Val.Attr(el, el.getAttribute('val-attr')) }),
        Set: (el, data) => { Val.Attr(el, el.getAttribute('val-attr'), data[el.getAttribute('val-key')]); }
    },
    Pattr: {
        Get: (el) => ({ [el.getAttribute('val-key')]: Val.Attr(el.parentElement, el.getAttribute('val-attr')) }),
        Set: (el, data) => { Val.Attr(el.parentElement, el.getAttribute('val-attr'), data[el.getAttribute('val-key')]); }
    },
    Prop: {
        Get: (el) => { const key = el.getAttribute('val-key'); return { [key]: el._val?.[key] }; },
        Set: (el, data) => { const key = el.getAttribute('val-key'); (el._val ??= {})[key] = data[key]; }
    },
    Pprop: {
        Get: (el) => { const key = el.getAttribute('val-key'); return { [key]: el.parentElement._val?.[key] }; },
        Set: (el, data) => { const key = el.getAttribute('val-key'); (el.parentElement._val ??= {})[key] = data[key]; }
    },
    Pflag: {
        Get: (el) => ({ [el.getAttribute('val-key')]: el.parentElement.hasAttribute(el.getAttribute('val-attr')) }),
        Set: (el, data) => { el.parentElement.toggleAttribute(el.getAttribute('val-attr'), !!data[el.getAttribute('val-key')]); }
    },
    Select: {
        Get: (el) => {
            const key = el.getAttribute('val-key');
            const from = el.getAttribute('val-from');
            const mark = el.getAttribute('val-mark');
            const sel = Val.Allfd(el, `[${from}]`).find(o => o.hasAttribute(mark));
            return { [key]: sel ? sel.getAttribute(from) : null };
        },
        Set: (el, data) => {
            const from = el.getAttribute('val-from');
            const mark = el.getAttribute('val-mark');
            const value = data[el.getAttribute('val-key')];
            Val.Allfd(el, `[${from}]`).forEach(o => o.toggleAttribute(mark, o.getAttribute(from) === value));
        }
    },
    If: {
        Get: (el) => {
            const key = el.getAttribute('val-key');
            const value = el.getAttribute('val-value');
            const conditionMet = el.style.display !== 'none' && (!value || value === 'true');
            if (!conditionMet) return {};
            const result = Val.Fd(el, Val.Lane(el)).reduce((r, e) => Object.assign(r, Val.Get(e)), {});
            return { [key]: result };
        },
        Set: (el, data) => {
            const key = el.getAttribute('val-key');
            const value = el.getAttribute('val-value');
            const conditionMet = value ? value === data[key] : data[key];
            el.style.display = conditionMet ? '' : 'none';
            if (conditionMet && data[key]) {
                Val.Fd(el, Val.Lane(el)).forEach(e => Val.Set(e, data[key]));
            }
        }
    }
};

HTMLElement.prototype.vappend = function (data, tpl = null) { Val.Append(this, data, tpl); return this; };
HTMLElement.prototype.varr = function (data, tpl = null) { return Val.Arr(this, data, tpl); };
HTMLElement.prototype.vprepend = function (data, tpl = null) { Val.Prepend(this, data, tpl); return this; };
HTMLElement.prototype.vrender = function (data, tpl = null) { Val.Render(this, tpl, data); return this; };
HTMLElement.prototype.val = function (data, lane) {
    lane = lane ?? Val.Lane(this);
    if (data === undefined) return this.hasAttribute('val') ? Val.Get(this) : Val.Obj(this, null, lane);
    this.hasAttribute('val') ? Val.Set(this, data) : Val.Obj(this, data, lane);
    return this;
};
(() => {
    const eq = (a, b) => {
        if (a === b) return true;
        if (a == null || b == null) return a === b;
        if (typeof a !== 'object' && typeof b !== 'object') return String(a) === String(b);
        const plain = v => Array.isArray(v) || Object.getPrototypeOf(v) === Object.prototype;
        if (!plain(a) || !plain(b)) return false;
        return JSON.stringify(a) === JSON.stringify(b);
    };
    const syncArr = (el, data) => {
        const next = data[el.getAttribute('val-key')] || [];
        const kids = Array.from(el.children);
        const cur = kids.map(c => Val.Obj(c));
        const n = Math.min(kids.length, next.length);
        for (let i = 0; i < n; i++) if (!eq(cur[i], next[i])) sync(kids[i], next[i]);
        if (next.length > kids.length) Val.Append(el, next.slice(kids.length));
        else for (let i = kids.length - 1; i >= next.length; i--) kids[i].remove();
    };
    const sync = (root, data, lane = null) => {
        lane = lane ?? Val.Lane(root);
        const leaves = Val.Fd(root, lane);
        const targets = leaves.length ? leaves : (root.hasAttribute('val') ? [root] : []);
        targets.forEach(e => {
            if (e.hasAttribute('val-set')) { Val.Set(e, data); return; }
            const fx = Val.Attr(e, 'val-fx');
            if (fx === 'Arr') { syncArr(e, data); return; }
            if (fx === 'Obj') {
                const key = e.getAttribute('val-key');
                const cur = Val.Get(e);
                const curSub = key ? cur[key] : cur;
                const nextSub = key ? data?.[key] : data;
                if (!eq(curSub, nextSub)) sync(e, nextSub);
                return;
            }
            const cur = Val.Get(e);
            const keys = Object.keys(cur);
            if (keys.length === 0 || keys.some(k => !eq(cur[k], data?.[k]))) Val.Set(e, data);
        });
    };

    Val.Sync  = sync;
    Val.Patch = (el, patch, lane) => {
        lane = lane ?? Val.Lane(el);
        const cur = el.hasAttribute('val') ? Val.Get(el) : Val.Obj(el, null, lane);
        Val.Sync(el, { ...cur, ...patch }, lane);
    };

    HTMLElement.prototype.set = function (data, lane) {
        lane = lane ?? Val.Lane(this);
        if (typeof data === 'function') {
            const cur = this.val(undefined, lane);
            const next = data(cur);
            data = next === undefined ? cur : next;
        }
        Val.Sync(this, data, lane);
        return this;
    };
    HTMLElement.prototype.patch = function (patch, lane) { Val.Patch(this, patch, lane); return this; };
})();
