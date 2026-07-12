const Ttt = (() => {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

    const Winner = (m) => {
        for (const [a, b, c] of lines) {
            if (m[a] && m[a] === m[b] && m[a] === m[c]) return m[a];
        }
        return null;
    };

    const Turn = (m) => m.filter(Boolean).length % 2 ? 'O' : 'X';

    const Board = (space) => space.one('[ttt-board]');
    const Marks = (space) => Board(space).varr().map(c => c.mark);

    const Status = (space, m) => {
        const winner = Winner(m);
        space.one('[ttt-status]').vset(
            winner ? { winner: { mark: winner } } :
            m.every(Boolean) ? { draw: true } :
            { next: { mark: Turn(m) } }
        );
    };

    const Current = (space) => space.one('[ttt-move][ttt-current]');

    const Select = (move) => {
        move.up('[ttt-space]').all('[ttt-move]').each(m => m.attr('ttt-current', null));
        move.attr('ttt-current', '');
    };

    const Snapshot = (space, m) => {
        const history = space.one('[ttt-history]');
        const index = history.children.length;
        history.vappend([{
            board: m.join(','),
            label: index === 0 ? 'Go to game start' : `Go to move #${index}`,
        }]);
        Select(history.lastElementChild);
    };

    const Play = (ctx) => {
        const space = ctx.up('[ttt-space]');
        const cell = ctx.up('[ttt-cell]');
        const before = Marks(space);
        if (Winner(before) || cell.vget().mark) return;

        const current = Current(space);
        while (current.nextElementSibling) current.nextElementSibling.remove();

        cell.vset({ mark: Turn(before) });

        const m = Marks(space);
        Status(space, m);
        Snapshot(space, m);
    };

    const Jump = (ctx) => {
        const space = ctx.up('[ttt-space]');
        const move = ctx.up('[ttt-move]');
        const m = move.vget().board.split(',');

        Board(space).clear().vappend(m.map(mark => ({ mark })));
        Status(space, m);
        Select(move);
    };

    const Init = (ctx) => {
        const space = ctx.up('[ttt-space]');
        Board(space).vappend(Array.from({ length: 9 }, () => ({ mark: '' })));
        Snapshot(space, Marks(space));
    };

    return { Play, Jump, Init };
})();
