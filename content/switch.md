---
title: "Switch"
---

# Switch

Switch turns tagged elements on and off. One call names a set of tags: every element whose tag is in the set goes on, the rest go off. On and off mean show and hide, unless the element defines its own effect. The active set is written to the space as `switch-state`.

<!-- source: Switch/Switch.js -->

<!-- embed: content/switch.css -->
<!-- embed: Switch/Switch.js -->

<!-- demo: content/switch-tabs.html -->

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

## Accordion

Each header toggles its panel. Opening one closes the rest.

<!-- demo: content/switch-accordion.html -->

## Radio

The extra input shows only when Other is selected.

<!-- demo: content/switch-radio.html -->

## Effect

```html
<div switch-space>
  <button onclick="Switch.To(this, '[switch-space]', 'a')">A</button>
  <button onclick="Switch.To(this, '[switch-space]', 'b')">B</button>
  <details switch-tag="a" switch-onchange="(on) => this.open = on">Panel A</details>
  <p switch-tag="b" switch-onchange="(on) => this.style.opacity = on ? 1 : .35">Panel B</p>
</div>
```
