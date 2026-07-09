---
title: "Val"
---

# Val

In Saradom a screen updates by swapping a whole HTML fragment. A swap is the simplest and fastest way to update, so it comes first. When a swap cannot do the job, the work happens on individual values. Val is for that: two-way binding between a JavaScript object and the [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model). An element is marked, an object is written to it, and the same object is read back.

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

Elements are marked with attributes, and values are read and written on them.

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

A getter and setter per field becomes repetitive across a page. [Fx](#fx) remove that repetition.

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

Each fx binds one value to one element property.

- `Text` binds `textContent`.
- `Html` binds `innerHTML`.
- `Img` binds an image `src`.
- `Input` binds a form field value.
- `Attr` binds a named attribute, given in `val-attr`.
- `Pattr` binds a named attribute on the parent element, given in `val-attr`.
- `Show` shows the element when the value is true, and hides it otherwise.
- `Hide` is the reverse of `Show`.
- `If` shows a subtree when a field is set, and binds it only then.

`Obj`, `Arr`, and `Render` bind nested objects and lists. See [Rendering](#rendering).

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

An fx can also be defined by hand. See [Custom fx](#custom-fx).

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

## Custom fx

An fx is an object with two functions. `Get` reads a value from the element. `Set` writes a value into it. New fx are added to `Val.Fx` by name.

```javascript
Val.Fx.Upper = {
  Get: (el, params) => ({ [params.key]: el.textContent.toLowerCase() }),
  Set: (el, data, params) => { el.textContent = String(data[params.key]).toUpperCase(); },
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

### Parameters

`params` holds every `val-*` attribute on the element, with the `val-` prefix removed. `val-set`, `val-get`, and `val-fx` are excluded. This passes options into an fx.

```html
<div val val-fx="Money" val-key="price" val-currency="USD"></div>
```

```javascript
// params inside the fx:
// { key: 'price', currency: 'USD' }
```

An fx reads its own options from `params` and applies them in `Get` and `Set`.

```javascript
Val.Fx.Money = {
  Get: (el, params) => ({ [params.key]: Number(el.textContent.replace(/[^0-9.]/g, '')) }),
  Set: (el, data, params) => {
    el.textContent = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: params.currency,
    }).format(data[params.key]);
  },
};
```

### Composing fx with `Fxs`

`val-fx="Fxs"` runs several fx on one element. The element holds a nested `[val-fxs]` container whose children each carry a single `val-fx` and its parameters. Each child fx acts on the outer element. A read merges every child result into one object. A write applies every child fx.

```html
<a val val-fx="Fxs">
  <span val-fxs hidden>
    <i val-fx="Attr" val-key="url" val-attr="href"></i>
    <i val-fx="Attr" val-key="tip" val-attr="title"></i>
  </span>
  Link
</a>
```

```javascript
const link = dom.one('a');

link.vset({ url: '/dog', tip: 'A dog' });
// href="/dog" and title="A dog" on the same anchor

link.vget();
// => { url: '/dog', tip: 'A dog' }
```

The `[val-fxs]` container and its children hold no `val` attribute, so normal binding skips them and reads only the merged output.

### Calling fx by hand

The same result comes from a plain `val-set` and `val-get` that call the fx directly. Each fx is `Val.Fx.<Name>` with a `Get(el, params)` and a `Set(el, data, params)`. This trades the `[val-fxs]` markup for one line of code.

```html
<a val
   val-set="(data) => { Val.Fx.Text.Set(this, data, { key: 'label' }); Val.Fx.Attr.Set(this, data, { key: 'url', attr: 'href' }); }"
   val-get="() => ({ ...Val.Fx.Text.Get(this, { key: 'label' }), ...Val.Fx.Attr.Get(this, { key: 'url', attr: 'href' }) })">Link</a>
```

```javascript
const link = dom.one('a');

link.vset({ label: 'Dog', url: '/dog' }); // sets text and href
link.vget(); // => { label: 'Dog', url: '/dog' }
```

Built-in and custom fx mix freely in the same tree. See [Methods](#methods) for the full surface.

## Methods

Val adds methods to `HTMLElement`. Each acts on the marked subtree of the element it is called on and returns the element, except the readers.

- `vset(data)` writes an object into the subtree.
- `vget()` reads the subtree back as an object. Reader.
- `vpatch(data)` merges the object into the current state, then writes.
- `vmodify(fn)` reads the state, passes it to `fn`, writes the result.
- `vappend(items, tpl)` adds items to the end of a list.
- `vprepend(items, tpl)` adds items to the start of a list.
- `varr(data, tpl)` writes an array as list items. Called with no argument it reads the list back as an array. Reader in that form.
- `vobj(data)` writes an object into the subtree. Called with no argument it reads the subtree as an object. Reader in that form.
- `vrender(data, tpl)` clears the element and renders one object from a template.
- `vval(data)` writes when given an argument and reads when called with none. Reader in that form.

```javascript
const article = dom.one('article');

article.vset({ title: 'Dog' });        // write
article.vget();                        // read
article.vpatch({ image: '/dog.jpg' }); // merge and write
article.vmodify((d) => ({ ...d, seen: true }));
```

### Attributes

- `val` marks an element for binding.
- `val-set` writes data into the element.
- `val-get` reads data from the element.
- `val-fx` names an fx instead of `val-set` and `val-get`.
- `val-key` names the field in the data object.
- `val-attr` names the attribute for the `Attr` fx.
- `val-tpl` selects the template for a list or render.
- `val-value` gives the `If` fx a value to match, so the element shows only when the field equals it.
- `val-fxs` marks the container that holds the child fx of the `Fxs` composition.

`val-set` and `val-get` run with `this` bound to the element. Any other `val-*` attribute is passed to an fx as a parameter.

`vset`, `vget`, and their kin act on the element itself when it carries the `val` attribute, and on its marked subtree when it does not.

Each method wraps the public `Val.*` API: `Val.Get`, `Val.Set`, `Val.Obj`, `Val.Arr`, `Val.Render`, `Val.Patch`, `Val.Append`, `Val.Prepend`, and `Val.Modify`. The same calls are available on `Val` for use without an element method.
