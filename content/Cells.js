const Cells = (() => {
    const CELL_RE = /^[A-Z]+[0-9]+$/;

    function colName(n) {
        let name = '';
        n++;
        while (n > 0) {
            n--;
            name = String.fromCharCode(65 + (n % 26)) + name;
            n = Math.floor(n / 26);
        }
        return name;
    }

    function colIndex(name) {
        let n = 0;
        for (const ch of name) n = n * 26 + (ch.charCodeAt(0) - 64);
        return n - 1;
    }

    function createSheet(cols, rows) {
        const sheet = {};
        const raw = {};
        const dependsOn = {};
        cols.forEach(c => rows.forEach(r => {
            const id = c + r;
            sheet[id] = R(() => '');
            raw[id] = '';
            dependsOn[id] = new Set();
        }));
        return { sheet, raw, dependsOn };
    }

    function toNum(v) {
        if (v === '#ERR' || v === '#CIRC') throw new Error('propagated error');
        if (v === '' || v === undefined || v === null) return 0;
        const n = typeof v === 'number' ? v : parseFloat(v);
        if (isNaN(n)) throw new Error('not a number: ' + v);
        return n;
    }

    function flatten(args) {
        const out = [];
        args.forEach(a => Array.isArray(a) ? out.push(...a) : out.push(a));
        return out;
    }

    const FUNCTIONS = {
        SUM: args => flatten(args).reduce((s, v) => s + toNum(v), 0),
        CONCAT: args => flatten(args).map(v => v === undefined ? '' : String(v)).join(''),
        UPPER: args => String(args[0] ?? '').toUpperCase(),
        LOWER: args => String(args[0] ?? '').toLowerCase(),
        LEN: args => String(args[0] ?? '').length,
    };

    function tokenize(src) {
        const tokens = [];
        let i = 0;
        while (i < src.length) {
            const ch = src[i];
            if (/\s/.test(ch)) { i++; continue; }
            if (/[0-9.]/.test(ch)) {
                let j = i;
                while (j < src.length && /[0-9.]/.test(src[j])) j++;
                tokens.push({ type: 'NUMBER', value: parseFloat(src.slice(i, j)) });
                i = j;
                continue;
            }
            if (ch === '"') {
                let j = i + 1;
                while (j < src.length && src[j] !== '"') j++;
                tokens.push({ type: 'STRING', value: src.slice(i + 1, j) });
                i = j + 1;
                continue;
            }
            if (/[A-Za-z]/.test(ch)) {
                let j = i;
                while (j < src.length && /[A-Za-z0-9]/.test(src[j])) j++;
                tokens.push({ type: 'IDENT', value: src.slice(i, j).toUpperCase() });
                i = j;
                continue;
            }
            if ('+-*/(),:'.includes(ch)) {
                tokens.push({ type: ch });
                i++;
                continue;
            }
            throw new Error('unexpected character: ' + ch);
        }
        return tokens;
    }

    function parse(src) {
        const tokens = tokenize(src);
        let pos = 0;
        const peek = () => tokens[pos];
        const next = () => tokens[pos++];

        function parseExpr() {
            let node = parseTerm();
            while (peek() && (peek().type === '+' || peek().type === '-')) {
                const op = next().type;
                node = { type: 'BINOP', op, left: node, right: parseTerm() };
            }
            return node;
        }
        function parseTerm() {
            let node = parseFactor();
            while (peek() && (peek().type === '*' || peek().type === '/')) {
                const op = next().type;
                node = { type: 'BINOP', op, left: node, right: parseFactor() };
            }
            return node;
        }
        function parseFactor() {
            const t = peek();
            if (!t) throw new Error('unexpected end of formula');
            if (t.type === '-') { next(); return { type: 'NEG', node: parseFactor() }; }
            if (t.type === '(') {
                next();
                const node = parseExpr();
                if (!peek() || peek().type !== ')') throw new Error('expected )');
                next();
                return node;
            }
            if (t.type === 'NUMBER') { next(); return { type: 'NUM', value: t.value }; }
            if (t.type === 'STRING') { next(); return { type: 'STR', value: t.value }; }
            if (t.type === 'IDENT') {
                next();
                if (peek() && peek().type === '(') {
                    next();
                    const args = [];
                    if (peek() && peek().type !== ')') {
                        args.push(parseExpr());
                        while (peek() && peek().type === ',') { next(); args.push(parseExpr()); }
                    }
                    if (!peek() || peek().type !== ')') throw new Error('expected )');
                    next();
                    return { type: 'CALL', name: t.value, args };
                }
                if (CELL_RE.test(t.value)) {
                    if (peek() && peek().type === ':') {
                        next();
                        const endTok = next();
                        if (!endTok || endTok.type !== 'IDENT' || !CELL_RE.test(endTok.value)) throw new Error('expected cell after :');
                        return { type: 'RANGE', from: t.value, to: endTok.value };
                    }
                    return { type: 'CELL', id: t.value };
                }
                throw new Error('unknown identifier: ' + t.value);
            }
            throw new Error('unexpected token');
        }

        const ast = parseExpr();
        if (pos !== tokens.length) throw new Error('unexpected trailing tokens');
        return ast;
    }

    function splitCell(id) {
        const m = id.match(/^([A-Z]+)([0-9]+)$/);
        return [m[1], parseInt(m[2], 10)];
    }

    function evalRangeIds(node) {
        const [colFrom, rowFrom] = splitCell(node.from);
        const [colTo, rowTo] = splitCell(node.to);
        const colStart = Math.min(colIndex(colFrom), colIndex(colTo));
        const colEnd = Math.max(colIndex(colFrom), colIndex(colTo));
        const rowStart = Math.min(rowFrom, rowTo);
        const rowEnd = Math.max(rowFrom, rowTo);
        const ids = [];
        for (let c = colStart; c <= colEnd; c++)
            for (let r = rowStart; r <= rowEnd; r++)
                ids.push(colName(c) + r);
        return ids;
    }

    function evalRange(node, sheet) {
        return evalRangeIds(node).map(id => sheet[id] ? sheet[id]() : '');
    }

    function collectRefs(node, out = new Set()) {
        switch (node.type) {
            case 'CELL': out.add(node.id); break;
            case 'RANGE': evalRangeIds(node).forEach(id => out.add(id)); break;
            case 'NEG': collectRefs(node.node, out); break;
            case 'BINOP': collectRefs(node.left, out); collectRefs(node.right, out); break;
            case 'CALL': node.args.forEach(a => collectRefs(a, out)); break;
        }
        return out;
    }

    function evalNode(node, sheet) {
        switch (node.type) {
            case 'NUM': return node.value;
            case 'STR': return node.value;
            case 'CELL': return sheet[node.id] ? sheet[node.id]() : '';
            case 'NEG': return -toNum(evalNode(node.node, sheet));
            case 'BINOP': {
                const l = evalNode(node.left, sheet), r = evalNode(node.right, sheet);
                if (node.op === '+') return toNum(l) + toNum(r);
                if (node.op === '-') return toNum(l) - toNum(r);
                if (node.op === '*') return toNum(l) * toNum(r);
                if (node.op === '/') {
                    const rv = toNum(r);
                    if (rv === 0) throw new Error('division by zero');
                    return toNum(l) / rv;
                }
                break;
            }
            case 'CALL': {
                const fn = FUNCTIONS[node.name];
                if (!fn) throw new Error('unknown function: ' + node.name);
                const args = node.args.map(a => a.type === 'RANGE' ? evalRange(a, sheet) : evalNode(a, sheet));
                return fn(args);
            }
            case 'RANGE': throw new Error('range not allowed here');
        }
        throw new Error('bad node');
    }

    function reaches(dependsOn, from, to, visited) {
        if (from === to) return true;
        if (visited.has(from)) return false;
        visited.add(from);
        for (const next of dependsOn[from]) {
            if (reaches(dependsOn, next, to, visited)) return true;
        }
        return false;
    }

    function commit(state, id, text) {
        const { sheet, raw, dependsOn } = state;
        raw[id] = text;

        if (text.startsWith('=')) {
            let ast;
            try {
                ast = parse(text.slice(1));
            } catch (e) {
                dependsOn[id] = new Set();
                sheet[id](() => '#ERR');
                return;
            }
            const refs = collectRefs(ast);
            const cyclic = [...refs].some(ref => reaches(dependsOn, ref, id, new Set()));
            if (cyclic) {
                dependsOn[id] = new Set();
                sheet[id](() => '#CIRC');
                return;
            }
            dependsOn[id] = refs;
            sheet[id](() => {
                try { return evalNode(ast, sheet); } catch (e) { return '#ERR'; }
            });
            return;
        }

        dependsOn[id] = new Set();
        const trimmed = text.trim();
        if (trimmed !== '' && !isNaN(trimmed)) {
            const n = parseFloat(trimmed);
            sheet[id](() => n);
            return;
        }
        sheet[id](() => text);
    }

    function display(v) {
        if (v === '' || v === undefined) return '';
        if (typeof v === 'number') {
            return Number.isInteger(v) ? String(v) : String(Math.round(v * 10000) / 10000);
        }
        return String(v);
    }

    function Init(ctx, { rows, cols }) {
        const space = ctx.up('[cells-space]');
        const colLabels = Array.from({ length: cols }, (_, i) => colName(i));
        const rowLabels = Array.from({ length: rows }, (_, i) => i + 1);
        const state = createSheet(colLabels, rowLabels);
        space.cellsState = state;

        space.one('[cells-colheads]').varr(colLabels.map(c => ({ label: c })), '[cells-colhead-tpl]');
        space.one('[cells-rows]').varr(rowLabels.map(r => ({
            label: String(r),
            cells: colLabels.map(c => ({ id: c + r })),
        })), '[cells-row-tpl]');

        space.all('[cells-colhead]').forEach(head => {
            head.style.width = `var(--cells-w-${head.attr('cells-colhead')}, 72px)`;
        });
        space.all('[cells-cell]').forEach(input => {
            const id = input.attr('cells-cell');
            const col = id.match(/^[A-Z]+/)[0];
            input.style.width = `var(--cells-w-${col}, 72px)`;
            R(() => {
                const v = state.sheet[id]();
                if (document.activeElement !== input) {
                    input.value = display(v);
                    input.style.textAlign = typeof v === 'number' ? 'right' : 'left';
                }
            });
        });
    }

    function Focus(ctx) {
        const cell = ctx.up('[cells-cell]');
        const state = cell.up('[cells-space]').cellsState;
        cell.value = state.raw[cell.attr('cells-cell')];
        cell.style.textAlign = 'left';
    }

    function Blur(ctx) {
        const cell = ctx.up('[cells-cell]');
        const state = cell.up('[cells-space]').cellsState;
        const id = cell.attr('cells-cell');
        commit(state, id, cell.value);
        cell.value = display(state.sheet[id]());
    }

    function Key(ctx, event) {
        if (event.key === 'Enter') ctx.up('[cells-cell]').blur();
    }

    function ColResizeStart(ctx, event) {
        event.preventDefault();
        const head = ctx.up('[cells-colhead]');
        const space = head.up('[cells-space]');
        const varName = `--cells-w-${head.attr('cells-colhead')}`;
        const startX = event.clientX;
        const startWidth = head.getBoundingClientRect().width;

        const onMove = (e) => {
            space.style.setProperty(varName, Math.max(32, startWidth + e.clientX - startX) + 'px');
        };
        const onUp = () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
        };
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    }

    return { Init, Focus, Blur, Key, ColResizeStart };
})();
