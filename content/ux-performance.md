---
slug: ux-performance
title: "UX Performance"
nav_title: "UX Performance"
type: concept
tags: [foundations, performance, ux]
related: [dom-state, event-attributes]
track: foundations
order: 50
status: draft
---

# UX Performance

The interface works as soon as the page loads. It does not wait for a JavaScript init like DOMContentLoaded.

State comes ready from the backend. The right state shows before any JavaScript runs.

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

Some components need a moment of setup. A countdown has to start ticking as soon as it appears. An inline script sets up just this instance, anchored to `document.currentScript`. It does not wait for the rest of the page.

```html
<div countdown-space countdown-until="2026-12-31T23:59:59Z">
  <span countdown-value></span>
  <script>Countdown.Init(document.currentScript)</script>
</div>
```

## Why

Interactive as soon as it parses. There is no framework runtime to download and run first. The HTML is the UI, with the state already in it. The page responds the moment the browser reads it.

No hydration. There is no client-side render that re-runs the UI to attach it. There is no window where the page looks ready but does not answer. Server-side rendering is not a feature to add, because there was never a client render to undo.

Sections initialize themselves in place. An inline `<script>` sets up its own section using `document.currentScript` as the anchor. There is no global pass that waits for `DOMContentLoaded`, then queries the whole document. Each part starts in place, as the page streams in.

Interaction is a direct DOM write. A handler changes the element it already has. There is no diff and no scheduler between the click and the change. The update is as immediate as the code that makes it.

## Skeletons

A skeleton screen is gray boxes shown while the app loads. It hides slow loading instead of fixing it. A fast page has no use for it.
