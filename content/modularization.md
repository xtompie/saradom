---
slug: modularization
title: "Modularization"
nav_title: "Modularization"
type: concept
tags: [foundations, modules, contract, styling, global-state]
related: [action-in-context, configurable-modules]
track: foundations
order: 40
status: draft
---

# Modularization

A module is an object. The private parts stay inside. The public functions are what the markup calls. The module name is the prefix for its attributes.

A module comes together from three parts:

1. The markup: elements tagged with the module's namespaced attributes.
2. The JavaScript: the object.
3. The contract: the markup names the attributes and calls the public functions. The JavaScript reads and writes the DOM through those same attributes.

## Object

The object is built by an [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE). The IIFE keeps the private parts inside and returns the public API.

```javascript
const Accordion = (() => {
  const item = (ctx) => { /* ... */ };
  const Show = (ctx) => { /* ... */ };
  const Init = (ctx) => { /* ... */ };
  return { Init, Show };
})();
```

```html
<div accordion-space>
  <div accordion-item> ... </div>
</div>
```

`Accordion` is the object. `accordion-*` is the markup. The object and the markup share one name.

## Instances

The same module can be placed many times on one page. Each instance keeps its own state. Two `accordion-space` blocks do not share it. One is open while the other stays closed. There is no instance list and no id to track. A module is written once and placed as often as the page needs.

## Naming

A big app has many modules. They are all under one object, `App`.

The name shows where each one is. The catalog is `App.Catalog`. A product in it is `App.Catalog.Product`. It can go deeper, like `App.Catalog.Product.Add`. A bigger app adds more names next to these, like `App.Ordering` and `App.Billing`.

There is no fixed way to group them.

This works like folders. A deeper level is one more dot, like one more folder.

## Signature

A module signature is the contract between the JavaScript and the HTML, without a type system. It lists the namespaced attributes, the values they hold, and the functions that run on them. It also shows nesting, where one part is inside another. That matters when a function depends on the hierarchy.

```
< todo-space>
    < todo-item todo-item-status="done|active">
        < onclick="Todo.Toggle(this)">

Todo.Save()
```

## Styling

A module keeps state in attributes. CSS can target those same attributes directly. The JavaScript reads and writes the attribute. The CSS styles from it. A restyle needs no change to the JavaScript. A class name that the JavaScript also sets would couple the two to the same name instead.

```css
[todo-item][todo-item-status="done"] { text-decoration: line-through; }
```

## Why

No module system to set up. A module is a plain object returned by an IIFE. There is no `import` graph and no bundler deciding what ships. A module is defined and it is there. A module is added by including a script. Deleting the script removes it.

Globals, on purpose. Modules are on the global scope. There is no IoC container and no event bus. The prefix keeps names apart, the same way BEM keeps CSS class names apart. It works by agreement, not by tooling.
