---
slug: kanban
title: "Kanban"
type: example
tags: [example, dom-state, drag-and-drop, sortable]
related: [dom-state, action-in-context, tic-tac-toe]
track: examples
order: 40
status: draft
---

# Kanban

A drag-and-drop board in plain HTML and JavaScript.

<div class="kanban-demo">
<script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.6/Sortable.min.js"></script>
<!-- embed: content/kanban.css -->
<!-- embed: Util/Util.js -->
<!-- embed: Val/Val.js -->
<!-- embed: Vld/Vld.js -->
<!-- embed: Compute/SCompute.js -->
<!-- embed: Sortable/SSortable.js -->
<!-- embed: content/Kanban.js -->
<!-- embed: content/kanban.html -->
</div>

## Three models, one per lane

The board is one value. The modal holds two more — its interface, and the card being edited — kept apart by lane. Each is read from its own element with a bare `vget`.

```javascript
dom.one('[kanban-space]').vget(); // { data: [ { title, cards: [ { title, color } ] } ] }
dom.one('[kanban-modal]').vget(); // { anchor, mode, hidden }
dom.one('[kanban-form]').vget();  // { title, color }
```

The board value is ready to log, save, or send to a server; the modal's two models never leak into it.

## Drag-and-drop

Drag-and-drop is [SortableJS](https://sortablejs.github.io/Sortable/), wrapped in an `<s-sortable>` element so a list drags as soon as it connects. It moves the same DOM nodes Saradom reads, so dropping a card in another column recomputes that column's count — the order is already in the DOM, with no virtual tree to reconcile. The `boundary` attribute keeps two boards on one page apart: a card moves only between lists under the same `[kanban-space]`.

<!-- uses: Util/Util.js Val/Val.js Vld/Vld.js Compute/SCompute.js Sortable/SSortable.js https://cdn.jsdelivr.net/npm/sortablejs@1.15.6/Sortable.min.js -->

<!-- code: content/kanban.html -->

<!-- code: content/Kanban.js -->
