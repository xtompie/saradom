---
slug: notify
title: "Notify"
type: page
tags: [communication, events, dom-state]
related: [action-in-context, modularization, val]
track: tools
order: 50
status: draft
---

# Notify

Notify lets elements on a page tell each other that something changed. `nup` (short for notify up) sends a signal up through the ancestors; `ndown` (notify down) sends it down through the descendants. A listener is an attribute that holds a callback, run when the signal reaches it. Two calls and an attribute are enough to wire a page's pieces together.

<!-- source: Notify/Notify.js -->

<!-- embed: Util/Util.js -->
<!-- embed: Notify/Notify.js -->

## Up and down

A button and a display next to each other are siblings, so the button cannot reach the display on its own. The signal goes up to the parent they share, and the parent sends it back down. There is no script for the widget itself; the only JavaScript is `nup` and `ndown` in the toolkit.

<!-- demo: content/notify/counter.html -->

## Carrying data

A signal can carry a value. It arrives as the callback's argument, and each hop passes it along.

<!-- demo: content/notify/data.html -->

## Stopping at a boundary

A third argument is a selector where the walk stops. `nup` runs listeners up to it but not past it; `ndown` will not descend into it. You reach for it only when a widget is nested inside another of the same kind, so each keeps its signals to itself.

```html
<button onclick="this.nup('counter-onclick', 1, '[counter-space]')">+1</button>
```

## Ancestor context

The select and the package never name each other. A control announces its change as a small patch up; the space owns the reaction — it is the only writer, merging the patch into its `configurator-val-*` namespace with `attrs` and signalling its dependents down to re-check. The package reads that bag and decides on its own whether to stay available. Every parameter rides the same channel, so adding a second control changes nothing about the wiring — and because each change flows through the space before it is stored, that one handler is where a value could later be vetoed or the configuration's invariants defended.

<!-- demo: content/notify/configurator.html -->

## Select all

A checkbox has a third state beside on and off: indeterminate, drawn as a dash, for "some but not all". Only the part that has to stay decoupled goes through Notify: an item announces that it changed, and the header, listening, refreshes itself. Setting every item is the header's own job — it owns them, so it finds them by attribute and sets them directly, with no signal. And a listener does not have to be an inline expression: here it calls a small module, whose functions resolve what they need from the element they are handed.

<!-- demo: content/notify/select-all.html -->
