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

Compute watches the elements under a root and re-runs a callback when one is added or removed below it. The root is an `<s-compute>` element. The callback is its `run` attribute. The callback reads the DOM and writes a value, such as a count. The watch starts when the element connects. No call starts it.

<!-- source: Compute/SCompute.js -->

<!-- embed: Util/Util.js -->
<!-- embed: Compute/SCompute.js -->

<!-- demo: content/compute/boxes-v2.html -->

An earlier form, [Compute V1](compute-v1.html), is method-based. It needs `compute()` to start and `uncompute()` to stop. The element form needs neither. It starts when it connects. It stops when it leaves the DOM.

## Batching

Changes are grouped. Fifty boxes added in one step cause one run, not fifty. The run happens right after the change, in a [microtask](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide).

## Options

`debounce` and `shallow` are attributes. `debounce` waits for a quiet gap in milliseconds before a run. Rapid changes spread across many ticks then cause one run, not one each. `shallow` limits the watch to the element's direct children. A shallow list is watched with less work. The first run does not wait for the debounce gap.

```html
<s-compute run="..." debounce="100"></s-compute>
<s-compute run="..." shallow></s-compute>
```

## Use

Compute fits a value read from a changing set of elements, like items in a cart or results appended after a fetch. `debounce` helps when those elements arrive in bursts, such as a streamed or paginated list. A value that depends on an input's text is a different job. Typing changes a property, not the DOM. An input event fits there, not Compute.

## Mechanism

Compute puts one [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) on the element. The observer is turned off during a run and turned back on after. Its own writes then do not trigger it. An element in the initial HTML runs first when the page has parsed. An element added later runs when it connects. The element disconnects the observer when it leaves the DOM. Compute does not track a state object. It reacts to the DOM, whatever changed it.

## Nesting

An `<s-compute>` may hold another. The outer one watches the inner part as well. A write by one is a DOM change the other sees. Left alone, the two run each other without end. A callback that writes only on a change stops this. It reads the value, compares it to the current one, and writes when they differ.

```html
<s-compute run="() => {
    const n = this.all('[item]').length
    const el = this.one('[total]')
    if (el.textContent != n) el.textContent = n
}">
    <span total>0</span>
    <ul><!-- [item] rows --></ul>
</s-compute>
```

A callback that never settles needs a `guard`. A run that inserts a random value never matches its last write. A count raised by one never matches it either. The idempotent check then never stops. `guard` is an attribute run before `run`. It returns true or false. `run` happens only on true. A guard is absent by default, and the run then always happens. The author writes the condition.

```html
<s-compute
    guard="() => this.all('[item]').length !== this._n"
    run="() => { this._n = this.all('[item]').length; bump() }"
>
    <ul><!-- [item] rows --></ul>
</s-compute>
```
