---
slug: why-jira-is-slow
title: "Why is Jira so slow?"
type: topic
tags: [jira, react, performance, case-study]
track: topics
order: 40
status: draft
---

# Why is Jira so slow?

The Jira issue page is a [React](https://react.dev/) single page application. Showing one issue takes **about 700 MB of RAM in Chrome** and 15.6 MB of transfer in 239 network requests. The weight is not the issue, it is the way the page is built: of its 9,810 React components, 54% are wrapping, not content: context providers, error boundaries, analytics, render profiling. Measured on a live Jira Cloud instance, July 2026.

This demo is the same page with the same interactions, in plain HTML and JavaScript on the Saradom pattern: inline editing, dropdowns, subtasks, comments, search, notifications, drag and drop. Everything ships as one HTML file, one CSS file, one JavaScript file. Demo: [the page](jira/). Source: [jira/ in the repository](https://github.com/xtompie/saradom/tree/main/jira).

The article walks the page mechanism by mechanism. It is a developer article, not a guide to tuning a Jira instance.

## One global

The app has one global variable.

```javascript
const App = {};
App.Ui = {};
window.App = App;
```

Each module is one file. It attaches itself: `App.Ui.Hx = (() => { ... })();`. Generic modules use attributes with the `ui-` prefix: `ui-dropdown-space`, `ui-pin-name`, `ui-shortcut-c`. Domain modules use their own name as the prefix: `subtask-`, `notif-`, `field-`.

SortableJS is the one outside library. It sets `window.Sortable` when it loads. The next script claims it, the way described in [The simple way](the-simple-way.html):

```javascript
App.Ui.Sortable = Sortable;
delete window.Sortable;
```

After that line the library is part of `App` and `window` is clean again.

## Collapse

The button in the top bar collapses the sidebar. The two do not know each other. The button announces a name. The layout element listens for that name.

```html
<div sidebar-toggle="() => this.flag('sidebar-off', !this.flag('sidebar-off'))">
  <nav sidebar-nav>...</nav>
  ...
</div>

<button onclick="this.nall('sidebar-toggle')">...</button>
```

```css
[sidebar-toggle]{display:grid;grid-template-columns:300px 1fr}
[sidebar-toggle][sidebar-off]{grid-template-columns:1fr}
[sidebar-toggle][sidebar-off] [sidebar-nav]{display:none}
```

`nall(name)` finds every element with an attribute called `name` and runs its value as a callback, with `this` set to that element. This is the [Notify](notify.html) toolkit. The `sidebar-toggle` attribute is the listener. The `sidebar-off` attribute is the state. CSS reads the state. There is no class toggling and no listener registration.

## Fragments

Parts of the page come from the server as HTML fragments. The [Hx](hx.html) toolkit reads htmx-style attributes: a method attribute with a URL, `hx-target` for where the response goes, `hx-swap` for how. `App.Ui.Hx(this)` triggers the request. The Development card loads its body on first open:

```html
<details class="pdetails" hx-get="fragments/development.html"
         hx-target="find .pcard-body" hx-swap="innerHTML"
         ontoggle="this.open && App.Ui.Hx(this)">
  <summary>Development</summary>
  <div class="pcard-body"><p>Loading…</p></div>
</details>
```

The open and close behavior is the native `<details>` element. The `ontoggle` attribute is its native event. One line of attributes adds the lazy load.

Hx attributes inherit. The element that triggers a request may not carry the method itself. Hx walks up through `closest` and takes the first method it finds. When one ancestor has `hx-get` and another has `hx-post`, GET wins. This bites inside lazily loaded menus: the menu carries `hx-get` for its own content, and a POST button inside it would inherit that GET. The button covers the inherited attribute with an empty one:

```html
<button notif hx-get="" hx-post="fragments/notif-read.html"
        hx-target="closest [notif] [notif-state]" hx-swap="outerHTML"
        onclick="App.Ui.Hx(this)">...</button>
```

`hx-get=""` is a shadow. It stops the walk before the ancestor and lets the button's own POST through.

## Dropdown

Every menu on the page is the [Dropdown](dropdown.html) toolkit: a `ui-dropdown-space` wrapper, a trigger, and a menu that is a native [popover](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API). Position comes from CSS anchors, scoped per instance, so no element needs an `id`. The app switcher also loads its content on open:

```html
<div ui-dropdown-space ui-dropdown-onopen="() => App.Ui.Hx(this.one('[ui-dropdown-menu]'))">
  <button ui-dropdown-trigger onclick="App.Ui.Dropdown.Toggle(this)">...</button>
  <div ui-dropdown-menu popover="manual" class="menu menu-start menu-apps"
       hx-get="fragments/app-switcher.html" hx-target="this" hx-swap="innerHTML">
    <p class="menu-empty">Loading…</p>
  </div>
</div>
```

Dropdown fires `ui-dropdown-onopen` and does not know what is attached to it. Hx exposes one function and does not know who calls it. The space declares the connection in one attribute.

Menus open on click with `Toggle`, or on focus with `Open`. The search field uses `Open`, so focusing the input opens the panel. Closing is routed once, on `body`:

```html
<body onkeydown="App.Ui.Shortcut.Route(this, event); App.Ui.Dropdown.Esc(event)"
      onpointerdown="App.Ui.Dropdown.Down(event)"
      onfocusout="App.Ui.Dropdown.Out(event)">
```

A click outside the space closes the menu. Tabbing out closes it. Escape closes it. The menu position is the attribute value: `ui-dropdown-menu="bottom-end"`, with CSS fallbacks that flip it when there is no room.

## Notifications

The bell shows an unread count. The panel loads through Hx. Clicking a notification POSTs, and the server response updates the count by itself.

The bell:

```html
<button ui-dropdown-trigger onclick="App.Ui.Dropdown.Toggle(this)">
  <svg class="ic"><use href="#i-bell"/></svg>
  <span class="badge" notif-total="3"
        notif-count="(n) => { const c = Number(n); this.textContent = c; this.attr('notif-total', c); this.hide(!c); }">3</span>
</button>
```

The server response to the POST is the read dot plus one line of behavior:

```html
<span class="notif-dot" notif-state></span>
<s-init run="() => this.nall('notif-count', document.al('[notif-unread]').length)"></s-init>
```

`s-init` runs its callback at the place it is inserted. Here it counts the remaining unread dots and announces the number. Two elements listen on `notif-count`: the badge at the bell and the "N unread" line in the panel. The server does not know the badge. The badge does not know the panel. The response carries one sentence: the unread count is N.

The panel itself is two files, named by state: `notifications-unread.html` and `notifications-read.html`. On open, the `notif-total` attribute at the bell picks which one loads. The panel arrives in the right state. Nothing is patched after loading. "Mark all as read" POSTs and gets the whole read-state panel back, which announces `notif-count` 0 on arrival.

## Sortable

`<s-sortable>` is a custom element that wraps SortableJS. The app switcher list from the previous section is one:

```html
<s-sortable class="apps-list" handle="[app-grip]" store="app-switcher">
  <a class="menu-item app-item" sort-item="jira" href="#">...</a>
  <a class="menu-item app-item" sort-item="confluence" href="#">...</a>
  <a class="menu-item app-item" sort-item="bitbucket" href="#">...</a>
  <a class="menu-item app-item" sort-item="trello" href="#">...</a>
  <s-init run="(el) => el.restore()"></s-init>
</s-sortable>
```

When a drag ends, the element collects `sort-item` names in DOM order and saves the array to `localStorage` under the `store` key. `restore()` reorders the children from that array. The `s-init` as last child calls it during parsing, before the page renders further, so there is no flicker and no `DOMContentLoaded` handler. The list above arrives inside an Hx fragment. Custom elements upgrade on insertion, so it works without any wiring.

On the element's own tag the attributes are bare: `handle`, `store`. On other elements they carry the module prefix: `sort-item`. The tag itself is the scope.

## Search

The search panel is a large widget with no new mechanism in it. The input opens the panel through `Dropdown.Open` on focus. The Jira and Home tabs are the [Switch](switch.html) toolkit. The recent list filters as it is typed into, with the [Filter](filter.html) toolkit. Typing in the main input POSTs to the results fragment. The filter sidebar collects its checked values in `hx-vals-body` and reloads the same fragment. A big widget is the same attributes as a small one, more times.

## Modal

Create and Delete are separate pages: `create.html`, `delete.html`. Each works as a page on its own. The [Modal](modal.html) toolkit opens one in a fullscreen dialog with an iframe:

```html
<button onclick="App.Ui.Modal.Open('create.html', (r) => r && this.nall('ui-toast', r.key + ' created'))">
  Create
</button>
```

The page inside ends itself with `Modal.Result(data)` or `Modal.Cancel()`. The dialog closes and the callback gets the result, or `null`. The two pages do not know each other. Here the callback announces `ui-toast` through Notify, and the toast element shows it for three seconds. The dialog calls `showModal()` only after the iframe has loaded, so a fast page appears in one paint with its content ready.

## Editing

The issue title is edited in place. There is no inline edit component. There is a pair of fragments that call each other: `title-show.html` and `title-edit.html`.

The show side. A click POSTs the current text and gets the editor back:

```html
<span class="edit-view" hx-post="fragments/title-edit.html" hx-fill
      hx-target="this" hx-swap="outerHTML"
      hx-vals-body="() => ({ value: this.textContent.trim() })"
      onclick="App.Ui.Hx(this, event)">{{value}}</span>
```

The edit side. Enter, blur, or the confirm button POSTs the input value and gets the show side back:

```html
<span class="edit-wrap">
  <input class="edit-input" type="text" value="{{value}}"
         hx-post="fragments/title-show.html" hx-fill
         hx-target="closest .edit-wrap" hx-swap="outerHTML"
         hx-vals-body="() => ({ value: this.value.trim() || '{{value}}' })"
         onblur="App.Ui.Hx(this, event)" onkeydown="...">
  <span class="edit-ctrls" onmousedown="event.preventDefault()">...</span>
  <s-init run="() => { const i = this.one('input'); i.focus(); i.select && i.select(); }"></s-init>
</span>
```

The state travels in the POST parameters. Show sends its `textContent`. Edit sends its input value. The DOM is the source of truth. The `s-init` in the response focuses and selects the input at the moment it appears. Escape has no logic of its own: it clicks the Cancel button, so there is one cancel path. The `onmousedown` on the controls prevents the input's blur from saving first.

Each editable thing is its own pair, named after itself: `field-show` and `field-edit` for the Details fields, `field-labels` and `field-labels-edit` for labels, `description-view` and `description-edit`, `comment-view` and `comment-edit`. A new editable place is a new pair of HTML files. No new JavaScript.

On this static demo, `hx-fill` substitutes the `{{value}}` placeholders from the POST body in the browser. It stands in for a backend, so the demo runs on GitHub Pages. It is not part of the pattern.

## Subtasks

The subtask table is a grid with [subgrid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Subgrid) rows. Header and rows share one set of columns without a `<table>`:

```css
.subs{display:grid;grid-template-columns:auto auto minmax(0,1fr) auto auto auto auto}
.subs-head, .subs-body, .sub{display:grid;grid-template-columns:subgrid;grid-column:1/-1}
```

The rows sit in an `<s-sortable>`, so they drag by their grip. The header sits outside it and stays aligned through the subgrid.

Status and assignee are Dropdown plus Hx. Each option carries its own payload:

```html
<button class="menu-item" hx-post="fragments/subtask-status.html" hx-fill
        hx-vals-body="() => ({ status: 'In Progress', state: 'progress' })"
        hx-target="closest [ui-dropdown-space] [subtask-status]" hx-swap="outerHTML"
        onclick="this.up('[popover]').hidePopover(); App.Ui.Hx(this, event)">...</button>
```

The option is self-contained. There is no dictionary in JavaScript mapping option names to values.

The progress bar computes itself. `<s-compute>` is the [Compute](compute.html) toolkit: a MutationObserver under its subtree, one batched recalculation per change:

```html
<s-compute run="() => {
  const rows = this.all('[subtask]');
  const done = rows.filter(r => r.one('[subtask-status]').textContent.trim() === 'Done').length;
  this.one('[subtask-count]').textContent = Math.round(done / rows.length * 100 || 0) + '% Done';
  ... }">
```

Changing a status, adding a row, or deleting a row updates the bar. Nothing calls a recalculation. The strike-through on a done subtask is CSS reading state:

```css
.sub:has([subtask-status][subtask-state="done"]) .sub-title{text-decoration:line-through}
```

## Activity

The All, Comments, History, and Work log tabs are Switch. A target can carry several tags, so "All" is not a special case:

```html
<label><input type="radio" name="show"
  onchange="App.Ui.Switch.To(this, '[ui-switch-space]', 'comment history worklog')">All</label>
<label><input type="radio" name="show" checked
  onchange="App.Ui.Switch.To(this, '[ui-switch-space]', 'comment')">Comments</label>
```

"Newest first" does not reorder the DOM. It flips one attribute value, and CSS reverses the rendering:

```html
<button onclick="const s = this.up('[ui-switch-space]'); s.attrt('activity-order','new','old'); ...">
```

```css
[ui-switch-space][activity-order="new"] .feed{display:flex;flex-direction:column-reverse}
```

The 👍 reaction on a comment is a hidden checkbox exchanged between two state fragments. `comment-unliked.html` holds an unchecked box that POSTs for the liked one. `comment-liked.html` holds a checked box that POSTs for the unliked one. The like state is which fragment is in the DOM. An `<s-compute>` over the feed adds the checked boxes to the base counts.

## Pin

Pin is one of the three modules written for this page. The Details panel pins fields to a shelf at the top, and the shelf is sortable. The design is four attributes and one storage key.

```html
<div ui-pin-space ui-pin-store="detail-properties">
  <s-sortable class="pinned" ui-pin-target store="detail-properties" handle="[field-grip]"></s-sortable>
  ...
  <div ui-pin-slot="due">
    <div class="field" field-name="due" ui-pin-name="due" sort-item="due">
      ... <button class="pin" onclick="App.Ui.Pin.Toggle(this)">...</button>
    </div>
  </div>
  <script>App.Ui.Pin.Init(document.currentScript)</script>
</div>
```

`ui-pin-name` is the identity of a pinnable thing. `ui-pin-slot` is its home: the place it returns to when unpinned. `ui-pin-target` is the shelf. `ui-pin-store` is the storage key on the scope. `Toggle` moves the element between its slot and the shelf and saves the list of pinned names.

The store is one ordered array of names. Membership and order are the same fact: which names are in the array, and in what order. Splitting them into two keys would mean two sources that can disagree.

The shelf is also an `<s-sortable>` with the same store key. Dragging a pinned field writes the same array that pinning writes. The field carries three attributes with equal values: `ui-pin-name="due"`, `sort-item="due"`, `field-name="due"`. Each module reads only its own attribute. The modules cooperate through equal values and a shared key. Neither has a reference to the other, and neither reads the other's attributes.

`Pin.Init(document.currentScript)` restores the pinned state in place, during parsing, the same way `s-init` and `restore()` work elsewhere on the page.

## Copy

Copy puts a value on the clipboard. Two attributes:

```html
<div ui-copy-space>
  <span ui-copy="https://example.atlassian.net/browse/SCRUM-1">SCRUM-1</span>
  <button onclick="App.Ui.Copy.Value(this)">...</button>
</div>
```

The button looks up in its own `ui-copy-space` for the `[ui-copy]` element. The value is the attribute, or the element's `textContent` when the attribute is empty. Feedback is the `title` attribute set to "Copied!" for a moment. The module is 10 lines.

## Shortcut

Shortcut turns a keystroke into a click on an element. The shortcut is the attribute name:

```html
<input type="search" ui-shortcut-slash="() => this.focus()" ui-shortcut-cc-k="() => this.focus()">
<button ui-shortcut-c="() => this.click()">Create</button>
```

One router sits on `body onkeydown`. It builds a name from the event: `c`, `slash`, `cc-k`. The `cc` part means Ctrl or Cmd, so one attribute covers both platforms. The router finds the element with that attribute and runs its callback. When focus is in an input and no modifier is held, the router does nothing, so typing text does not trigger shortcuts.

Adding a shortcut is adding an attribute to an element. There is no key map, no registration, and the shortcut lives on the element it serves. The module is 25 lines.

## Reuse

The page is a small set of mechanisms used many times.

* **Hx**: title, description, comments, replies, reactions, Details fields, subtask status and assignee, linked work, watchers, notifications, search results, app switcher, sidebar flyouts, Development, Automation. 26 fragment and partial files carry hx attributes.
* **Dropdown**: the `ui-dropdown-space` attribute appears 76 times across the page and its fragments: app switcher, notifications, account, help, settings, watchers, work type, epic, every status and assignee menu, sidebar flyouts, search.
* **Sortable**: 4 lists: app switcher, sidebar navigation, subtask rows, pinned fields.
* **Compute**: 3: subtask progress, reaction counts, watcher count.
* **Notify**: sidebar collapse, notification count, work type change, watcher state, toast.
* **Switch**: search tabs, activity tabs.
* **Filter**: the recent items list in search.
* **Fragment pairs**: title, field, labels, description, comment.
* **Modal**: the Create page and the Delete confirmation.

## Scope

The demo is not a Jira replacement. It has no analytics, no plugin system, no permissions, and no backend. Jira Cloud carries those, and they account for part of its weight. What the demo covers is the page itself: every interaction on the issue view, built without React.

Two visible things were left out. The rich text editor: the description edits in a plain `<textarea>` and comments in a plain input, where Jira has a WYSIWYG editor. And the pages behind the links: boards, backlog, project settings exist here as plain links.

## Numbers

The same issue view. Jira Cloud measured live. The demo measured as it ships: one HTML, one CSS, one JS file.

| metric | Jira Cloud | demo |
|---|---|---|
| network requests | 239 | 3 |
| transfer (compressed) | 15.6 MB | 42 KB |
| JavaScript files | 148 | 1 |
| JavaScript (compressed) | 15.5 MB | 22 KB |
| JavaScript (unpacked) | 77.3 MB | 71 KB |
| JS heap | ~205 MB | ~4 MB |
| component instances | 9,810 | 0 |
| globals added to `window` | ~297 | 1 |

Both columns draw the same screen. The difference is the runtime around it. Of the 9,810 component instances, 54% are infrastructure: contexts, error boundaries, analytics, observability. The demo has no component runtime, so that layer does not exist.

## Closing

The page has one global variable. State lives in DOM attributes, and CSS reads it there. Development runs the source files directly, with no build step. The JavaScript written for this page is three modules: Pin, Copy, Shortcut. The rest is toolkits reused as they are.

There is no business model anywhere in the code. No Task module, no User model, no JSON objects behind the page. Every module is a generic interface component, and most of them do not know what they are holding. Pin moves elements between slots. It does not know they are issue fields. Hx swaps fragments. It does not know one of them is a comment. Sortable orders children. It does not know they are subtasks. The page is the data.
