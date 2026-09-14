App.Ui.Pin = (() => {
  const load = (scope) => JSON.parse(localStorage.getItem(scope.attr('ui-pin-store')) || '[]');
  const save = (scope, a) => localStorage.setItem(scope.attr('ui-pin-store'), JSON.stringify(a));

  const pinIt = (item, t) => {
    item.flag('ui-pin-on', true);
    t.append(item);
  };

  const unpinIt = (item, scope) => {
    item.flag('ui-pin-on', false);
    scope.one('[ui-pin-slot="' + item.attr('ui-pin-name') + '"]').append(item);
  };

  const Toggle = (btn) => {
    const scope = btn.up('[ui-pin-space]');
    const item = btn.up('[ui-pin-name]');
    const t = scope.one('[ui-pin-target]');
    const name = item.attr('ui-pin-name');
    const pins = load(scope);
    if (pins.includes(name)) { unpinIt(item, scope); save(scope, pins.filter((n) => n !== name)); }
    else { pinIt(item, t); save(scope, [...pins, name]); }
  };

  const Init = (script) => {
    const scope = script.up('[ui-pin-space]');
    const t = scope.one('[ui-pin-target]');
    if (!t) return;
    load(scope).each((name) => {
      const item = scope.one('[ui-pin-name="' + name + '"]');
      if (item) pinIt(item, t);
    });
  };

  return { Toggle, Init };
})();
