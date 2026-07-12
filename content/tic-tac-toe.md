---
slug: tic-tac-toe
title: "Tic-tac-toe"
type: example
tags: [example, dom-state, time-travel, val]
related: [dom-state, val, produce]
track: examples
order: 30
status: draft
---

# Tic-tac-toe

The [React tutorial](https://react.dev/learn/tutorial-tic-tac-toe) builds this game to teach lifting state up, immutability, list keys, and time travel. Most of those are the cost of holding state in JavaScript. Here the state is in the DOM, so they never come up. What is left is the game itself: whose turn it is, who won, and a history to step back through.

<div class="tictactoe-demo">
<!-- embed: content/tic-tac-toe.css -->
<!-- embed: Util/Util.js -->
<!-- embed: Val/Val.js -->
<!-- embed: content/tic-tac-toe.js -->
<!-- embed: content/tic-tac-toe.html -->
</div>

<!-- uses: Util/Util.js Val/Val.js -->

<!-- code: content/tic-tac-toe.html -->

<!-- code: content/tic-tac-toe.js -->

Each handler takes the event's `ctx` and resolves what it needs through the contract. `Play` calls `ctx.up('[ttt-cell]')` to find its cell. `up` returns the element itself when it already matches, so the cell is looked up, not assumed. The mark is read and written through `val`, not touched as raw text. Whose turn it is isn't stored anywhere — it's the parity of the marks on the board — and who won is read off the same nine cells; both are computed when needed, never held. There is no board array in JavaScript to keep in agreement with the screen. The nine cells are the board, and the only state there is. Nothing is lifted, nothing is copied.

Winning is the one piece of real game logic, and it is the same plain function React uses: eight lines, checked for three equal marks. Its input is the nine cells read from the DOM.

## Time travel

Every move appends an entry to `[ttt-history]`, carrying a snapshot of the board read straight off the cells, as its own DOM state. The active entry is marked with `ttt-current`.

Clicking an entry runs `Jump`. It writes that snapshot back into the cells and moves `ttt-current` there; the turn simply follows from the restored board. The later entries stay. The board is back in the past, but the future is still in the history, so a step forward still works. Only when a move is played from a past point does `Play` drop every entry after the current one, and the new move starts a fresh line. That is a real timeline that branches, not an eager delete.

There is no move index into an immutable array, and no store to rewind. The past is a list of real nodes. Going back is reading one of them.
