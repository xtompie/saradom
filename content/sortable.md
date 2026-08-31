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
<!-- uses: Sortable/SSortable.js Init/SInit.js https://cdn.jsdelivr.net/npm/sortablejs@1.15.6/Sortable.min.js -->

<script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.6/Sortable.min.js"></script>
<!-- embed: Sortable/SSortable.js -->
<!-- embed: Init/SInit.js -->
<!-- embed: content/sortable.css -->

<!-- demo: content/sortable/list.html -->

The tag is the whole setup. Every direct child is draggable. Reordering animates by default;
`animation` on the tag sets the duration in milliseconds.

A drag can be limited to one part of each item: `handle` names a selector, and only that part
starts the drag. The rest of the item stays clickable, selectable, a link.

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
carries its name in `sort-item`. When a drag ends, the element collects the `sort-item`
names in DOM order and saves the array under the key.

`restore()` reorders the children from the saved array. An [`<s-init>`](init.html) as the
last child calls it during parsing, before the page renders further — the order comes back
with no flicker and no load handler:

<!-- demo: content/sortable/store.html -->

Reorder the list, reload the page: the order holds. The list may also arrive later, inside an
[Hx](hx.html) fragment — custom elements upgrade on insertion, so both the dragging and the
restore work in a fragment without any wiring.

On the element's own tag the attributes are bare: `group`, `handle`, `store`. On other
elements they carry the module prefix: `sort-item`. The tag itself is the scope.

## Reacting to a drop

`onsort` runs after a drop, like a native event attribute: `this` is the element, `event` is
the SortableJS end event, with `oldIndex` and `newIndex` on it. The order is already in the
DOM by then, so the handler reads the list, not the event, when it wants the result — or
hands the work to another toolkit:

```html
<s-sortable onsort="hx(this)" hx-post="/reorder"
            hx-vals-body="() => ({ order: this.all('[sort-item]').map((el) => el.attr('sort-item')) })">
```

Sortable never heard of Hx. One attribute connects a drop to a POST with the new order.

## Mechanism

`connectedCallback` creates the SortableJS instance on the element; `disconnectedCallback`
destroys it. An element removed and re-inserted — a fragment swap, a modal — wires itself
again on its own. When the global `Sortable` is missing, the element does nothing, so the
page degrades to a static list instead of throwing.

## Support

The element needs SortableJS loaded first — one `<script>` tag before the lists, or before
`SSortable.js` itself. Everything else is standard custom elements, in every evergreen
browser.
