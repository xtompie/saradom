<?php
// Sidebar for the docs, by hand. Add a section or a link here.
// Hrefs are relative to the site root; the layout prefixes the base path per page.
return [
    '' => [
        ['Introduction', 'introduction.html'],
    ],
    // The five foundations — principles. Kept at exactly five (mirrors the home page).
    'Foundations' => [
        ['DOM State', 'dom-state.html'],
        ['Event attributes', 'event-attributes.html'],
        ['Action in context', 'action-in-context.html'],
        ['Modularization', 'modularization.html'],
        ['UX Performance', 'ux-performance.html'],
    ],
    // Toolkits — optional single-file modules you drop in when needed.
    'Toolkits' => [
        ['Util', 'util.html'],   // helper methods on built-in objects
        ['Val', 'val.html'],     // two-way binding between an object and the DOM
        ['Hx', 'hx.html'],       // htmx-style attributes wired to one function
        ['Notify', 'notify.html'], // up/down signals over the DOM, listeners as attributes
        ['Compute', 'compute.html'], // derived values that refresh themselves on DOM change
        ['Vld', 'vld.html'],     // form validation rules as a pure function, optional DOM wiring
    ],
    // Complete, working things to read — smallest first.
    'Examples' => [
        ['Visible', 'visible.html'],
        ['Filter', 'filter.html'],
        ['Todo list', 'todo.html'],
        ['Produce', 'produce.html'],
        ['Tic-tac-toe', 'tic-tac-toe.html'],
        ['Kanban', 'kanban.html'],
    ],
    // Longer, article-style write-ups on deeper subjects. Prose with small code blocks.
    'Topics' => [
        ['The simple way', 'the-simple-way.html'],
        ['Saradom vs Others', 'saradom-vs-others.html'],
    ],
];
