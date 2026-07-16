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

Vld validates data. Rules are a plain JS structure. A value goes in, and an array of errors comes out. No DOM is involved at any point. Attaching it to a form is one optional feature on top, wired the same way as the rest of Saradom. Nothing about the core function assumes a `<form>` exists at all.

`rules` is an array of groups. A group is an array of checks. A check has a `path` and a list of rules. A rule is a predicate that passes or fails.

<!-- source: Vld/Vld.js -->

```javascript
const rules = [
    [
        { path: 'email', rules: ['email'] },
        { path: 'password', rules: [{ min: 3 }] },
    ],
];

const errors = await Vld.Validate(rules, { email: '', password: 'ab' });
// => [{ key: 'required', message: 'This field is required', path: 'email' }]
```

## Rules

A rule itself is a predicate: `(input, args) => boolean`. `true` means the value is valid. Anything else is a failure. The rule only decides pass or fail. The message is resolved a layer up, from `Vld.Msg` under the rule's key. A rule that wants its own wording can return that string directly instead of `false`.

```javascript
Vld.Rule.min = (input, a) => String(input ?? '').length >= a.value;
```

### Writing a rule in a check

An entry in a check's `rules` array can take four forms:

```javascript
rules: [
    'email',                                          // 1. string — a rule with no argument
    { min: 3 },                                       // 2. shorthand — { ruleName: argument }
    { between: { min: 3, max: 20 } },                 // 2. shorthand — object argument, spread as named
    { rule: 'min', value: 3, msg: 'Too short', key: 'x' }, // 3. full — needed for msg / key
    (input) => /^[A-Z]+$/.test(input) || 'Only caps', // 4. inline function
]
```

1. String: the rule name alone, for rules that take no argument (`'email'`, `'numeric'`).
2. Shorthand: an object whose single key is the rule name and whose value is the argument. A scalar (or array, or `RegExp`) arrives as `args.value`. A plain object is spread, so its keys become named arguments (`{ between: { min, max } }` → `args.min`, `args.max`). This is the common form.
3. Full: an object with an explicit `rule` key. Use it only to add `msg` (custom message) or `key` (custom error key). Everything except `rule`, `msg`, and `key` is a named argument.
4. Inline function: a predicate written on the spot, no registration. Returning the message string on failure gives it its own wording.

Rules inside one check run in order, and stop at the first one that fails. A `min` failure reports "Must be at least…", not that plus every later rule at once.

## Built-in rules

Shown in shorthand form. A no-argument rule is just its name as a string.

- `'email'`: a valid email address
- `'url'`: a valid URL
- `{ min: n }`: length ≥ `n`
- `{ max: n }`: length ≤ `n`
- `{ between: { min, max } }`: length within `[min, max]`
- `{ length: n }`: length exactly `n`
- `'alpha'`: letters only
- `'alnum'`: letters and digits only
- `'digits'`: digits only
- `'numeric'`: a number
- `'integer'`: a whole number
- `{ gte: n }`: value ≥ `n`
- `{ lte: n }`: value ≤ `n`
- `{ in: [...] }`: value is in the list
- `{ notIn: [...] }`: value is not in the list
- `{ regex: /.../ }`: matches the pattern
- `{ same: { first, second } }`: `data[first] === data[second]`
- `{ different: { first, second } }`: `data[first] !== data[second]`
- `{ confirmed: 'field' }`: `data[field] === data[field + '_confirmation']`

`same`, `different`, and `confirmed` compare across fields, so they go on a check with `path: null` (which hands the rule the whole `data`) and an `errorPath` for where the message lands.

## Required

Whether a field may be empty is not a rule. It is a gate that runs before the chain. A normal rule can only short-circuit to an error. Emptiness needs the opposite too. An empty non-required field must short-circuit to success, skipping its rules entirely. So it lives on the check, not in `rules`.

`required` is a single boolean on the check, `true` by default. An empty value (`undefined`, `null`, or `''`) reports `{ key: 'required' }` and its `rules` never run. `required: false` flips that. An empty value passes with no error and the rules are skipped. A non-empty value runs the chain as usual. It is the same knob as HTML's `required` attribute.

```javascript
{ path: 'email', rules: ['email'] }                                  // required — empty → "This field is required"
{ path: 'bio', required: false, rules: [{ min: 10 }] }  // not required — empty → passes; "short" → min error
{ path: 'name', requiredMsg: 'Please enter a name', rules: [] }      // required with a custom message, no other rules
```

`requiredMsg` overrides the default "This field is required". There is no `required` rule to list. It is the boolean above, default `true`, and `required: false` opts out.

