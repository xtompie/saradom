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

**In an attribute**

```html
<div todo-item-status="done">
```

**In an input's value**

```html
<input type="text" todo-add-text value="Buy milk"/>
```

**In the element's content**

```html
<span todo-item-text>Take out the trash</span>
```

**In a `data-*` attribute (`dataset`)**

```html
<div data-status="done">
```

**On the element as a `_`-prefixed JS property** (e.g. a timer handle)

```javascript
el._timer = setTimeout(fn, 2000);
clearTimeout(el._timer);
```

## Why

State is only what has to change.
A value in a field, an item marked done, a panel that opens. That is what the front holds,
and nothing more. It does not mirror the backend model. When the interface only needs a
piece of HTML, that piece is all it should know, not the private fields of the user behind
it.

No state to synchronize.
When state lives in a JavaScript variable, the DOM is a copy of it, and every change
has to be pushed from the variable to the DOM to keep the two in agreement. Keeping that
copy in sync is the problem reactivity exists to solve. Here the DOM *is* the state, so
there is one copy and nothing to synchronize.

No reactivity runtime.
React, Vue, and Alpine ship a runtime whose job is to watch state and re-render when it
changes: a virtual-DOM diff, a reactive proxy, a dependency graph. That is code to
download and work to do on every update. Saradom ships none of it. A handler writes straight
to the element it already has.

No initialization or hydration.
A framework has to boot its UI: build the component tree, attach the state, and hydrate
server HTML by re-running the components on the client. Until hydration finishes the page
can look ready while not responding. There is nothing to boot here. The HTML the browser
parsed is already the live, stateful UI.

State arrives as HTML from the backend.
State travels inside the markup, so a fragment from the server already carries it. The
fragment goes straight into the page and works, with no extra step to load the data first.

Search-engine ready.
A server-rendered page is real, crawlable HTML, because the state is already text and
attributes in the markup. Search engines read it directly, with no client render to wait
for.

State survives moving and cloning.
It lives on the node, so moving an element, cloning a `<template>`, or reordering a list
carries the state along with it. There is no external map keyed by id to update whenever
the structure changes.

Visible in the browser.
The current state is right there in the browser's Elements panel. Reading it means looking
at the DOM, not inspecting a framework's internal store.
