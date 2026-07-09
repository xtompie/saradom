# Saradom

Frontend architecture pattern. Build modular, scalable frontends in plain HTML
and JavaScript. No framework, no npm, no build step.

Documentation: https://xtompie.github.io/saradom/

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
