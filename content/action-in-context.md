---
slug: action-in-context
title: "Action in context"
nav_title: "Action in context"
type: concept
tags: [foundations, context, shared-state]
related: [event-attributes, dom-state, sibling-state]
track: foundations
order: 30
status: draft
---

# Action in context

Every event has a current element. That element sets the space where the action runs.

```html
<div counter-space>
  <span counter-value>0</span>
  <button onclick="Counter.Increment(this)">+1</button>
</div>

<script>
Counter.Increment = (ctx) => {
  const space = ctx.closest('[counter-space]');
  const value = space.querySelector('[counter-value]');
  value.textContent = Number(value.textContent) + 1;
};
</script>
```

## Why

One function serves every instance. The same `Counter.Increment` runs for one counter or a hundred. Nothing is created per widget: no instance, no component object. The context is found at click time, from where the event happened. One piece of code covers them all.

The element is passed in, not captured. The handler receives the triggering element as an argument. There is no `this` to bind and no closure to hold the scope.

Nesting is the scope. From that node the rest is reached by walking the DOM: `closest` up to the space, then `querySelector` down to the parts. Identical widgets each keep their own state, scoped by the surrounding markup. There is nothing to wire. The tree that lays out the UI is the same tree that scopes it.

No registry to keep. State is on the element. There is no map from id to a state object. Nothing has to be kept in sync as elements are added or removed. Removing the element leaves nothing behind, because there was never a second copy to clean up.

The call stack is short. The attribute calls the function directly, so a click leads straight into it. The stack trace points at the real code. There is no framework event system or dispatch layer in between.
