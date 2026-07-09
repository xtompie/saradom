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

A Saradom unit is one module. It comes together from three parts:

1. The markup: elements tagged with the module's namespaced attributes.
2. The JavaScript: an object built by an [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE), private inside, public API out.
3. The contract between them: the markup names the attributes and calls the public functions, and the JavaScript reads and writes the DOM through those same attributes.

## The module object

A module is an object built by an IIFE: private inside, public API out. Its name namespaces its attributes.

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

The module name is also the attribute prefix. `Accordion` is the object. `accordion-*` is the markup. The object and the markup share one name.

## Multiple instances

The same module can be placed many times on one page. Each instance keeps its own state.

State is stored in the DOM. Each action finds its space from the current element. So two `accordion-space` blocks on one page do not share state. One is open while the other stays closed. There is no instance list and no id to track. A module is written once and placed as often as the page needs.

## The module signature

A module signature is the contract between the JavaScript and the HTML, without a type system. It lists the namespaced attributes, the values they hold, and the functions that run on them. Nesting matters: it shows which parts are inside which, wherever a function depends on that hierarchy.

```
< todo-space>
    < todo-item todo-item-status="done|active">
        < onclick="Todo.Toggle(this)">

Todo.Save()
```

## Styling through the contract

A module keeps state in attributes, and CSS can target those same attributes directly. The JavaScript reads and writes the attribute, and the CSS styles from it, so a restyle needs no change to the JavaScript. A class name that the JavaScript also sets would couple the two to the same name instead.

```css
[todo-item][todo-item-status="done"] { opacity: .5; text-decoration: line-through; }
```

## Why

No module system to set up.
A module is a plain object returned by an IIFE. There is no `import` graph, no bundler
deciding what ships, no registration step. A module is defined and it is there. Add a
module by adding a script; remove it by deleting one.

Globals, on purpose.
Modules live on the global scope, and that is the point: no IoC container, no event bus, no
indirection nobody asked for. The prefix is the whole convention that keeps names apart,
the same way BEM keeps CSS class names apart, by agreement, not by tooling. Modules can
also nest under one object, as deep as a project wants.
