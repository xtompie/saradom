---
slug: dropdown
title: "Dropdown"
type: page
tags: [popover, anchor-positioning, dom-state]
related: [event-attributes, hx, notify]
track: tools
order: 45
status: draft
---

# Dropdown

Dropdown opens a panel next to a trigger. An instance is three attributes: `dropdown-space` wraps the pair, `dropdown-trigger` is the element the panel anchors to, `dropdown-menu` is the panel. The trigger's click calls `Dropdown.Toggle(this)`. The native `popover` shows the panel in the top layer. CSS anchor positioning places it. The module only opens and closes.

<!-- source: Dropdown/Dropdown.js Dropdown/Dropdown.css -->

<!-- embed: Util/Util.js -->
<!-- embed: Dropdown/Dropdown.css -->
<!-- embed: Dropdown/Dropdown.js -->
<!-- embed: content/dropdown.css -->
<!-- embed: content/dropdown/routers.js -->

<!-- demo: content/dropdown/menu.html -->

## Closing

A dropdown closes when the user clicks elsewhere, moves focus elsewhere, or hits Escape. That part is wired once per page: three attributes on `body`. This is the only setup the toolkit needs — without it the panels open but never close on their own.

```html
<body onpointerdown="Dropdown.Down(event)"
      onfocusout="Dropdown.Out(event)"
      onkeydown="Dropdown.Esc(event)">
```

This page runs them — the demo above closes on any click elsewhere, and on Escape.

## Opening on focus

An input opens its panel when the user enters it — by click, by Tab, or by a shortcut that calls `focus()`. The trigger calls `Dropdown.Open(this)` instead of `Toggle`. `Open` does nothing when the panel is already open, because arriving at the input should never close it.

<!-- demo: content/dropdown/focus.html -->

## Reacting to open

The instance can declare what should happen when it opens. `dropdown-onopen` sits on the space — the root of the component, where behavior of the whole widget belongs — and is evaluated with `this` = the space each time the panel opens; `dropdown-onclose` mirrors it. From the space the callback finds what it needs by attribute. Here it stamps the time into `[report-generated]`:

<!-- demo: content/dropdown/onopen.html -->

With [Hx](hx.html) the same attribute gives lazy content — a panel that loads itself at the moment it opens:

```html
<div dropdown-space dropdown-onopen="() => hx(this.one('[dropdown-menu]'))">
    <button dropdown-trigger onclick="Dropdown.Toggle(this)">Notifications</button>
    <div dropdown-menu popover="manual"
         hx-get="/fragments/notifications.html" hx-target="this">
        <p>Loading…</p>
    </div>
</div>
```

The dropdown never heard of Hx. Hx never heard of dropdowns. One attribute on the space connects them.

## Pinned open

Sometimes a panel should stay until it is closed on purpose. The `dropdown-pin` flag takes it out of the routers' jurisdiction: clicks outside, focus leaving, Escape — none of them touch it. It closes only through `Dropdown.Close(this)` on an explicit button, or another click on its trigger.

<!-- demo: content/dropdown/pin.html -->

The flag is a plain attribute, so it can also be set at runtime — a panel the user pins stops auto-closing.

## Position

By default the panel opens under the trigger, left edges aligned. The value of `dropdown-menu` names a preferred place instead: `bottom-end`, `top`, `top-end`, `right`, `left`.

<!-- demo: content/dropdown/position.html -->

The preference is a preference, not a promise. When there is no room — a trigger at the bottom of the page, a flyout at the right edge — the browser flips the panel to the other side on its own (`position-try-fallbacks` in the toolkit's CSS). A dropdown in a footer becomes a drop-up without anyone asking.

## Use

Dropdown fits anything that opens next to its trigger and goes away: menus, pickers, notification panels, search suggestions, sidebar flyouts. A flow that must be completed or cancelled is a different job — that is a [Modal](modal.html), which blocks the page behind it. A dropdown never blocks; the page stays live.

## Mechanism

The module resolves the panel from the trigger by structure: up to the space, down to the panel. Opening is `showPopover()`, closing is `hidePopover()`, and each evaluates the space's `dropdown-onopen` or `dropdown-onclose`. On open the panel gets `tabindex="-1"`, so a click inside it keeps focus within the space.

Many instances share one page without touching each other. Every panel positions against the same anchor name, `--dd`, and `anchor-scope` on the space closes that name inside the instance — no ids, no generated names.

Closing is the module's on purpose. The browser's own light-dismiss (`popover` without a value) breaks a dropdown that opens on `focus`: the click that gives the input focus opens the popover, and the click phase of the same click counts as "outside" and dismisses it. `Down` closes every open panel whose space does not contain the clicked element; `Out` does the same check when focus lands on an element outside, and ignores a `focusout` with no destination — focus that just evaporated is an artifact, for example a drag-and-drop library re-inserting the dragged element, not a user leaving.

CSS anchor positioning ships in Chrome and Edge; elsewhere the panel still opens in the top layer, but ignores its anchor.
