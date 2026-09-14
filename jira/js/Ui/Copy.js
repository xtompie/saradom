App.Ui.Copy = (() => {
  const Value = (ctx) => {
    const src = ctx.closest('[ui-copy-space]').querySelector('[ui-copy]');
    navigator.clipboard?.writeText(src.getAttribute('ui-copy') || src.textContent.trim());
    const old = ctx.getAttribute('title');
    ctx.setAttribute('title', 'Copied!');
    setTimeout(() => ctx.setAttribute('title', old), 1200);
  };
  return { Value };
})();
