---
slug: val
title: "Val"
type: page
tags: [val, dom-state]
related: [util, compute, notify]
track: tools
order: 35
status: draft
---

# Val

In Saradom a screen usually updates by swapping a whole HTML fragment. When a swap cannot do the job, the work happens on individual values. Val is for that: two-way binding between a JavaScript object and the [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model). An element is marked, an object is written to it, and the same object is read back.

<!-- source: Val/Val.js -->

```html
<article>
  <h1 val val-fx="Text" val-key="title">Cat</h1>
  <img val val-fx="Img" val-key="image" src="/cat.jpg">
</article>

<script>
const el = dom.one('article');
el.vset({ title: 'Dog', image: '/dog.jpg' });
el.vget(); // => { title: 'Dog', image: '/dog.jpg' }
</script>
```

## Mechanism

The `val` attribute marks an element for binding. Two attributes define what happens. `val-set` writes data into the element. `val-get` reads data from it. Both run with `this` bound to the element.

```html
<article>
  <h1 val
      val-set="(data) => this.textContent = data.title"
      val-get="() => ({ title: this.textContent })"
    >Cat</h1>
</article>
```

Two element methods drive the binding. `vset` writes an object into the marked subtree. `vget` reads the current state back.

```javascript
const article = dom.one('article');

article.vset({ title: 'Dog' });
article.vget(); // => { title: 'Dog' }
```

That is the whole mechanism. Everything else is convenience over these two calls.

### Multiple fields per element

One `val-set` can do more than one thing to the element. It is plain code, so it sets content, an attribute, or anything else in the same call. `val-get` reads the same fields back.

```html
<a val
   val-set="(data) => { this.textContent = data.label; this.setAttribute('href', data.url); }"
   val-get="() => ({ label: this.textContent, url: this.getAttribute('href') })">Link</a>
```

```javascript
const link = dom.one('a');

link.vset({ label: 'Dog', url: '/dog' }); // sets text and href
link.vget(); // => { label: 'Dog', url: '/dog' }
```

### Without Val

Reading and writing by hand repeats the same lookups. Each field names an element, a property, and a value, twice.

```javascript
const el = dom.one('article');
el.querySelector('h1').textContent = data.title;
el.querySelector('img').src = data.image;
// reading it back is more of the same
```

### With Val

The element carries its own read and write rules. The script works with the object.

```html
<article>
  <h1 val
      val-set="(data) => this.textContent = data.title"
      val-get="() => ({ title: this.textContent })"
  >Cat</h1>
</article>
```

```javascript
dom.one('article').vset({ title: 'Dog' });
```

A getter and setter per field becomes repetitive across a page. An fx removes that repetition.

## Fx

An fx is a ready-made getter and setter. `val-fx` names it. That replaces `val-set` and `val-get`. `val-key` names the field to bind.

```html
<article>
  <h1 val val-fx="Text" val-key="title">Cat</h1>
</article>
```

```javascript
const article = dom.one('article');
article.vset({ title: 'Dog' });
article.vget(); // => { title: 'Dog' }
```

### Without an fx

The same getter and setter is written for every field.

```html
<h1 val
    val-set="(v) => this.textContent = v.title"
    val-get="() => ({ title: this.textContent })"></h1>
<p val
    val-set="(v) => this.textContent = v.description"
    val-get="() => ({ description: this.textContent })"></p>
```

### With an fx

`val-fx` and `val-key` say the same thing in less markup.

```html
<h1 val val-fx="Text" val-key="title"></h1>
<p val val-fx="Text" val-key="description"></p>
```

### Built-in fx

Each fx binds one value to one place. It reads its own configuration from the element's `val-*` attributes.

- `Text` binds `textContent`.
- `Html` binds `innerHTML`.
- `Img` binds an image `src`.
- `Input` binds a form field value.
- `Attr` binds a named attribute, given in `val-attr`.
- `Pattr` binds a named attribute on the parent element, given in `val-attr`.
- `Pflag` binds a boolean attribute on the parent element, given in `val-attr`. It is present when the value is truthy and absent otherwise.
- `Prop` binds a non-primitive value by storing it on the element, not in the DOM.
- `Pprop` is `Prop`, stored on the parent element.
- `Select` picks one option from a set, radio-style.
- `Show` shows the element when the value is true, and hides it otherwise.
- `Hide` is the reverse of `Show`.
- `If` shows a subtree when a field is set, and binds it only then.

`Obj`, `Arr`, and `Render` bind nested objects and lists.

