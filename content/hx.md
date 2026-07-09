---
slug: hx
title: "Hx"
type: page
tags: [htmx, ajax]
related: [event-attributes, action-in-context]
track: tools
order: 40
status: draft
---

# Hx

Hx is [htmx](https://htmx.org/), implemented in the Saradom pattern. There is one difference between Hx and htmx: htmx scans the page itself and binds `hx-*` attributes, and Hx wires them through a plain event attribute instead.

<!-- source: Hx/Hx.js -->

```html
<button hx-get="/hello" onclick="hx(this, event)">Load</button>
```

Clicking the button sends an HTTP GET to `/hello`. With no `hx-target` set, the response goes into the element that triggered the request, the button itself, replacing its content.

Hx covers a subset of htmx.

## Attributes

- `hx-get`, `hx-post`, `hx-put`, `hx-delete`, `hx-patch` name the method and the URL.
- `hx-target` names where the response goes.
- `hx-swap` names how it goes in: `innerHTML`, `outerHTML`, `append`, `prepend`, or `none`.
- `hx-select` picks part of the response out, by selector.
- `hx-indicator` names an element shown while the request is in flight.
- `hx-disable` stops the element from triggering a request at all.

## Event binding

`hx(this, event)` is set in the event attribute, the same as any Saradom handler. `event` is optional. It is needed to stop a `<form>`, an `<a>`, or a `<button>` inside a `<form>` from also doing its own submit or navigation.

## Native semantics

A plain `<a href>` sends a GET to that URL, with no `hx-*` attribute needed. A plain `<form>` sends a POST to its `action`, or to the current URL if `action` is missing, with its fields serialized.

## Selectors

`hx-target` and `hx-indicator` take a selector.

`this` is the triggering element.

```html
<button hx-get="/x" hx-target="this" onclick="hx(this, event)">Click</button>
```

The response replaces the button's own content, the same as leaving `hx-target` out entirely.

`find <selector>` looks inside the triggering element.

```html
<div hx-get="/x" hx-indicator="find .loading">
  <span class="loading" style="display:none">Loading...</span>
</div>
```

`hx-indicator` here is set on the `<div>`, so `find .loading` looks inside that `<div>` and finds the `<span>`. It is shown for the duration of the request and hidden again once it settles.

`closest <selector> [subselector]` walks up to the nearest matching ancestor, then optionally back down to a child of it.

```html
<button hx-target="closest .panel .content"></button>
```

This walks up from the button to the nearest `.panel`, then down into that same `.panel` for `.content`. The response lands in `.content`, not in `.panel` itself, and not in some other `.panel` elsewhere on the page.

Anything else is a plain, page-wide selector.

```html
<button hx-target="[output]" hx-get="/x" onclick="hx(this, event)">Click</button>
<div output></div>
```

`[output]` is looked up across the whole document, so the response can land anywhere on the page, not just near the button.

## Tabs

Each button loads its own content into one shared container.

```html
<div tab-space hx-target="closest [tab-space] [tab-content]" hx-swap="innerHTML">
  <button hx-get="/tab/1" onclick="hx(this, event)">Tab 1</button>
  <button hx-get="/tab/2" onclick="hx(this, event)">Tab 2</button>
  <div tab-content></div>
</div>
```

`hx-target` is set once, on `[tab-space]`, and both buttons inherit it by walking up to the nearest ancestor that has it. Clicking `Tab 1` sends a GET to `/tab/1`; clicking `Tab 2` sends one to `/tab/2`. Either way the response walks up to the same `[tab-space]` and back down into `[tab-content]`, replacing it via `innerHTML`. The buttons that triggered the request are never touched.

## Load more

The triggering `<li>` replaces itself with the response, which carries its own next-page trigger.

```html
<ul>
  <li>Agent 1</li>
  <li hx-target="this" hx-get="/contacts/?page=2" hx-swap="outerHTML" hx-indicator="find .htmx-indicator">
    <button onclick="hx(this, event)">Load more</button>
    <img class="htmx-indicator" src="/img/bars.svg" style="display:none">
  </li>
</ul>
```

Clicking `Load more` sends a GET to `/contacts/?page=2` and shows `.htmx-indicator` for the duration. The response swaps in with `outerHTML`, so the whole `<li>`, button and all, is replaced rather than just its content.

The response for `/contacts/?page=2` is itself an `<li>` shaped the same way, wired to page 3:

```html
<li>Agent 2</li>
<li hx-target="this" hx-get="/contacts/?page=3" hx-swap="outerHTML" hx-indicator="find .htmx-indicator">
  <button onclick="hx(this, event)">Load more</button>
  <img class="htmx-indicator" src="/img/bars.svg" style="display:none">
</li>
```

Each response carries the next page's trigger, so "load more" keeps working for as many pages as the backend sends, with no extra wiring on the page.
