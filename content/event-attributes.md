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

The handler needs no wiring. It is in the markup, so the element is interactive the moment the browser parses it. Markup that appears later is live at once, whether it is cloned or inserted from the server. There is no `DOMContentLoaded` or `addEventListener` to run first. There is no event delegation or `MutationObserver` to cover elements that appear later.

No lifecycle to track. The `addEventListener` model comes with bookkeeping. Handlers have to be removed to avoid leaks. They have to be tracked so the same one is not bound twice. Here removing the element removes its handler. Nothing is attached in the first place. There is nothing to track and no double binding to guard against.

Behaviour is on the element. Reading the button shows which function runs and which module owns it, without searching through JavaScript. When more than one thing has to happen, the order is written in the attribute, not left to registration order. With `addEventListener` the wiring is somewhere else, so debugging is harder. Here the answer is on the element.
