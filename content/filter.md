---
slug: filter
title: "Filter"
type: example
tags: [example, dom-state]
related: [dom-state, visible]
track: examples
order: 15
status: draft
---

# Filter

<div class="filter-demo">
<!-- embed: content/filter.html -->
</div>
<!-- embed: content/filter.css -->
<!-- embed: Filter/Filter.js -->

<!-- code: content/filter.html -->

<!-- code: Filter/Filter.js -->

The input is marked with `filter-query`. The handler goes up to the space and reads that element, so it never assumes it was called from the input itself. The trigger can be on the input, on a button next to it, or anywhere inside the space.

Each item carries its search text in the `filter-item` attribute. The query matches that value, not the visible text. So an item can match words it does not show, like a category. Typing `fruit` keeps Apple, Banana, and Cherry.

## Lanes

Like `Visible`, `Filter` can share a space with other mechanisms. A `filter-space` names a `filter-lane`, and each item belongs to that lane; the filter touches only its own lane's items. Without `filter-lane` it filters every `[filter-item]` in the space, unchanged.