### Showing with `Show` and `Hide`

`Show` sets `display` from a boolean. `Hide` does the reverse. On read both return the current visibility as a boolean.

```html
<p val val-fx="Show" val-key="online">Online</p>
```

```javascript
const badge = dom.one('p');

badge.vset({ online: true });  // shows the element
badge.vget();                  // => { online: true }
badge.vset({ online: false }); // hides the element
```

Several fields bind in one tree. A single write fills them all, and a single read returns the same shape.

```html
<article>
  <h1 val val-fx="Text" val-key="title">Cat</h1>
  <img val val-fx="Img" val-key="image" src="/cat.jpg">
  <p val val-fx="Text" val-key="description">Cute animal</p>
</article>
```

```javascript
const article = dom.one('article');

article.vset({
  title: 'Dog',
  image: '/dog.jpg',
  description: 'Loyal friend',
});

article.vget();
// => { title: 'Dog', image: '/dog.jpg', description: 'Loyal friend' }
```

### Flags with `Pflag`

`Pflag` binds a boolean attribute on the parent element. `val-attr` names the attribute. Set toggles it: present when the value is truthy, absent otherwise. Get returns whether the parent carries it.

```html
<div>
  <i val val-fx="Pflag" val-key="hidden" val-attr="hidden" hidden></i>
</div>
```

```javascript
const flag = dom.one('i');

flag.vset({ hidden: true });  // adds the hidden attribute to the parent
flag.vget();                  // => { hidden: true }
flag.vset({ hidden: false }); // removes it
```

`Pattr` is the string sibling: it binds the attribute's value rather than its presence.

### References with `Prop`

`Prop` binds a value that should not be serialized into the DOM: a DOM element, an object, a function. It stores the value on the element under `el._val[key]` and reads it back from there. `Pprop` does the same on the parent element.

```html
<i val val-fx="Prop" val-key="anchor" hidden></i>
```

```javascript
const ref = dom.one('i');

ref.vset({ anchor: dom.one('#target') }); // stores the element reference
ref.vget();                               // => { anchor: <#target> }
```

The reference lives on the element in memory. Nothing is written to any attribute.

### Picking with `Select`

`Select` binds one choice out of a set of options, radio-style. `val-from` selects the options and names the attribute that holds each option's value. `val-mark` names the attribute placed on the chosen option. `val-key` names the field.

Set marks the option whose `val-from` value equals the data, and clears the rest. Get returns the marked option's value, or `null` when nothing is marked.

```html
<div val val-fx="Select" val-key="color" val-from="opt" val-mark="picked">
  <button opt="red"></button>
  <button opt="green"></button>
  <button opt="blue"></button>
</div>
```

```javascript
const picker = dom.one('[val-key="color"]');

picker.vset({ color: 'green' }); // marks the green button with picked
picker.vget();                   // => { color: 'green' }
```

### Conditional with `If`

`If` shows its element when a field is set, and hides it when the field is missing or false. While shown, the field's object binds the elements inside. A `val-value` narrows this to a match, so the element shows only when the field equals that value.

```html
<div val val-fx="If" val-key="error">
  <p val val-fx="Text" val-key="text"></p>
</div>
```

```javascript
const box = dom.one('[val-key="error"]');
box.vset({ error: { text: 'Not found' } }); // shows and fills the message
box.vset({ error: false });                 // hides
```

The read side is asymmetric. A hidden element returns `{}`, so its key drops out of the `vget` result. Only a shown element contributes its field.

## Rendering

Nested objects and lists bind with the same `val-fx` and `val-key`. Three fx cover them: `Obj` for a nested object, `Arr` for a list, and `Render` for one object from a template.

### Nested objects

`val-fx="Obj"` groups child fields under one key. Child elements read and write inside that key instead of the root object.

```html
<article>
  <h1 val val-fx="Text" val-key="title">Cat</h1>

  <div val val-fx="Obj" val-key="author">
    <span val val-fx="Text" val-key="name">Unknown</span>
    <span val val-fx="Text" val-key="email">no-email</span>
  </div>
</article>
```

```javascript
const article = dom.one('article');

article.vset({
  title: 'Dog',
  author: { name: 'John Doe', email: 'john@example.com' },
});

article.vget();
// => { title: 'Dog', author: { name: 'John Doe', email: 'john@example.com' } }
```

### Lists

