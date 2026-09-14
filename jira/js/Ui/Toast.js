App.Ui.Toast = (() => {

    const Show = (text) => {
        const el = dom.one('[ui-toast]');
        el.textContent = text;
        el.flag('ui-toast-on', true);
        clearTimeout(el._uiToast);
        el._uiToast = setTimeout(() => el.flag('ui-toast-on', false), 3000);
    };

    return { Show };
})();
