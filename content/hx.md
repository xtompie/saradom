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

Hx is [htmx](https://htmx.org/), implemented in the Saradom pattern. It covers a subset of htmx. There is one difference in how the attributes are bound. htmx scans the page and binds `hx-*` attributes itself. Hx wires them through a plain event attribute instead.

<!-- source: Hx/Hx.js -->

```html
<button hx-get="/hello" onclick="hx(this, event)">Load</button>
```

Clicking the button sends an HTTP GET to `/hello`. With no `hx-target`, the response goes into the element that triggered the request. Here that is the button, and its content is replaced.

## Attributes

- `hx-get`, `hx-post`, `hx-put`, `hx-delete`, `hx-patch` name the method and the URL.
- `hx-target` names where the response goes.
- `hx-swap` names how it goes in: `innerHTML`, `outerHTML`, `append`, `prepend`, or `none`.
- `hx-select` picks part of the response, by selector.
- `hx-indicator` names an element shown while the request runs.
- `hx-disable` stops the element from triggering a request.

## Event binding

`hx(this, event)` is set in the event attribute, the same as any Saradom handler. `event` is optional. It is needed to stop a `<form>` or an `<a>` from also running its own submit or navigation.

## Native semantics

A plain `<a href>` sends a GET to that URL, with no `hx-*` attribute needed. A plain `<form>` sends a POST to its `action`, with its fields serialized. If `action` is missing, it posts to the current URL.

## Selectors

`hx-target` and `hx-indicator` take a selector.

`this` is the triggering element.

```html
<button hx-get="/x" hx-target="this" onclick="hx(this, event)">Click</button>
```

The response replaces the button's own content, the same as leaving `hx-target` out.

`find <selector>` looks inside the triggering element.

```html
<div hx-get="/x" hx-indicator="find .loading">
  <span class="loading" style="display:none">Loading...</span>
</div>
```

`hx-indicator` here is set on the `<div>`, so `find .loading` looks inside it and finds the `<span>`. The `<span>` is shown while the request runs, then hidden.

`closest <selector> [subselector]` walks up to the nearest matching ancestor, then optionally back down to a child of it.

```html
<button hx-target="closest .panel .content"></button>
```

This walks up from the button to the nearest `.panel`, then down into that same `.panel` for `.content`. The response lands in that `.content`, not in another `.panel` on the page.

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

`hx-target` is set once, on `[tab-space]`. Both buttons inherit it by walking up to the nearest ancestor that has it. Each response walks up to the same `[tab-space]`, then back down into `[tab-content]`, and replaces it via `innerHTML`. The buttons that triggered the request are never touched.

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

Clicking `Load more` shows `.htmx-indicator` while the request runs. The response swaps in with `outerHTML`, so the whole `<li>` is replaced, button and all, not just its content.

The response is itself an `<li>` shaped the same way, wired to page 3:

```html
<li>Agent 2</li>
<li hx-target="this" hx-get="/contacts/?page=3" hx-swap="outerHTML" hx-indicator="find .htmx-indicator">
  <button onclick="hx(this, event)">Load more</button>
  <img class="htmx-indicator" src="/img/bars.svg" style="display:none">
</li>
```

Each response carries the next page's trigger, so "load more" keeps working for as many pages as the backend sends, with no extra wiring on the page.
