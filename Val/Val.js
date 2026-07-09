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
    const TplClone = t => t.content.firstElementChild.cloneNode(true);
    const Tpl = tpl => typeof tpl === 'string' ? document.querySelector(tpl) : tpl;

    const FxParams = (el) => {
        const params = {};
        Array.from(el.attributes).forEach(a => {
            if (a.name.startsWith('val-') && !['val-set', 'val-get', 'val-fx', 'val-lane'].includes(a.name)) {
                params[a.name.substring(4)] = a.value;
            }
        });
        return params;
    };
    const Fx = (el, write, v = null) => {
        const fx = Attr(el, 'val-fx');
        if (fx && fx !== '' && api.Fx[fx]) {
            return write ? api.Fx[fx].Set(el, v, FxParams(el)) : api.Fx[fx].Get(el, FxParams(el));
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
        const sel = lane ? `[val][val-lane="${lane}"]` : '[val]';
        if (data === null) {
            const d = {};
            if (el.hasAttribute('val')) Object.assign(d, Get(el));
            Allfd(el, sel).reduce((r, e) => Object.assign(r, Get(e)), d);
            return Object.keys(d).length === 0 ? null : d;
        }
        if (el.hasAttribute('val')) Set(el, data);
        Allfd(el, sel).forEach(e => Set(e, data));
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
    const Patch = (el, data) => Obj(el, Object.assign(Obj(el), data));
    const Append = (el, data, tpl = null) => Iter(el, tpl === null ? Attr(el, 'val-tpl') : tpl, data, 'appendChild');
    const Prepend = (el, data, tpl = null) => Iter(el, tpl === null ? Attr(el, 'val-tpl') : tpl, data.reverse(), 'prepend');
    const Modify = (el, callback) => Obj(el, callback(Obj(el)));

    const api = { Get, Set, Patch, Append, Prepend, Modify, Obj, Arr, Render, FxParams };

    api.Fx = {
        Obj: {
            Get: (el, params) => {
                const d = {};
                Allfd(el, '[val]').forEach(e => Object.assign(d, Get(e)));
                return params.key ? { [params.key]: d } : d;
            },
            Set: (el, data, params) => {
                const val = params.key ? data[params.key] : data;
                if (val === undefined || val === null) return;
                Allfd(el, '[val]').forEach(e => Set(e, val));
            }
        },
        Arr: {
            Get: (el, params) => ({ [params.key]: Arr(el) }),
            Set: (el, data, params) => Arr(el, data[params.key], params.tpl)
        },
        Render: {
            Get: (el, params) => {
                const d = {};
                Allfd(el, '[val]').forEach(e => Object.assign(d, Get(e)));
                return { [params.key]: d };
            },
            Set: (el, data, params) => Render(el, params.tpl, data[params.key])
        },
        Text: {
            Get: (el, params) => ({ [params.key]: el.textContent }),
            Set: (el, data, params) => { el.textContent = data[params.key]; }
        },
        Html: {
            Get: (el, params) => ({ [params.key]: el.innerHTML }),
            Set: (el, data, params) => { el.innerHTML = data[params.key]; }
        },
        Input: {
            Get: (el, params) => ({ [params.key]: el.value }),
            Set: (el, data, params) => { el.value = data[params.key] || ''; }
        },
        Show: {
            Get: (el, params) => ({ [params.key]: el.style.display !== 'none' }),
            Set: (el, data, params) => { el.style.display = data[params.key] ? '' : 'none'; }
        },
        Hide: {
            Get: (el, params) => ({ [params.key]: el.style.display === 'none' }),
            Set: (el, data, params) => { el.style.display = data[params.key] ? 'none' : ''; }
        },
        Img: {
            Get: (el, params) => ({ [params.key]: el.src }),
            Set: (el, data, params) => { el.src = data[params.key]; }
        },
        Attr: {
            Get: (el, params) => ({ [params.key]: Attr(el, params.attr) }),
            Set: (el, data, params) => { Attr(el, params.attr, data[params.key]); }
        },
        Pattr: {
            Get: (el, params) => ({ [params.key]: Attr(el.parentElement, params.attr) }),
            Set: (el, data, params) => { Attr(el.parentElement, params.attr, data[params.key]); }
        },
        If: {
            Get: (el, params) => {
                const conditionMet = el.style.display !== 'none' && (!params.value || params.value === 'true');
                if (!conditionMet) return {};
                const result = Allfd(el, '[val]').reduce((r, e) => Object.assign(r, Get(e)), {});
                return { [params.key]: result };
            },
            Set: (el, data, params) => {
                const conditionMet = params.value ? params.value === data[params.key] : data[params.key];
                el.style.display = conditionMet ? '' : 'none';
                if (conditionMet && data[params.key]) {
                    Allfd(el, '[val]').forEach(e => Set(e, data[params.key]));
                }
            }
        },
        Fxs: {
            Get: (el, params) => {
                return Array.from(el.querySelector('[val-fxs]')?.children ?? []).reduce((result, fxEl) => {
                    const fx = Attr(fxEl, 'val-fx');
                    return (fx && api.Fx[fx])
                        ? Object.assign(result, api.Fx[fx].Get(el, FxParams(fxEl)))
                        : result;
                }, {});
            },
            Set: (el, data, params) => {
                Array.from(el.querySelector('[val-fxs]')?.children ?? []).forEach(fxEl => {
                    const fx = Attr(fxEl, 'val-fx');
                    fx && api.Fx[fx] && api.Fx[fx].Set(el, data, FxParams(fxEl));
                });
            }
        }
    };

    return api;
})();

HTMLElement.prototype.vappend = function (data, tpl = null) { Val.Append(this, data, tpl); return this; };
HTMLElement.prototype.varr = function (data, tpl = null) { return Val.Arr(this, data, tpl); };
HTMLElement.prototype.vget = function (lane) { lane = lane ?? this.getAttribute('val-lane'); return this.hasAttribute('val') ? Val.Get(this) : Val.Obj(this, null, lane); };
HTMLElement.prototype.vmodify = function (f) { Val.Modify(this, f); return this; };
HTMLElement.prototype.vobj = function (data = null, lane) { lane = lane ?? this.getAttribute('val-lane'); return Val.Obj(this, data, lane); };
HTMLElement.prototype.vpatch = function (data) { Val.Patch(this, data); return this; };
HTMLElement.prototype.vprepend = function (data, tpl = null) { Val.Prepend(this, data, tpl); return this; };
HTMLElement.prototype.vrender = function (data, tpl = null) { Val.Render(this, tpl, data); return this; };
HTMLElement.prototype.vset = function (data, lane) {
    lane = lane ?? this.getAttribute('val-lane');
    this.hasAttribute('val') ? Val.Set(this, data) : Val.Obj(this, data, lane);
    return this;
};
HTMLElement.prototype.vval = function (data) {
    if (arguments.length === 0) return this.hasAttribute('val') ? Val.Get(this) : Val.Obj(this);
    this.hasAttribute('val') ? Val.Set(this, data) : Val.Obj(this, data);
    return this;
};
