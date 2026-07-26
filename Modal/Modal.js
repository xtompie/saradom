// window.Modal (not `const`): the page inside the iframe reaches it as window.parent.Modal.
window.Modal = (() => {
    const LOADING_DELAY_MS = 500;

    const clone = () => document.querySelector('[modal-tpl]').content.firstElementChild.cloneNode(true);

    const show = (modal) => {
        if (modal.open) return;
        document.body.setAttribute('modal-open', '');
        modal.showModal();
    };

    const Open = (url, callback) => {
        const modal = clone();
        const iframe = modal.querySelector('[modal-iframe]');
        modal._callback = callback || null;
        modal._result = null;

        modal.onclose = () => {
            modal.remove();
            document.body.removeAttribute('modal-open');
            // The callback runs on every close: the value from Result, or null from
            // Cancel, Escape and a backdrop click. The parent decides what null means.
            if (modal._callback) modal._callback(modal._result);
        };
        modal.onclick = (e) => {
            if (e.target === modal) modal.close();
        };

        // In the DOM but not shown yet: a fast load flips to ready in one tick,
        // a slow load shows the loading state first.
        document.body.appendChild(modal);

        let timer = setTimeout(() => {
            timer = null;
            show(modal);
        }, LOADING_DELAY_MS);

        iframe.onload = () => {
            iframe.onload = null;
            if (timer !== null) { clearTimeout(timer); timer = null; }
            modal.setAttribute('modal-state', 'iframe');
            show(modal);
        };

        iframe.src = url;
    };

    const active = () => document.querySelector('[modal-state]');

    const Result = (data) => {
        const modal = active();
        if (modal) { modal._result = data; modal.close(); return; }
        if (window.parent !== window) window.parent.Modal.Result(data);
    };

    const Cancel = () => {
        const modal = active();
        if (modal) { modal._result = null; modal.close(); return; }
        if (window.parent !== window) window.parent.Modal.Cancel();
    };

    // Inside an iframe there is no dialog to catch Escape. The page in the iframe routes
    // it up with <body onkeydown="Modal.Esc(event)">.
    const Esc = (e) => {
        if (e.key === 'Escape') { e.preventDefault(); Cancel(); }
    };

    return { Open, Result, Cancel, Esc };
})();
