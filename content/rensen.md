---
slug: rensen
title: "Rensen"
type: page
tags: [reactive, computation]
related: [val]
track: tools
order: 50
status: draft
---

# Rensen

Rensen is a reactive system for JavaScript. It creates values that update automatically when their dependencies change.

<!-- source: Rensen/Rensen.js -->

```javascript
// values
const a = R(() => 1);
const b = R(() => 2);

// computed
const c = R(() => a() + b());

// effect
R(() => console.log(`c: ${c()}`));

// Initial output:
// c: 3

// Change `a`
a(() => 10);

// Outputs:
// c: 12
```

`R(() => ...)` creates a reactive value. Its function runs once at creation, and again each time a value it reads changes. `c` reads `a` and `b`, so a change to either one recomputes `c`.

This is the signals pattern. Most signal libraries split it into three primitives: a signal, a computed value, and an effect. Rensen uses one function, `R()`, for all three. `a` and `b` are signals, `c` is a computed value, and the `console.log` call is an effect.
