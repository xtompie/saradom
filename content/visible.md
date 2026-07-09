---
slug: visible
title: "Visible"
type: example
tags: [example, dom-state]
related: [dom-state, event-attributes, modularization]
track: examples
order: 5
status: draft
---

# Visible

Show one set of elements and hide the rest. The current mode is written to the DOM as `visible-state`. The active view is readable there, with no JavaScript variable holding it.

Regions carry a `visible-tag` inside a shared `visible-space`. `Visible.Visible(ctx, tags)` shows every `[visible-tag]` listed in `tags`, hides the others, and writes `tags` to `visible-state`. `Visible.Toggle(ctx, when, then, otherwise)` reads that state. When it includes `when` the `then` set is shown, else the `otherwise` set.

<!-- source: Visible/Visible.js -->

## Tabs

One panel shows at a time. Each button selects its tag.

<!-- demo: content/visible-tabs.html -->

## Accordion

Each header toggles its panel. Opening one closes the rest.

<!-- demo: content/visible-accordion.html -->

## Radio with an "Other" option

The extra input shows only when Other is selected.

<!-- demo: content/visible-radio.html -->

## Lanes

Several `Visible` mechanisms can work on the same elements at once. A `visible-space` names a `visible-lane`, and each tag belongs to that lane; a call touches only the tags in its space's lane and leaves the others alone. Nest the spaces and a hidden outer layer hides its inner one, so an element shows only when every lane shows it — the intersection comes from the nesting, not from merging state on one node.

```html
<div visible-space visible-lane="mode" visible-state="grid">
  <button onclick="Visible.Visible(this, ['grid'])">Grid</button>
  <button onclick="Visible.Visible(this, ['list'])">List</button>

  <div visible-tag="grid" visible-lane="mode">
    <div visible-space visible-lane="size" visible-state="lg">
      <div visible-tag="lg" visible-lane="size">shown only when both lanes show it</div>
    </div>
  </div>
</div>
```

Without `visible-lane`, a space touches every `[visible-tag]` inside it — the original behavior, unchanged.

<!-- embed: content/visible.css -->
<!-- embed: Visible/Visible.js -->
