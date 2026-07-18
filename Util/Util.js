const dom = document;
document.al = function(s) {
    return Array.from(document.querySelectorAll(s));
};
document.one = function(s) {
    return document.querySelector(s);
};
Array.prototype.each = function(f) {
    return this.forEach(f);
};
Array.prototype.any = function() {
    return this.length > 0;
};
Array.prototype.none = function() {
    return this.length === 0;
};
DocumentFragment.prototype.one = function(s) {
    return this.querySelector(s);
};
DocumentFragment.prototype.allfd = function(s) {
    return Array.from(this.children).reduce((r, e) => {
        return e.matches(s) ? r.concat(e) : r.concat(e.allfd(s));
    }, []);
}
HTMLElement.prototype.all = function(s) {
    return Array.from(this.querySelectorAll(s));
}
HTMLElement.prototype.allfd = function(s) {
    return Array.from(this.children)
        .filter(e => e instanceof HTMLElement)
        .reduce((r, e) => {
            return e.matches(s) ? r.concat(e) : r.concat(e.allfd(s));
        }, []);
}
HTMLElement.prototype.attr = function(a, v) {
    if (v === undefined) {
        return this.getAttribute(a);
    }
    else if (v === null || v === false) {
        this.removeAttribute(a);
        return this;
    } else {
        this.setAttribute(a, v);
        return this;
    }
}
HTMLElement.prototype.attrt = function(a, v1, v2) {
    this.attr(a, this.attr(a) === v1 ? v2 : v1);
    return this;
}
HTMLElement.prototype.attrs = function(prefix, values) {
    if (values === undefined) {
        const pre = prefix === undefined ? '' : prefix + '-';
        const out = {};
        for (const a of this.attributes) {
            if (a.name.startsWith(pre)) out[a.name.slice(pre.length)] = a.value;
        }
        return out;
    }
    const pre = prefix + '-';
    Object.entries(values).each(([k, v]) => this.setAttribute(pre + k, v));
    return this;
}
HTMLElement.prototype.clear = function() {
    this.innerHTML = '';
    return this;
}
HTMLElement.prototype.cls = function() {
    return this.classList;
}
HTMLElement.prototype.flag = function(f, v = null) {
    if (v === null) {
        return this.hasAttribute(f);
    }
    v === true ? this.setAttribute(f, '') : this.removeAttribute(f);
    return this;
}
HTMLElement.prototype.hide = function(v = true) {
    this.style.display = v === true ? 'none' : '';
    return this;
}
HTMLElement.prototype.one = function(s) {
    return this.querySelector(s);
}
HTMLElement.prototype.tpl = function() {
    return this.content.firstElementChild.cloneNode(true);
}
HTMLElement.prototype.run = function(attr) {
    const code = this.getAttribute(attr);
    if (!code) return;
    const val = new Function('return (' + code + ')').call(this);
    return typeof val === 'function' ? val.call(this) : val;
}
HTMLElement.prototype.show = function(v = true) {
    this.style.display = v === true ? '' : 'none';
    return this;
}
HTMLElement.prototype.up = function(s) {
    if (s === undefined) {
        return this.parentNode;
    }
    if (this.matches(s)) {
        return this;
    }
    let node = this.closest(s);
    if (node) {
        return node;
    }
    return document.body;
}
KeyboardEvent.prototype.combo = function(combo) {
    return `${this.altKey ? 'Alt+' : ''}${this.ctrlKey ? 'Ctrl+' : ''}${this.metaKey ? 'Meta+' : ''}${this.shiftKey ? 'Shift+' : ''}${this.key}` === combo;
};
String.prototype.cut = function(length) {
    return this.length > length ? this.substring(0, length) + '...' : this;
};