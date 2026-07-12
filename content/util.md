---
slug: util
title: "Util"
type: page
tags: [util]
related: [val, dom-state]
track: tools
order: 30
status: draft
---

# Util

Short helper methods on built-in objects like `HTMLElement` and `Array`. They make DOM and array code shorter.

<!-- source: Util/Util.js -->

```javascript
dom.al('[todo-item]').each(el => el.attrt('data-status', 'done', 'active'));

/* without Util:
document.querySelectorAll('[todo-item]').forEach(el => {
  const status = el.getAttribute('data-status');
  el.setAttribute('data-status', status === 'done' ? 'active' : 'done');
});
*/
```

## Selecting

```javascript
dom.al('[todo-item]');    // array of matches in the document
dom.one('[todo-add]');    // first match in the document
el.all('[todo-item]');    // array of matches inside el
el.one('[todo-add]');     // first match inside el
el.allfd('[todo-item]');  // matches inside el, without descending into a match
el.up('[todo-space]');    // el if it matches, else the nearest ancestor that does
el.up();                  // the parent
```

## Attributes

```javascript
el.attr('data-status');                     // read
el.attr('data-status', 'done');             // set
el.attr('data-status', null);               // remove
el.attrt('data-status', 'done', 'active');  // toggle between two values
el.flag('hidden');                          // read as a boolean
el.flag('hidden', true);                    // add the attribute; false removes it
```

## Attribute namespaces

`attrs` reads or writes a whole namespace of attributes as one object. It is like `dataset`, but for any prefix, and it keeps kebab keys instead of camelCasing them.

```html
<div card-val-title="Buy milk" card-val-color="red"></div>
```
```javascript
el.attrs('card-val');                     // { title: 'Buy milk', color: 'red' }
el.attrs('card-val', { color: 'blue' });  // sets card-val-color="blue", keeps title
el.attrs();                               // { card-val-title, card-val-color }
```

## Visibility

```javascript
el.show();       // show
el.hide();       // hide, display:none
el.show(false);  // hide
```

## Content

```javascript
el.clear();  // empty the element
tpl.tpl();   // clone a <template>'s first child
```

## Arrays

```javascript
arr.each(fn);  // forEach
arr.any();     // true when not empty
arr.none();    // true when empty
```

## Misc

```javascript
el.cls();                // its classList
event.combo('Ctrl+s');   // true when the key combo matches
'a long title'.cut(6);   // 'a long...'
```
