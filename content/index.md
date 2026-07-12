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
<h1 class="wordmark">Saradom</h1>
<p class="tagline">Frontend architecture pattern</p>
<p class="sub">Build modular, scalable frontends in plain HTML and JavaScript.<br>There is no framework and no build step.</p>
<div class="cta-row">
<a class="cta" href="introduction.html">Get started <span class="cta-arrow">→</span></a>
<a class="cta-ghost" href="https://github.com/xtompie/saradom">GitHub <span class="cta-ext">↗</span></a>
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
<div class="rule"><div class="rule-name"><span class="rule-no">3</span> Action in context</div><div class="rule-text">Every event has a current element. That element sets the space where the action runs.</div></div>
<div class="rule"><div class="rule-name"><span class="rule-no">4</span> Modularization</div><div class="rule-text">A module is an object. The private parts stay inside. The public functions are what the markup calls. The module name is the prefix for its attributes.</div></div>
<div class="rule"><div class="rule-name"><span class="rule-no">5</span> UX Performance</div><div class="rule-text">The interface works as soon as the page loads. It does not wait for a JavaScript init like DOMContentLoaded.</div></div>
</div>

<p class="doc-next"><a href="introduction.html">Next: Introduction →</a></p>

<footer class="site-footer">
<div class="foot-brand"><span class="mark">Saradom</span> — frontend architecture pattern</div>
<nav class="foot-links">
<a href="https://github.com/xtompie/saradom">GitHub</a>
</nav>
</footer>