## path and errorPath

A check reads two things off `data`, independently. `path` says what the rule receives. `errorPath` says where the error attaches, when that is not the same field. It defaults to `path`.

For most checks they are identical: `path: 'email'` reads `data.email`, and an error lands on `email`.

`path: null` passes the whole `data` object to the rule instead of one field. That is what `same` needs above: it reads its two named arguments (`first`, `second`) as field names and compares them itself, so `path` is `null` and `errorPath` says where the resulting message belongs.

## Groups

Every check in a group runs, so more than one field can report an error at the same time. But the moment a group produces any error, later groups do not run at all.

```javascript
const rules = [
    [ // group 1 — shape of the data
        { path: 'email', rules: ['email'] },
        { path: 'password', rules: [{ min: 3 }] },
        { path: 'password2', rules: [] },
    ],
    [ // group 2 — only runs once group 1 is clean
        { path: null, errorPath: 'password2', rules: [{ same: { first: 'password', second: 'password2' } }] },
    ],
];
```

That ordering is what makes group 2 safe to write. Comparing `password` to `password2` only makes sense once both are filled in. Otherwise an empty `password2` fails the comparison immediately, and the user sees "Must match" before they have even been told "This field is required". Group 1 has to pass first, with both fields present and the password long enough, before group 2 is allowed to compare them.

Most JS validators run every check and collect every error in one pass. There is no equivalent of a group gating the next one. Vld's groups exist for exactly this ordering problem. For the same reason, a rule that makes a network request, like checking an email is not already taken, belongs in a group of its own, after the format checks that make the request worth sending.

## Custom rules

`Vld.Rule` is a plain object. Adding a rule is one assignment:

```javascript
Vld.Rule.startsWithLetter = (input) => /^[a-zA-Z]/.test(input);
Vld.Msg.startsWithLetter = 'Must start with a letter';
```

The predicate goes in `Vld.Rule`, its message in `Vld.Msg` under the same key. The rule stays a plain pass/fail, and the wording follows the language. For a throwaway rule, the registry can be skipped by returning the string on failure instead. It is then used like any built-in:

```javascript
{ path: 'username', rules: ['startsWithLetter'] }
```

A rule can also return a promise, for a check that has to ask a server something, like whether an email is already registered:

```javascript
{ path: 'email', rules: [
    { rule: (input) => fetch(`/api/email-free?email=${input}`)
        .then((r) => r.json())
        .then((d) => d.free || 'Email already registered'),
      key: 'unique' },
] }
```

## Messages

`Vld.Msg` is a plain object holding the messages, keyed by rule. When a rule fails without wording of its own, Vld looks its message up here by the rule's key. Changing a language is one assignment. Swap the whole object and every message follows:

```javascript
Vld.Msg = {
    required: 'To pole jest wymagane',
    email: 'Nieprawidłowy adres e-mail',
    min: 'Minimalnie {value} znaków',
    between: 'Od {min} do {max} znaków',
    // ...
};
```

Placeholders are filled by name from the rule's arguments. `{value}` comes from `{ min: 3 }`, and `{min}` and `{max}` come from `{ between: { min: 3, max: 20 } }`. `Vld.msg(key, args)` does that lookup-and-fill, and that is the one place it happens. The rules stay pure predicates. A single message overrides the registry from the check itself: `{ rule: 'min', value: 3, msg: 'Too short' }` for one field, or `requiredMsg` for the empty case. `key` overrides the same way, so a rule reports under any name.

## Forms

Four pieces connect `Validate` to a form. `vld-space` marks the scope. The handler climbs from the triggering element to its nearest space, so two instances on the same page never share state. `vld-form` marks the `<form>` whose named fields supply the data. `vld-error="name"` marks where an error for that name renders. `Vld.Form.Submit(ctx, event, rules, data)` ties them together. It stops the native submit, climbs from `ctx` to the nearest `[vld-space]`, validates, then clears and refills every `[vld-error]` inside it.

`data` is optional. Left out, `Vld.Form.Submit` reads it from the form's named fields with `FormData`. `rules` are always handed in. Where those rules are kept is up to the caller, not the mechanism. `Vld.Form.Submit` never names a property or reaches for one. It just validates whatever `rules` the call passes it. The demo below keeps them on the space with an inline `<script>` anchored by `document.currentScript`, and the handler reads them straight back with `this._vldRules`. That `_vldRules` name lives entirely in this page's markup. Nothing in Vld knows about it.

