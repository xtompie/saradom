---
slug: vld
title: "Vld"
type: page
tags: [validation, forms]
related: [the-simple-way, val]
track: tools
order: 60
status: draft
---

# Vld

Vld validates data. Rules are a plain JS structure, a value goes in, an array of errors comes out — no DOM involved at any point. Attaching it to a form is one optional feature on top, wired the same way as the rest of Saradom. Nothing about the core function assumes a `<form>` exists at all.

<!-- source: Vld/Vld.js -->

```javascript
const rules = [
    [
        { path: 'email', rules: ['required', 'email'] },
        { path: 'password', rules: ['required', { rule: 'min', arg: 3 }] },
    ],
];

const errors = await Vld.Validate(rules, { email: '', password: 'ab' });
// => [{ key: 'required', message: 'This field is required', path: 'email' }]
```

That's the whole mechanism: `rules` and `data` in, an array of errors out. An empty array means everything passed.

## Rules

A rule is a function: `(input, arg) => null | string`. `null` means the value is fine. A string is the message to show. There is no `true`/`false` — `null` reads as "nothing to report", with no boolean to misread.

```javascript
Vld.Rule.min = (input, arg) => String(input ?? '').length >= Number(arg) ? null : `Must be at least ${arg} characters`;
```

A few are built in: `required`, `email`, `min`, `same`. Inside a check, `rules` names them by string, or configures them with an object:

```javascript
{ path: 'password', rules: [
    'required',
    { rule: 'min', arg: 3 },
    { rule: 'min', arg: 3, msg: 'Too short' }, // overrides the rule's own message
] }
```

A rule can also be a plain function, written inline, with no registration:

```javascript
{ path: 'code', rules: [
    (input) => /^[A-Z]+$/.test(input) ? null : 'Uppercase letters only',
] }
```

Rules inside one check run in order, and stop at the first one that fails — a blank required field reports "required", not "required" and "not a valid email" at once.

## Groups

`rules` is an array of groups, and a group is an array of checks. Every check in a group runs, so more than one field can report an error at the same time. But the moment a group produces any error, later groups don't run at all.

```javascript
const rules = [
    [ // group 1 — shape of the data
        { path: 'email', rules: ['required', 'email'] },
        { path: 'password', rules: ['required', { rule: 'min', arg: 3 }] },
        { path: 'password2', rules: ['required'] },
    ],
    [ // group 2 — only runs once group 1 is clean
        { path: null, errorPath: 'password2', rules: [{ rule: 'same', arg: ['password', 'password2'] }] },
    ],
];
```

That ordering is what makes group 2 safe to write. Comparing `password` to `password2` only makes sense once both are actually filled in — otherwise an empty `password2` fails the comparison immediately, and the user sees "Must match" before they've even been told "This field is required". Group 1 has to pass first — both fields present, password long enough — before group 2 is allowed to compare them.

