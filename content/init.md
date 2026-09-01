---
slug: init
title: "Init"
type: page
tags: [init, custom-elements, ux-performance]
related: [ux-performance, hx]
track: tools
order: 42
status: draft
---

# Init

`<s-init>` runs one line of code at the place it sits, the moment the parser reaches it. No
`DOMContentLoaded`, no deferred script that queries the page later — the code runs during
parsing, so what it sets up is in place before first paint.

<!-- source: Init/SInit.js -->

```html
<form>
  <input name="q">
  <s-init run="(el) => el.querySelector('input').focus()"></s-init>
</form>
```

`run` is evaluated with `this` = the parent element, and the parent is also passed as the
argument. Here the search field has focus the moment it appears.

## Last child

A custom element upgrades before its children are parsed, so an `<s-init>` that acts on its
siblings goes **after** them. As the last child it runs when everything before it exists,
and still before the page renders on.

## In fragments

A `<script>` inserted with an [Hx](hx.html) fragment does not execute. A custom element
upgrades on insertion, so `<s-init>` does run — a server response can carry one line of
behavior.

## Once

The element runs its code once. Moving the node later does not run it again.