The form the data comes from is found from the space. If the space itself carries `vld-form`, it is the form. Otherwise the single `[vld-form]` inside it is used. That keeps the space free to be on a wrapper above the form, or on the `<form>` directly. Both attributes can go on one element when they coincide. Repeated field names, like checkboxes and multi-selects, collect into an array rather than collapsing to the last value.

```html
<form vld-space vld-form vld-error-tpl="[signup-error]" onsubmit="Vld.Form.Submit(this, event, this._vldRules)">
    <script>
    document.currentScript.closest('[vld-space]')._vldRules = [
        [
            { path: 'email', rules: ['email'] },
            { path: 'password', rules: [{ min: 3 }] },
            { path: 'password2', rules: [] },
        ],
        [
            { path: null, errorPath: 'password2', rules: [{ same: { first: 'password', second: 'password2' } }] },
        ],
    ];
    </script>

    <input name="email">
    <div vld-error="email"></div>

    <input name="password" type="password">
    <div vld-error="password"></div>

    <input name="password2" type="password">
    <div vld-error="password2"></div>

    <button>Sign up</button>

    <template signup-error><div class="signup-error">{message}</div></template>
</form>
```

Keeping the rules on the element is one way to solve a real problem, not a rule Vld imposes. A plain JS variable named `rules` would have to live somewhere a second form could reach it too. That is a global, almost always, and a second form on the same page would either share it by accident or fight over the name. Keeping them on the space instead means two forms are just two elements, each carrying its own rules, with nothing to collide. The handler passes them in like any other argument.

`vld-error-tpl` holds a selector, and the element it points to supplies the error markup. Its inner HTML is the template, read once per submit. `{key}`, `{message}`, and `{path}` are replaced from the matching error. The target is the element that selector matches inside the space. There is no built-in markup and no default class. The `vld-` prefix names attribute contracts, not styles, so the markup and its classes are defined in the page, not by Vld. No selector, or a selector that matches nothing, means nothing renders.

`ctx` does not have to be the form. Calling it from a plain button works the same way, since `Vld.Form.Submit` climbs to `[vld-space]` from wherever it is called, not just from the form itself. The climb to the space reaches the rules kept there:

```html
<button type="button" onclick="Vld.Form.Submit(this, event, this.closest('[vld-space]')._vldRules)">Sign up</button>
```

`rules` is always passed. Passing `data` too skips the `FormData` read, for a one-off form or values that do not come from named inputs:

```javascript
Vld.Form.Submit(this, event, rules, { email: state.email, password: state.password })
```

`Vld.Form.Submit` resolves to `true` when the data passed, so a caller can act once validation settles:

```javascript
Vld.Form.Submit(this, event, this._vldRules).then((ok) => {
    if (ok) { /* proceed */ }
});
```

This is one option among a few for handling a form. Vld covers the shape checks that should show before a submit fires. It is not a replacement for the submit itself.

## Attributes

- `vld-space` marks the scope `Vld.Form.Submit` climbs to.
- `vld-form` marks the `<form>` whose named fields supply `data`. It is on the space itself, or on the single form inside it.
- `vld-error="name"` marks where the error for that `path` renders. An empty value (`vld-error=""`) catches errors with `path: null`.
- `vld-error-tpl`, on a `<template>` inside the space, gives the error markup. Optional: a default is used when it is missing.

## Methods

The core is headless: `Validate` and the registries, no DOM. Rendering lives in the `Vld.Form` addon.

- `Vld.Validate(rules, data)` runs the rules against the data, headless. Returns `Promise<errors>`.
- `Vld.Form.Validate(root, rules, data, tpl, attr)` validates and shows the errors under the fields in one call, and returns `Promise<boolean>`, `true` when the data passed. A default for a component that holds its own `data`: `if (!(await Vld.Form.Validate(form, rules, data))) return;`.
- `Vld.Form.Submit(ctx, event, rules, data)` resolves the space from `ctx`, defaults `data` to `FormData` off the space's `[vld-form]` when omitted, then does the same validate-and-show. Returns `Promise<boolean>`.
- `Vld.Form.Clear(root, attr)` empties every `[vld-error]` inside `root` without validating. It clears messages on their own, for example when closing or reopening a dialog.
- `Vld.Rule` holds the rule registry. Add to it directly to register a new one.
- `Vld.Msg` holds the built-in messages, keyed by rule. Swap the whole object to change language; `{name}` placeholders are filled from the rule's named arguments.
- `Vld.msg(key, args)` reads `Vld.Msg[key]` and fills its `{name}` placeholders from `args`. Built-in rules use it; custom rules can too.
