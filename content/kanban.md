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

A kanban board with drag-and-drop, built from several toolkits. Val renders the columns and cards. Compute keeps each column's card count. Vld validates the add and edit form. Drag-and-drop is [SortableJS](https://sortablejs.github.io/Sortable/), a plain third-party library.

SortableJS moves the same DOM nodes Saradom reads. When a card is dragged to another column, the count recomputes, because the new order is already in the DOM. There is no virtual DOM to reconcile, so the library and Saradom write to one real tree.

<div class="kanban-demo">
<script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.6/Sortable.min.js"></script>
<!-- embed: content/kanban.css -->
<!-- embed: Util/Util.js -->
<!-- embed: Val/Val.js -->
<!-- embed: Vld/Vld.js -->
<!-- embed: Compute/Compute.js -->
<!-- embed: content/Kanban.js -->
<!-- embed: content/kanban.html -->
</div>

## State

The whole board is one value. `vget` on the space reads it back as an object, ready to log, save, or send to a server.

```javascript
dom.one('[kanban-space]').vget();
// => { data: [ { title: 'To Do', cards: [ { title: 'Design landing page', color: '#8b5cf6' } ] } ] }
```

<!-- uses: Util/Util.js Val/Val.js Vld/Vld.js Compute/Compute.js https://cdn.jsdelivr.net/npm/sortablejs@1.15.6/Sortable.min.js -->

<!-- code: content/kanban.html -->

<!-- code: content/Kanban.js -->
