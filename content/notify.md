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

Notify lets elements on a page tell each other that something changed. `nup` (short for notify up) sends a signal up through the ancestors. `ndown` (notify down) sends it down through the descendants. A listener is an attribute that holds a callback, run when the signal reaches it. Two calls and an attribute are enough to wire a page's pieces together.

<!-- source: Notify/Notify.js -->

<!-- embed: Util/Util.js -->
<!-- embed: Notify/Notify.js -->

## Direction

A button and a display next to each other are siblings, so the button cannot reach the display on its own. The signal goes up to the parent they share, and the parent sends it back down. There is no script for the widget itself. The only JavaScript is `nup` and `ndown` in the toolkit.

<!-- demo: content/notify/counter.html -->

## Data

A signal can carry a value. It arrives as the callback's argument, and each hop passes it along.

<!-- demo: content/notify/data.html -->

## Boundary

A third argument is a selector where the walk stops. `nup` runs listeners up to it but not past it. `ndown` will not descend into it. It is only needed when a widget is nested inside another of the same kind, so each keeps its signals to itself.

```html
<button onclick="this.nup('counter-onclick', 1, '[counter-space]')">+1</button>
```

## Ancestor context

The control and the package never name each other. A control sends its change up as a small patch. The space owns the state and is its only writer. It merges the patch into its `configurator-val-*` attributes with `attrs`, then signals its dependents down to re-check. The package reads those attributes and decides on its own whether to stay available. Every parameter uses the same channel, so adding a second control needs no new wiring. Each change goes through the space before it is stored. That one handler is where a value could later be vetoed, or the configuration's rules enforced.

<!-- demo: content/notify/configurator.html -->

## Clear

A Clear button empties fields elsewhere in the form. The click goes up to the form as one signal. The form passes it down, and each field clears itself. There is no module: the whole feature is three short attributes.

<!-- demo: content/notify/clear.html -->
