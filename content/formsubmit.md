---
slug: formsubmit
title: "FormSubmit"
type: page
tags: [form, post, server-rendering]
related: [hx, modal]
track: tools
order: 38
status: draft
---

# FormSubmit

FormSubmit turns a click into form data and a classic submit. It is for pages where the
server renders everything: every action becomes a POST of the whole form, the server mutates
and renders the next page, and no HTML is ever built in JavaScript. The toolkit only writes
hidden inputs and calls the native `submit()` — no fetch, no JSON, no client state.

<!-- source: FormSubmit/FormSubmit.js -->

```html
<button onclick="FormSubmit.Set(this, 'status', 'archived')">Archive</button>
```

The button can sit anywhere inside the form. `Set` walks up to the form, appends
`<input type="hidden" name="status" value="archived">`, and submits. The server sees an
ordinary form field.

## Functions

`FormSubmit.Set(ctx, name, value)` adds the value under the name and submits. An object
flattens to PHP-style bracket names — `{ id: 7, qty: 2 }` under `item` becomes `item[id]=7`
and `item[qty]=2` — so the backend reads it like any submitted form. `null` submits an empty
value, which is how a "clear this field" button looks:

```html
<button onclick="FormSubmit.Set(this, 'assignee', null)">Clear</button>
```

`FormSubmit.Add(ctx, name, values)` appends to an array field. It reads the form's current
data, finds the highest index the field already has, and writes each value under the next
free one — `emails[3]`, `emails[4]`, ... A repeated field never overwrites itself:

```html
<button onclick="FormSubmit.Add(this, 'emails', [''])">Add email</button>
```

`FormSubmit.Submit(ctx)` submits the form from any element inside it, with nothing added.

## With Modal

A picker fits in one attribute. The [Modal](modal.html) opens a chooser page; its callback
gets the chosen rows and hands them straight to the form:

```html
<button onclick="Modal.Open('/products?_modal=1', (rows) =>
    rows && FormSubmit.Add(this, 'products', rows)
)">Add products</button>
```

The chooser is an ordinary server page. The chosen values land in the form as hidden inputs,
the form posts, and the server renders the list with the new rows — three server pages, zero
client templates.

## The shape of the page

This is the oldest web pattern, kept on purpose: state lives in the form, actions are form
data, the response is the next page. It suits admin backends and CRUD, where a full server
render is the simplest thing that works. When only a fragment of the page should change, that
is [Hx](hx.html) instead — the two do not mix on one action.

## Mechanism

The context element resolves the form with `closest('form')`; the trigger never names it.
Inputs are appended, so a value set twice sends both and the backend's parser keeps the last
one — PHP semantics. The native `submit()` navigates like a real form and skips `onsubmit`
handlers and constraint validation, on purpose: the server validates, and renders the page
again with the messages in it.
