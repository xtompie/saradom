---
slug: switch
title: "Switch"
type: example
tags: [example, dom-state]
related: [dom-state, event-attributes, notify, modularization]
track: examples
order: 5
status: draft
---

# Switch

Show one set of elements and hide the rest. Elements carry a tag inside a shared `switch-space`; one call decides each element's on/off from the active tags. The current set is written to the DOM as `switch-state`, readable there with no JavaScript variable holding it.

Switch is the more generic successor of [Visible](visible.html): the tag attribute is configurable, and the effect is not limited to show/hide.

<!-- source: Switch/Switch.js -->

## Signature

```
< switch-space switch-config-tag="switch-tag" switch-state="a b …">
    < switch-tag="a b" switch-onchange="(on) => …">

Switch.To(this, '[switch-space]', 'a b')            // tags: array or space-separated string
Switch.Toggle(this, '[switch-space]', when, then, otherwise)
```

The space is the second argument. It is a selector resolved from `ctx` with `closest`. There is no default space. Each call names its space. A nested space is never picked by accident.

`Switch.To(ctx, space, tags)` shows every target whose tag is in `tags`, hides the others, and writes `tags` to `switch-state`. Tags are an array or a space-separated string. A target with several tags is on when any of them matches. `Switch.Toggle(ctx, space, when, then, otherwise)` reads `switch-state`. When it includes `when`, the `then` set is shown, otherwise `otherwise`.

Config on the space element, the one the selector matches:

- `switch-config-tag` names the attribute a target's tag is read from. Default `switch-tag`.
- `switch-state` holds the active set, space-separated.

Config on each target:

- `switch-tag` holds the target's tag(s), space-separated.
- `switch-onchange` is the effect, `(on) => ...` with `this` the element. Left out, the target is shown when on and hidden when off.

## Tabs

One panel shows at a time. Each button selects its tag.

<!-- demo: content/switch-tabs.html -->

## Accordion

Each header toggles its panel. Opening one closes the rest.

<!-- demo: content/switch-accordion.html -->

## Radio

The extra input shows only when Other is selected.

<!-- demo: content/switch-radio.html -->

## Effect

Each target sets its own effect in `switch-onchange`. It runs with the computed boolean, `this` bound to the element. Left out, the target is shown when on and hidden when off.

```html
<div switch-space>
  <button onclick="Switch.To(this, '[switch-space]', 'a')">A</button>
  <button onclick="Switch.To(this, '[switch-space]', 'b')">B</button>
  <details switch-tag="a" switch-onchange="(on) => this.open = on">Panel A</details>
  <p switch-tag="b" switch-onchange="(on) => this.style.opacity = on ? 1 : .35">Panel B</p>
</div>
```

<!-- embed: content/switch.css -->
<!-- embed: Switch/Switch.js -->
