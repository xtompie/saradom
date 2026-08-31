---
slug: resizer
title: "Resizer"
type: page
tags: [resize, panel, css-variables]
related: [init, why-jira-is-slow]
track: tools
order: 57
status: draft
---

# Resizer

`<s-resizer>` is a drag handle that resizes a panel. Dragging it sets one CSS variable on
the surrounding space; the layout reads the variable, so CSS stays in charge of the layout
and the element only moves one number.

<!-- source: Resizer/SResizer.js -->

<!-- embed: Resizer/SResizer.js -->
<!-- embed: content/resizer.css -->

<!-- demo: content/resizer/panel.html -->

The wrapper carries `resizer-space` — the element the variable is set on. The handle sits
between the content and the panel, and the panel's CSS uses the variable:

```css
.panel { width: var(--panel-w); }
```

Drag the handle: the variable changes, the panel follows. Nothing else on the page is
touched, and there is no resize loop watching the mouse from JavaScript state — the number
lives in the DOM, like everything else.

## Attributes

On the tag the attributes are bare — the tag is the namespace:

- `var` names the CSS variable, `--panel-w` by default.
- `min` and `max` clamp the width in pixels, 240 and 640 by default.
- `store` names a `localStorage` key. The width is saved when the drag ends and reapplied
  the next time the element connects — the panel keeps its size across visits, with no load
  handler.

On the wrapper the attribute carries the module prefix: `resizer-space`.

## Direction

The width grows as the handle moves left. That is the geometry of a details panel on the
right edge — the shape this element is built for, like the issue panel in the
[Jira demo](why-jira-is-slow.html).

## Mechanism

The drag is pointer events with `setPointerCapture`, so it keeps working when the pointer
leaves the handle mid-drag, and `touch-action: none` makes it behave on touch screens. While
a drag is running the handle carries a `resizing` attribute — a styling hook for the active
state. The element announces itself as `role="separator"`. When there is no `resizer-space`
ancestor, the element does nothing.
