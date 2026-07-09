---
slug: event-attributes
title: "Event attributes"
nav_title: "Event attributes"
type: concept
tags: [foundations, events, locality]
related: [dom-state, action-in-context, modularization]
track: foundations
order: 20
status: draft
---

# Event attributes

Events are set in HTML attributes.
Events are not dynamically bound with addEventListener.

```html
<button onclick="Todo.Add(this)">Add</button>
```

## Why

The handler needs no wiring.
The element is interactive as soon as it exists. The handler is in the markup, so it is on the element the moment the browser parses it,
and just as much on markup that appears later. Cloning a `<template>`, inserting a
fragment from the server, or reordering a list leaves it in place, and the new nodes are
live at once. There is no `DOMContentLoaded`, `querySelector`, or `addEventListener` to
run first, and no re-binding, event delegation, or `MutationObserver` to cover elements
that show up afterward.

No lifecycle to track.
The `addEventListener` model comes with bookkeeping: handlers have to be removed to avoid
leaks, and tracked so the same one is not bound twice. Here removing the element removes
its handler, and nothing is attached in the first place, so there is no double binding to
guard against and nothing to keep matched.

What runs, and in what order, is on the element.
The trigger and the call are in the same place. Reading the button shows which function
runs and which module owns it, with no hunting through JavaScript. When more than one
thing has to happen, the order is written in the attribute, not left to the order
listeners happened to be registered in.

No inversion of control.
With `addEventListener` the wiring lives somewhere else, which makes it hard to debug:
who attached this handler, when, and why it did not attach. In the attribute the answer
is on the element, available at once.
