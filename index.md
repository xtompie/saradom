---
slug: home
title: "Saradom — frontend architecture pattern"
nav_title: "Introduction"
type: page
layout: landing
track: home
order: 0
status: draft
---

<header class="hero">
<p class="eyebrow">Frontend architecture pattern</p>
<h1 class="wordmark">Sara<span class="mark">dom</span></h1>
<p class="sub">Build modular, scalable frontends in plain HTML and JavaScript.<br>No framework, no npm, no build step.</p>
<div class="cta-row">
<a class="cta" href="introduction.html">Get started</a>
<a class="cta-ghost" href="https://github.com/xtompie/saradom">★ GitHub</a>
</div>
</header>

<div class="demo">
<div counter-space>
  <output counter-value>0</output>
  <button onclick="Counter.Inc(this)">+1</button>
</div>
</div>
<script>
const Counter = (() => {
  const Inc = (ctx) => {
    const el = ctx.closest('[counter-space]').querySelector('[counter-value]');
    el.textContent = +el.textContent + 1;
  };
  return { Inc };
})();
</script>

```html
<div counter-space>
  <output counter-value>0</output>
  <button onclick="Counter.Inc(this)">+1</button>
</div>

<script>
const Counter = (() => {
  const Inc = (ctx) => {
    const el = ctx.closest('[counter-space]').querySelector('[counter-value]');
    el.textContent = +el.textContent + 1;
  };
  return { Inc };
})();
</script>
```

<p class="kicker">Foundation</p>

<div class="rules">
<div class="rule"><div class="rule-name"><span class="rule-no">1</span> DOM State</div><div class="rule-text">State is stored in the DOM. State is not stored in JavaScript variables.</div></div>
<div class="rule"><div class="rule-name"><span class="rule-no">2</span> Event attributes</div><div class="rule-text">Events are set in HTML attributes. Events are not dynamically bound with addEventListener.</div></div>
<div class="rule"><div class="rule-name"><span class="rule-no">3</span> Action in context</div><div class="rule-text">The event has a current DOM element from which the operating space is determined.</div></div>
<div class="rule"><div class="rule-name"><span class="rule-no">4</span> Modularization</div><div class="rule-text">A module is an object built by an IIFE: private inside, public API out. Its name namespaces its attributes.</div></div>
<div class="rule"><div class="rule-name"><span class="rule-no">5</span> High UX Performance</div><div class="rule-text">Instant initialization, seamless loading interface, responsive interaction.</div></div>
</div>

<p class="doc-next"><a href="introduction.html">Next: Introduction →</a></p>

<footer class="site-footer">
<div class="foot-brand"><span class="mark">Saradom</span> — frontend architecture pattern</div>
<nav class="foot-links">
<a href="https://github.com/xtompie/saradom">GitHub</a>
</nav>
</footer>
