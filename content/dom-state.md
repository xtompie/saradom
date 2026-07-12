---
slug: dom-state
title: "DOM State"
type: concept
tags: [foundations, state]
related: [event-attributes]
track: foundations
order: 10
status: draft
---

# DOM State

State is stored in the DOM.
State is not stored in JavaScript variables.

In an attribute:

```html
<div todo-item-status="done">
```

In an input's value:

```html
<input type="text" todo-add-text value="Buy milk"/>
```

In the element's content:

```html
<span todo-item-text>Take out the trash</span>
```

In a `data-*` attribute (`dataset`):

```html
<div data-status="done">
```

On the element as a `_`-prefixed JS property, like a timer handle:

```javascript
el._timer = setTimeout(fn, 2000);
clearTimeout(el._timer);
```

## Why

State is only what has to change. A value in a field, or an item marked done. It does not mirror the backend model.

One source of truth. The DOM is the state. There is nothing to keep in sync, and no reactivity runtime to download or run on every update.

Instantly interactive. The HTML the browser parsed is already the live UI. There is no boot step, and no hydration gap where the page looks ready but does not respond.

Works with the backend. A fragment from the server already has its state. It goes into the page and works, with no step to load data first. The same HTML is real text, so search engines read it directly.

State travels with the node. Moving or cloning an element keeps its state. There is no external map keyed by id to update.

Debug by reading the DOM. The current state is in the DOM, not a framework's internal store.