Most JS validators, [Zod](https://zod.dev/) included, run every check and collect every error in one pass. There's no equivalent of a group gating the next one. Vld's groups exist for exactly this ordering problem, and for the same reason a rule that hits the network (checking an email isn't already taken, say) belongs in a group of its own, after the format checks that make the request worth sending.

## path and errorPath

A check reads two things off `data`, independently. `path` says what the rule receives. `errorPath` says where the error attaches, when that's not the same field — it defaults to `path`.

For most checks they're identical: `path: 'email'` reads `data.email`, and an error lands on `email`.

`path: null` passes the whole `data` object to the rule instead of one field. That's what `same` needs above: it takes two field names in `arg` and compares them itself, so `path` is `null` and `errorPath: 'password2'` says where the resulting message belongs.

## Custom rules

`Vld.Rule` is a plain object. Adding a rule is one assignment:

```javascript
Vld.Rule.startsWithLetter = (input) => /^[a-zA-Z]/.test(input) ? null : 'Must start with a letter';
```

It's then used like any built-in:

```javascript
{ path: 'username', rules: ['required', 'startsWithLetter'] }
```

A rule can also return a promise, for a check that has to ask a server something — whether an email is already registered, say:

```javascript
{ path: 'email', rules: [
    { rule: (input) => fetch(`/api/email-free?email=${input}`)
        .then((r) => r.json())
        .then((d) => d.free ? null : 'Email already registered'),
      key: 'unique' },
] }
```

## Attaching to a form

Four pieces connect `Validate` to a form: `vld-space` marks the scope — the same idiom as `counter-space` in [Action in context](action-in-context.html) and `accordion-space` in [Modularization](modularization.html): climb from the triggering element to its nearest space, so two instances on the same page never share state. `vld-form` marks the `<form>` whose named fields supply the data. `vld-error="name"` marks where an error for that name renders. `Vld.Submit(ctx, event, rules, data)` ties them together — it stops the native submit, climbs from `ctx` to the nearest `[vld-space]`, validates, and clears and refills every `[vld-error]` inside it.

`data` is optional — left out, `Vld.Submit` reads it from the form's named fields with `FormData`. `rules` you always hand in. Where those rules are kept is your call, not the mechanism's: `Vld.Submit` never names a property or reaches for one, it just validates whatever `rules` the call passes it. The demo below keeps them on the space with an inline `<script>` anchored by `document.currentScript` — the same per-instance setup [High UX Performance](ux-performance.html#why) uses — and the handler reads them straight back with `this._vldRules`. That `_vldRules` name lives entirely in this page's markup; nothing in Vld knows about it.

The form the data comes from is found from the space: if the space itself carries `vld-form`, it *is* the form; otherwise the single `[vld-form]` inside it is used. That keeps the space free to sit on a wrapper above the form, or on the `<form>` directly — put both attributes on one element when they coincide. Repeated field names (checkboxes, multi-selects) collect into an array rather than collapsing to the last value.

```html
<form vld-space vld-form onsubmit="Vld.Submit(this, event, this._vldRules)">
    <script>
    document.currentScript.closest('[vld-space]')._vldRules = [
        [
            { path: 'email', rules: ['required', 'email'] },
            { path: 'password', rules: ['required', { rule: 'min', arg: 3 }] },
            { path: 'password2', rules: ['required'] },
        ],
        [
            { path: null, errorPath: 'password2', rules: [{ rule: 'same', arg: ['password', 'password2'] }] },
        ],
    ];
    </script>

    <template vld-error-tpl><div class="vld-error">{message}</div></template>

    <input name="email">
    <div vld-error="email"></div>

    <input name="password" type="password">
    <div vld-error="password"></div>

    <input name="password2" type="password">
    <div vld-error="password2"></div>

    <button>Sign up</button>
</form>
```

Keeping the rules on the element is one way to solve a real problem, not a rule Vld imposes. A plain JS variable named `rules` would have to live somewhere a second form could reach it too — a global, almost always, and a second form on the same page would either share it by accident or fight over the name. Hanging them off the space instead means two forms are just two elements, each carrying its own rules, with nothing to collide — and the handler passes them in like any other argument.

The error markup comes from `<template vld-error-tpl>`, read once per submit. `{key}`, `{message}`, and `{path}` are replaced from the matching error. Without a template in the space, `Vld.Form` falls back to `<div class="vld-error">{message}</div>`.

`ctx` doesn't have to be the form. Calling it from a plain button works the same way, since `Vld.Submit` climbs to `[vld-space]` from wherever it's called, not just from the form itself — climb to the space to reach the rules kept there:

```html
<button type="button" onclick="Vld.Submit(this, event, this.closest('[vld-space]')._vldRules)">Sign up</button>
```

`rules` is always passed; passing `data` too skips the `FormData` read — for a one-off form, or values that don't come from named inputs:

```javascript
Vld.Submit(this, event, rules, { email: state.email, password: state.password })
```

`Vld.Submit` returns the errors, so a caller can act once validation settles:

```javascript
Vld.Submit(this, event, this._vldRules).then((errors) => {
    if (!errors.length) { /* proceed */ }
});
```

This is one option among a few for handling a form. [The simple way](the-simple-way.html#forms) lays out the others — a plain submit, an htmx-style swap, sending JSON and rendering whatever errors the server sends back. Reach for Vld for the shape checks that should show before any of those fire, not as a replacement for them.

## Attributes

- `vld-space` marks the scope `Vld.Submit` climbs to.
- `vld-form` marks the `<form>` whose named fields supply `data`. It sits on the space itself, or on the single form inside it.
- `vld-error="name"` marks where the error for that `path` renders. An empty value (`vld-error=""`) catches errors with `path: null`.
- `vld-error-tpl`, on a `<template>` inside the space, gives the error markup. Optional — a default is used when it's missing.

## Methods

- `Vld.Validate(rules, data)` runs the rules against the data, headless. Returns `Promise<errors>`.
- `Vld.Form(root, rules, data, tpl, attr)` validates and renders into `root`'s `[vld-error]` elements.
- `Vld.Submit(ctx, event, rules, data)` resolves the space from `ctx`, validates the given `rules`, defaults `data` to `FormData` off the space's `[vld-form]` when omitted, and calls `Form`.
- `Vld.Rule` holds the rule registry. Add to it directly to register a new one.