`val-fx="Arr"` renders an array. Each item is built from a [`<template>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template). `val-tpl` selects the template. `val-key` names the array field.

`val-tpl` holds a CSS selector. Val passes its value to `document.querySelector` to find the template. The template must hold exactly one root element, since Val clones its first element child for each item.

```html
<template tag-item>
  <li val val-fx="Text" val-key="name"></li>
</template>

<article>
  <h1 val val-fx="Text" val-key="title">Cat</h1>
  <ul val val-fx="Arr" val-key="tags" val-tpl="[tag-item]"></ul>
</article>
```

```javascript
dom.one('article').vset({
  title: 'Dog',
  tags: [{ name: 'pet' }, { name: 'animal' }, { name: 'loyal' }],
});
```

The list is rebuilt on the next write. One item per array entry, in order.

### Marking the root

A template holds one root element. Whether that root carries `val` decides how the item binds.

When the root is the value, mark the root. A list item that only shows text binds on the root itself.

When the root wraps several values, leave the root bare and mark the fields inside. Val applies the item to the root only when the root carries `val`. A bare root is read as a container, and Val binds the `[val]` elements within it.

Each item is one object. The array never reaches a template. `Arr` takes it apart and hands one object to each clone, so at every marked element the data in scope is an object.

### Adding to a list

`vappend` and `vprepend` add items without rewriting the whole list. Each takes the items and reuses the list's template.

```javascript
const list = dom.one('ul');

list.vappend([{ name: 'small' }]);
list.vprepend([{ name: 'new' }]);
```

`vprepend` reverses the array in place with `data.reverse()` before inserting, so the first item ends up first in the list. The passed array is mutated.

### Rendering one object

`val-fx="Render"` clears an element and renders a single object from a template. It returns to empty when the value is missing.

```html
<template badge-card>
  <span val val-fx="Text" val-key="label"></span>
</template>

<div val val-fx="Render" val-key="badge" val-tpl="[badge-card]"></div>
```

```javascript
const box = dom.one('[val-key="badge"]');

box.vset({ badge: { label: 'new' } });       // renders the card
box.vrender({ label: 'sale' }, '[badge-card]'); // renders one object directly
```

## Lanes

One DOM tree can hold several independent models. A lane keeps them apart. `val-lane` marks the root of a model and names it.

Lanes are inherited. An element's lane is the nearest `val-lane` on it or on an ancestor (`el.closest('[val-lane]')`). You tag only the roots; everything inside inherits.

A lane-scoped read or write descends the subtree but never crosses into an element whose `val-lane` differs. A foreign model is skipped whole, so separate models can nest inside one another without leaking into each other.

`vget`, `vset`, and `vsync` take no lane argument in normal use. Each resolves the lane from the element's nearest `val-lane`. A lane can still be passed explicitly when needed.

The kanban board is the worked example. Three models share one tree:

```html
<div kanban-space val-lane="value">
  <!-- the board: columns and cards -->

  <div kanban-modal val-lane="modal" hidden>
    <!-- the interface: anchor, hidden, mode -->

    <section kanban-form val-lane="form">
      <!-- the card being edited: title, color -->
    </section>
  </div>
</div>
```

The board carries `val-lane="value"`, the modal `val-lane="modal"`, and the form `val-lane="form"`. Columns, cards, binders, and form fields carry no lane; they inherit from the nearest root.

```javascript
space.vget(); // the board only; the nested modal is skipped
modal.vget(); // the interface only; the nested form is skipped
form.vget();  // the card being edited
```

Each read returns only its own model. The modal sits inside the board and the form sits inside the modal, but a read of one never reaches into another.

## Custom fx

An fx is an object with two functions. `Get` reads a value from the element. `Set` writes a value into it. Each reads its own configuration from the element's attributes. New fx are added to `Val.Fx` by name.

```javascript
Val.Fx.Upper = {
  Get: (el) => ({ [el.getAttribute('val-key')]: el.textContent.toLowerCase() }),
  Set: (el, data) => {
    el.textContent = String(data[el.getAttribute('val-key')]).toUpperCase();
  },
};
```

The name is then used like any built-in fx.

```html
<h1 val val-fx="Upper" val-key="title">cat</h1>
```

```javascript
const el = dom.one('h1');
el.vset({ title: 'dog' }); // shows DOG
el.vget();                  // => { title: 'dog' }
```

An fx reads any option it needs from its own `val-*` attributes. A currency formatter reads `val-currency` the same way it reads `val-key`.

```html
<div val val-fx="Money" val-key="price" val-currency="USD"></div>
```

```javascript
Val.Fx.Money = {
  Get: (el) => ({
    [el.getAttribute('val-key')]: Number(el.textContent.replace(/[^0-9.]/g, '')),
  }),
  Set: (el, data) => {
    el.textContent = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: el.getAttribute('val-currency'),
    }).format(data[el.getAttribute('val-key')]);
  },
};
```

### Calling fx by hand

The same result comes from a plain `val-set` and `val-get` that call the fx directly. Each fx is `Val.Fx.<Name>` with a `Get(el)` and a `Set(el, data)`. The element still carries the `val-*` attributes each fx reads.

```html
<a val val-key="label" val-attr="href"
   val-set="(data) => { Val.Fx.Text.Set(this, data); Val.Fx.Attr.Set(this, data); }"
   val-get="() => ({ ...Val.Fx.Text.Get(this), ...Val.Fx.Attr.Get(this) })">Link</a>
