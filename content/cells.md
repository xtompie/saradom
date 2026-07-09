---
slug: cells
title: "Cells"
type: example
tags: [example, dom-state, val, rensen]
related: [val, rensen, dom-state]
track: examples
order: 50
status: draft
---

# Cells

A small spreadsheet.

<div class="cells-demo">
<!-- embed: content/cells.css -->
<!-- embed: Util/Util.js -->
<!-- embed: Val/Val.js -->
<!-- embed: Rensen/Rensen.js -->
<!-- embed: content/Cells.js -->
<!-- embed: content/cells.html -->
</div>

## Formulas

A cell holds a number, a text, or a formula starting with `=`, such as `=A1+B2` or `=SUM(A1:A5)`.

- Arithmetic: `+`, `-`, `*`, `/`, and parentheses.
- A cell reference, such as `A1`.
- A range, such as `A1:A5`, meaning every cell from `A1` to `A5`.
- `SUM(range)`: adds the numbers in a range.
- `CONCAT(a, b, ...)`: joins values into one string.
- `UPPER(text)`: makes a string upper case.
- `LOWER(text)`: makes a string lower case.
- `LEN(text)`: the length of a string.

A formula that fails to parse, or throws while it runs, such as dividing by a string, shows `#ERR`. A formula that reads its own cell, directly or through others, shows `#CIRC` instead.

A number is right-aligned. Anything else, a string or an error code, is left-aligned.

<!-- uses: Util/Util.js Val/Val.js Rensen/Rensen.js -->

<!-- code: content/cells.html -->

<!-- code: content/Cells.js -->

`Cells.Init(ctx, { rows, cols })` generates the column letters itself, A to Z then AA, AB, and on. Every cell exists from the start. None is created on demand.

A column's width lives as one CSS custom property on the space element, such as `--cells-w-A`. Every cell in that column reads its width from that same variable, so dragging the handle between two headers resizes the whole column at once, not one cell at a time.

Each cell is a [Rensen](rensen.html) value: `sheet['A1'] = R(() => ...)`. A formula reads other cells by calling them, so `R(() => sheet['A1']() + sheet['B1']())` recomputes whenever `A1` or `B1` changes. Rensen tracks that dependency. Cells never wires it by hand.

A formula is read by a small parser written for this page, not by `eval`. A cycle never reaches Rensen: Cells keeps its own map of which cell reads which, and checks it for a cycle before a new formula is written in.

The reactive graph cannot be written as an HTML attribute, so it is kept as a plain object, `{ sheet, raw, dependsOn }`, stored as a property on the space element: `space.cellsState`. Two `[cells-space]` elements on one page hold two separate sheets. Neither an id nor a registry is used.
