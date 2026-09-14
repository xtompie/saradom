---
title: "Todo list"
---

# Todo list

<div class="todo-demo">
<!-- embed: content/todo.html -->
</div>
<!-- embed: content/todo.css -->
<!-- embed: Util/Util.js -->
<!-- embed: Val/Val.js -->
<!-- embed: content/Todo.js -->

<!-- code: content/todo.html -->

<!-- code: content/Todo.js -->

The `todo-item-status` attribute is a contract. The HTML, the JavaScript, and the CSS all use it. The CSS styles the done item straight from the attribute. There is no `active` class toggled in JavaScript, so changing the style never means changing the code.

```css
[todo-item][todo-item-status="done"] [todo-item-text] {
  text-decoration: line-through;
}
```
