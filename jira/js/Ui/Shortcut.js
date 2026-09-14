App.Ui.Shortcut = (() => {
  const NAMED = { '/': 'slash', '.': 'dot', ',': 'comma', ' ': 'space', '?': 'question', '"': 'quote', "'": 'apos', 'escape': 'esc' };

  const Token = (e) => NAMED[e.key] || NAMED[e.key.toLowerCase()] || e.key.toLowerCase();

  const Names = (e, token) => {
    const primary = e.ctrlKey ? 'ctrl' : e.metaKey ? 'cmd' : null;
    const tail = [];
    if (e.altKey) tail.push('alt');
    if (e.shiftKey) tail.push('shift');
    const build = (p) => [p, ...tail, token].filter(Boolean).join('-');
    return primary ? [build(primary), build('cc')] : [build(null)];
  };

  const Route = (root, e) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName);
    if (typing && !(e.ctrlKey || e.metaKey)) return;
    for (const name of Names(e, Token(e))) {
      const el = document.one('[ui-shortcut-' + name + ']');
      if (el) { e.preventDefault(); el.run('ui-shortcut-' + name); return; }
    }
  };

  return { Route };
})();
