---
slug: ux-performance
title: "High UX Performance"
nav_title: "High UX Performance"
type: concept
tags: [foundations, performance, ux]
related: [dom-state, event-attributes]
track: foundations
order: 50
status: draft
---

# High UX Performance

Instant initialization, seamless loading interface, responsive interaction.

State comes ready from the backend. The accordion renders with the first panel open and the
second closed, set by an inline `display:none` in the markup the server sent. The right
state shows before any JavaScript runs.

```html
<div accordion-space>
  <div accordion-item accordion-open>
    <button accordion-head>Shipping</button>
    <div accordion-panel>Ships within 24 hours.</div>
  </div>
  <div accordion-item>
    <button accordion-head>Returns</button>
    <div accordion-panel style="display:none">Free within 30 days.</div>
  </div>
</div>
```

Some components need a moment of setup. A countdown has to start ticking as soon as it
appears. An inline script initializes just this instance, anchored to
`document.currentScript`, without waiting for the rest of the page.

```html
<div countdown-space countdown-until="2026-12-31T23:59:59Z">
  <span countdown-value></span>
  <script>Countdown.Init(document.currentScript)</script>
</div>
```

## Why

Interactive as soon as it parses.
There is no framework runtime to download and run before anything works. The HTML is the
UI and the state is already in it, so the page responds the moment the browser reads it.
Nothing has to boot first.

No hydration.
The markup the server sent is already live. There is no client-side render that re-runs the
UI to attach it, so there is no window where the page looks ready but does not answer.
Server-side rendering is not a feature to add, since there was never a client render to undo.

Sections initialize themselves in place.
An inline `<script>` sets up its own section using `document.currentScript` as the anchor.
There is no global "wait for `DOMContentLoaded`, then query the whole document" pass. Each
part comes alive in place, as the page streams in.

Interaction is a direct DOM write.
A handler changes the element it already has, with no diff, no re-render pass, and no
scheduler between the click and the change. The update is as immediate as the code that
makes it.

## No skeleton screens

A skeleton screen is gray boxes shown while the app loads. It hides slow loading instead of
fixing it. It fakes speed. A fast page has no use for it.
