---
slug: modal
title: "Modal"
type: page
tags: [dialog, iframe, picker]
related: [the-simple-way]
track: tools
order: 55
status: draft
---

# Modal

Modal opens an existing app page in a fullscreen native `<dialog>` and returns one value to
a callback. The page inside is loaded by URL in an `<iframe>`, so it is an ordinary page,
not a rebuilt view.

<!-- source: Modal/Modal.js Modal/Modal.html -->

<!-- embed: Modal/Modal.js -->
<div class="demo"><!-- embed: content/modal/demo.html --></div>

```html
<button onclick="Modal.Open('/items', (item) =>
    item && (this.textContent = item.name)
)">Choose</button>
```

Clicking opens `/items` in the modal. The callback runs on close. It gets the chosen item,
or `null` when the modal is cancelled. Here a cancel does nothing, but the parent can act on
`null` if it needs to, such as clearing a state.

The page loaded in the iframe returns a value with `Result`, or closes with `Cancel`. `Esc`
on the body routes Escape to `Cancel`. It looks like this:

```html
<body onkeydown="Modal.Esc(event)">
  <ul>
    <li><button onclick="Modal.Result({ id: 1, name: 'Item 1' })">Item 1</button></li>
    <li><button onclick="Modal.Result({ id: 2, name: 'Item 2' })">Item 2</button></li>
  </ul>
  <button onclick="Modal.Cancel()">Cancel</button>
</body>
```

## Functions

`Modal.Open(url, callback)` opens the dialog. It loads `url` in the iframe. `callback` runs
when the modal closes, with the returned value or `null` on cancel.

`Modal.Result(data)` is called from the page inside the iframe. It closes the modal and runs
the callback with `data`.

`Modal.Cancel()` is called from the page inside the iframe. It closes the modal and runs the
callback with `null`.

`Modal.Esc(event)` is called from the page inside the iframe, on `onkeydown`. Escape closes
the modal the same as `Cancel`.

## Any page as a modal

This is the point of the pattern, and it is optional. Add `_modal=1` to any URL. The page
reads the flag and renders itself as a modal: no site chrome, transparent body, content in
the center. The same URL without the flag is a normal full page. With one flag every view
the app already has can open as a modal. No modal version of a screen is built.

## Reusing a list

An existing list opens as a picker, and it keeps working inside the modal. Its filter,
search, and paging reload the iframe the same as on a full page. To pick a row, the row
posts its own id back to the same list. The controller takes the id, loads that one row's
detail or renders an HTML fragment, and returns it with `Modal.Result`. The list carries
ids, not the full detail of every row, and that detail is built only for the row chosen.

## Loading

The dialog opens once the page is ready. A fast load shows the modal already full. A slow
load shows a loading state with a Cancel button first, then flips to the page. An iframe
reports no failed load, so a page that never answers stays on loading, and Cancel is the way
out.

## Support

Modal uses the native `<dialog>` element and `showModal`. It works in Chrome 37+, Firefox
98+, and Safari 15.4+. It does not use CSS anchor positioning, so it has no Chromium-only
limit.
</content>
