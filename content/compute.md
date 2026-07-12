---
slug: compute
title: "Compute"
type: page
tags: [derived, dom-state, action-in-context]
related: [notify, val, action-in-context]
track: tools
order: 55
status: draft
---

# Compute

Compute watches the elements under a root and re-runs a callback when one is added or removed below it. The callback is an attribute that reads the DOM and writes a value, such as a count. Nothing runs until `el.compute('name')` is called. That call does the first run and starts the watch.

<!-- source: Compute/Compute.js -->

<!-- embed: Util/Util.js -->
<!-- embed: Val/Val.js -->
<!-- embed: Compute/Compute.js -->

<!-- demo: content/compute/boxes.html -->

## Call

`el.compute('boxes-total')` runs the callback once and starts the watch. The caller names the attribute. By default the watch reaches every element under the root. A value read from two lists is placed on the element that holds both. A change in either list runs it again.

## Batching

Changes are grouped. Fifty boxes added in one step cause one run, not fifty. The run happens right after the change, in a [microtask](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide).

## Options

`el.compute(name, opts)` takes a second argument. `debounce` waits for a quiet gap in milliseconds before a run. Rapid changes spread across many ticks then cause one run, not one each. `subtree` set to false limits the watch to the root's direct children. A shallow list is watched with less work. The first run at the call is always immediate.

```js
el.compute('boxes-total', { debounce: 100 })
el.compute('boxes-total', { subtree: false })
```

## Use

Compute fits a value read from a changing set of elements, like items in a cart or results appended after a fetch. `debounce` helps when those elements arrive in bursts, such as a streamed or paginated list. A value that depends on an input's text is a different job. Typing changes a property, not the DOM. An input event fits there, not Compute.

## Mechanism

Compute puts one [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) on the root. It stores the observer on the element in `el._compute`. A second call for the same attribute is skipped. The observer is turned off during a run and turned back on after. Its own writes then do not trigger it. Compute does not track a state object. It reacts to the DOM, whatever changed it.
