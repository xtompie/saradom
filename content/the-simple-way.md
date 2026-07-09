---
slug: the-simple-way
title: "The simple way"
type: topic
tags: [scaling, frameworks]
track: topics
order: 20
status: draft
---

# The simple way

## Global scope

Every module on the global scope means many names, and the risk of a collision. One `App` object holds them all. It can also nest deeper, into its own namespace under `App`, when a project wants more separation.

```javascript
const App = {};
App.Visible = (() => { /* ... */ })();
App.Filter = (() => { /* ... */ })();
App.Configurator = App.Configurator || {};
App.Configurator.Package = (() => { /* ... */ })();
```

## Module reuse

The same file can serve more than one instance, by taking its config through the shared `exports` variable.

```javascript
// tabs.js
exports = (function (config = {}) {
    const p = config.prefix || 'tabs';
    const Select = (ctx) => { /* uses ${p}-space, ${p}-tab */ };
    return { Select };
})(exports);
```

```php
const App = {};

exports = { prefix: 'account' };
<?php echo file_get_contents('tabs.js') ?>
App.Account = exports;

exports = { prefix: 'billing' };
<?php echo file_get_contents('tabs.js') ?>
App.Billing = exports;
```

## Global reclamation

jQuery sets `window.jQuery` and `window.$` when it loads. Both names are in the global
scope, open to a collision with anything else that wants `$`.

```javascript
App.jQuery = jQuery;
delete window.$;
delete window.jQuery;
```

## Theme

Dark and light, one global bit of state, without the flash of unstyled content.

```html
<html app-theme>
<head>
    <script>
const App = {};
App.Theme = (() => {
    const Apply = (name) => document.querySelector('[app-theme]').setAttribute('app-theme', name);
    const Init = () => Apply(localStorage.getItem('theme') || 'light');
    const Set = (name) => { Apply(name); localStorage.setItem('theme', name); };
    return { Init, Set };
})();
App.Theme.Init();
    </script>
    <style>
[app-theme="dark"] { background: #111; color: #eee; }
[app-theme="light"] { background: #fff; color: #111; }
    </style>
</head>
<body>
</body>
</html>
```

## Change reaction

A badge in the header has to stay in sync with the cart, wherever the cart changes.

Option 1. `Cart` catches every `cart-onchange` element and runs it.

```html
<span cart-onchange="this.textContent = App.Cart.Count()"></span>
```

Option 2. `Cart` writes the count directly into every `cart-val-count` element.

```html
<span cart-val-count></span>
```

Option 3. `App.Info` assumes one instance on the page, which is fine for a widget like this. `Refresh` reads the cart and writes the count into `app-info-count`, and `Cart` calls it on every change.

```html
<span app-info-count></span>

<script>
App.Cart.OnChange(() => App.Info.Refresh());
App.Info.Refresh();
</script>
```

## Public state attributes

`Cart` owns these attributes, and updates the DOM to match its state.

```html
<span cart-val-hasdata="yes">Cart: <span cart-val-count></span></span>
<span cart-val-hasdata="no">Cart empty</span>
```

## Forms

Option 1. A plain form, submitted normally.

Option 2. Form data is sent, and the HTML response is swapped in, the way htmx does it.

Option 3. Val reads the fields, sends JSON, and renders the returned errors under the field.

Option 4. [Vld](vld.html) runs validation rules against the fields before any of the above, so the network only sees a submit once the shape is right.

## Toasts

```html
<script>
App.Toast = (() => {
    const Add = (kind, text) => {
        dom.one('[toast-space]').vappend([{ kind, text }]);
    };
    const Remove = (ctx) => ctx.up('[toast-item]').remove();
    const Error = (text) => Add('error', text);
    const Info = (text) => Add('info', text);
    const Success = (text) => Add('success', text);
    return { Add, Error, Info, Success, Remove };
})();
</script>

<div toast-space val-tpl="[toast-item-tpl]">
  <template toast-item-tpl>
    <div toast-item>
      <i val val-fx="Pattr" val-key="kind" val-attr="toast-item-kind" hidden></i>
      <span val val-fx="Text" val-key="text"></span>
      <button onclick="App.Toast.Remove(this)">×</button>
    </div>
  </template>
</div>
```

## Ancestor context

Two modules can react to each other without knowing about each other, as long as they
share one ancestor. The ancestor gives out two things: a call that writes a value, and an
attribute name that marks who wants to hear about it.

```html
<div configurator-space configurator-engine="standard">

  <select onchange="Configurator.Update(this, {engine: this.value})">
    <option value="standard" selected>Standard engine</option>
    <option value="performance">Performance engine</option>
  </select>

  <label configurator-onchange="Package.Sync(this)">
    <input type="checkbox" package-sport>
    Sport package
  </label>

</div>
```

Picking an engine calls `Configurator.Update`. It writes the new engine onto
`configurator-space`. It then finds every `configurator-onchange` element inside that
space and runs it.

`Package.Sync` is one such listener. It reads the engine from `configurator-space`. It
decides on its own whether the sport package stays enabled. `Configurator` never mentions
`Package` by name. `Package` only knows that it was woken up.

The whole block can repeat on one page. A page that compares two builds holds two
`configurator-space` blocks, each with its own engine and its own package.

## Modals

```html
<!-- parent page -->
<script>
const Modal = (function () {
    let callback;
    const Open = (url, cb) => {
        callback = cb;
        document.body.insertAdjacentHTML(
            'beforeend',
            `<modal><iframe src="${url}" style="width:100%;height:100%;border:0"></iframe></modal>`
        );
    };
    const Close = (data) => {
        if (data !== undefined) callback(data);
        document.querySelector('modal').remove();
    };
    return { Open, Close };
})();
</script>

<button onclick="Modal.Open('/items', (i) => this.textContent = i.name)">Choose</button>
```

```html
<!-- list page -->
<button onclick="window.parent.Modal.Close({ id: 1, name: 'Item 1' })">Item 1</button>
<button onclick="window.parent.Modal.Close({ id: 2, name: 'Item 2' })">Item 2</button>
```
