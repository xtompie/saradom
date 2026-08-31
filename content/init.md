---
slug: init
title: "Init"
type: page
tags: [init, custom-elements, ux-performance]
related: [sortable, ux-performance]
track: tools
order: 42
status: draft
---

# Init

`<s-init>` runs one line of code at the place it sits in the page, at the moment the parser
reaches it. It is the in-place init primitive: no `DOMContentLoaded`, no `defer`, no script
that queries the page later. The code runs during parsing, before the browser renders
further, so whatever it sets up is in place on first paint.

<!-- source: Init/SInit.js -->

```html
<s-sortable store="app-switcher">
  <a sort-item="jira" href="#">Jira</a>
  <a sort-item="confluence" href="#">Confluence</a>
  <s-init run="(el) => el.restore()"></s-init>
</s-sortable>
```

`run` holds the code. It is evaluated with `this` = the parent element, and the parent is
also passed as the argument. Here it calls [Sortable](sortable.html)'s `restore()` on the
list, and the saved order is applied before the list is ever painted — no flicker.

## Last child

A custom element upgrades before its children are parsed, so an `<s-init>` that acts on its
siblings goes **after** them. As the last child it runs when everything before it exists,
and still before the page renders on. That ordering is the whole API.

## In fragments

Custom elements upgrade on insertion too. An `<s-init>` inside an [Hx](hx.html) fragment
runs when the fragment lands in the DOM. A server response can carry one line of behavior
this way — for example, re-counting unread notifications after a "mark as read" swap — and
the page needs no listener wired in advance.

## Once

The element runs its code once and marks itself done. Moving the node later — a drag, a
re-append — does not run it again.
