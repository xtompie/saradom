---
slug: sortable
title: "Sortable"
type: page
tags: [drag-and-drop, sortablejs, dom-state]
related: [kanban, why-jira-is-slow]
track: tools
order: 58
status: draft
---

# Sortable

`<s-sortable>` makes its children draggable. It is a custom element wrapping
[SortableJS](https://sortablejs.github.io/Sortable/), so a list drags as soon as the element
connects — no init call, no `DOMContentLoaded` handler. It moves the same DOM nodes the rest
of the page reads: after a drop the new order is already in the DOM, and anything that reads
the list sees it.

<!-- source: Sortable/SSortable.js -->

<script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.6/Sortable.min.js"></script>
<!-- embed: Sortable/SSortable.js -->
<!-- embed: content/sortable.css -->

<!-- demo: content/sortable/list.html -->

Every direct child is draggable. Reordering animates; `animation` sets the duration in
milliseconds.

`handle` names a selector — only that part starts the drag, the rest of the item stays
clickable.

```html
<s-sortable handle="[grip]">
    <a href="/jira"><span grip>⠿</span> Jira</a>
    <a href="/confluence"><span grip>⠿</span> Confluence</a>
</s-sortable>
```

## Between lists

Lists that share a `group` name exchange items. Drag from one list, drop into the other —
SortableJS moves the node, and the node lands in the other list's DOM.

<!-- demo: content/sortable/group.html -->

When several independent widgets with the same group sit on one page — two kanban boards, say
— `boundary` keeps them apart. It names a selector; an item moves only between lists under
the same closest `boundary` ancestor. The [Kanban example](kanban.html) uses
`boundary="[kanban-space]"` for exactly this.

## Remembering the order

`store` persists the order across visits. The tag names a `localStorage` key, and each child
carries its name in `sort-item`. When a drag ends, the element saves the `sort-item` names
in DOM order under the key. On connect it puts the saved order back by itself — also while
the page is still parsing, so there is no flicker and no load handler:

<!-- demo: content/sortable/store.html -->

Reorder the list, reload the page: the order holds. The list may also arrive later, inside an
[Hx](hx.html) fragment — custom elements upgrade on insertion, so dragging and restoring work
in a fragment without any wiring.

On the element's own tag the attributes are bare: `group`, `handle`, `store`. On other
elements they carry the module prefix: `sort-item`. The tag itself is the scope.

## Reacting to a drop

`onsort` runs after a drop, like a native event attribute: `this` is the element, `event` is
the SortableJS end event, with `oldIndex` and `newIndex` on it. The new order is already in
the DOM by then, so the handler reads the list — for example to POST it with [Hx](hx.html):

```html
<s-sortable onsort="hx(this)" hx-post="/reorder"
            hx-vals-body="() => ({ order: this.all('[sort-item]').map((el) => el.attr('sort-item')) })">
```

## Mechanism

`connectedCallback` creates the SortableJS instance on the element; `disconnectedCallback`
destroys it. An element removed and re-inserted — a fragment swap, a modal — wires itself
again on its own. When the global `Sortable` is missing, the element does nothing, so the
page degrades to a static list instead of throwing.

## Support

The element needs SortableJS loaded first — one `<script>` tag before the lists, or before
`SSortable.js` itself. Everything else is standard custom elements, in every evergreen
browser.
