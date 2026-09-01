---
slug: formsend
title: "Formsend"
type: page
tags: [form, post, server-rendering]
related: [hx, modal]
track: tools
order: 38
status: draft
---

# Formsend

Formsend keeps rendering in one place: the server. Every action puts its values into the
form as hidden inputs and submits it; the server mutates and renders the whole next page.
JavaScript never builds HTML.

<!-- source: Formsend/Formsend.js -->

Each function takes any element inside the form and resolves the form with
`closest('form')`.

`Formsend.Set(ctx, name, value)` — writes the value and submits. Objects flatten to
PHP-style bracket names: `{ id: 7 }` under `item` becomes `item[id]=7`. `null` sends an
empty value:

```html
<button onclick="Formsend.Set(this, 'status', 'archived')">Archive</button>
<button onclick="Formsend.Set(this, 'assignee', null)">Clear</button>
```

`Formsend.Add(ctx, name, values)` — appends to an array field under the next free index
(`emails[3]`, `emails[4]`, ...), read from the form's current data, then submits:

```html
<button onclick="Formsend.Add(this, 'emails', [''])">Add email</button>
```

`Formsend.Send(ctx)` — submits with nothing added.

## With Modal

A picker: the [Modal](modal.html) opens a chooser page, the callback hands the chosen rows
to the form, the server renders the list with them in it.

```html
<button onclick="Modal.Open('/products?_modal=1', (rows) =>
    rows && Formsend.Add(this, 'products', rows)
)">Add products</button>
```

## Notes

- The native `submit()` skips `onsubmit` and constraint validation on purpose: the server
  validates and renders the page again with the messages.
- A name set twice sends both values; PHP keeps the last one.
- One whole-page render per action. To swap a fragment instead, use [Hx](hx.html).