```

Built-in and custom fx mix freely in the same tree.

## Sync

`vsync(data)` writes like `vset`, but only where the value changed. It reads the current value, compares, and sets only the fields that differ. Unchanged subtrees are skipped, including their `val-set`. A list is reconciled by position: an unchanged item is left untouched, a changed item is patched in place, extra items are appended, a shorter list drops its tail.

```javascript
const d = article.vget();
d.title = 'Cat';
article.vsync(d);                               // only the title element is written
article.vsync((d) => ({ ...d, title: 'Cat' })); // same, given a function of the current state
```

`vpatch(patch)` merges a partial object over the current state and syncs the diff. It is shorthand for `vsync((d) => ({ ...d, ...patch }))`.

```javascript
modal.vpatch({ hidden: true }); // reads the current state, sets only hidden
```

An element with `val-set` is always written, because its effect cannot be read back to compare.

## Methods

Val adds methods to `HTMLElement`. Each acts on the marked subtree of the element it is called on and returns the element, except the readers. Each resolves its lane from the element's nearest `val-lane`, and each accepts a lane as an optional last argument.

- `vset(data)` writes an object into the subtree. Given a function, it reads the state, passes it in, and writes the result.
- `vget()` reads the subtree back as an object. Reader.
- `vsync(data)` writes only the fields that changed. Given a function, it reads the state, passes it in, and writes what changed.
- `vpatch(patch)` merges a partial object over the current state and syncs the diff.
- `vappend(items, tpl)` adds items to the end of a list.
- `vprepend(items, tpl)` adds items to the start of a list.
- `varr(data, tpl)` writes an array as list items. Called with no argument it reads the list back as an array. Reader in that form.
- `vobj(data)` writes an object into the subtree. Called with no argument it reads the subtree as an object. Reader in that form.
- `vrender(data, tpl)` clears the element and renders one object from a template.
- `vval(data)` writes when given an argument and reads when called with none. Reader in that form.

```javascript
const article = dom.one('article');

article.vset({ title: 'Dog' });               // write
article.vget();                               // read
article.vset((d) => ({ ...d, seen: true }));   // read, change, write
article.vsync((d) => ({ ...d, title: 'Cat' })); // read, change, write only the diff
article.vpatch({ title: 'Cat' });             // merge and sync the diff
```

### Attributes

- `val` marks an element for binding.
- `val-set` writes data into the element.
- `val-get` reads data from the element.
- `val-fx` names an fx instead of `val-set` and `val-get`.
- `val-key` names the field in the data object.
- `val-attr` names the attribute for the `Attr`, `Pattr`, and `Pflag` fx.
- `val-tpl` selects the template for a list or render.
- `val-from` selects the options and value source for the `Select` fx.
- `val-mark` names the marker attribute for the `Select` fx.
- `val-value` gives the `If` fx a value to match, so the element shows only when the field equals it.
- `val-lane` marks the root of a model and names it. Lanes are inherited by the subtree.

`val-set` and `val-get` run with `this` bound to the element. An fx reads any other `val-*` attribute it needs directly from the element.

`vset`, `vget`, and their kin act on the element itself when it carries the `val` attribute, and on its marked subtree when it does not.

Each method wraps the public `Val.*` API: `Val.Get`, `Val.Set`, `Val.Obj`, `Val.Arr`, `Val.Render`, `Val.Append`, `Val.Prepend`, `Val.Sync`, `Val.Patch`, `Val.Lane`, and `Val.Fd`. The same calls are available on `Val` for use without an element method.

`Val.Sync`, `Val.Patch`, `vsync`, and `vpatch` form one optional diff-sync block. It can be dropped as a unit when a project never needs the diff.
