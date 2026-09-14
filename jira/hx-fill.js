(() => {
    const orig = window.fetch;
    let seq = 7;
    window.fetch = async (url, opts) => {
        if (!opts || !opts.body) {
            return orig(url, opts);
        }
        const body = opts.body;
        const res = await orig(url, { method: 'GET' });
        const text = await res.text();
        if (!text.includes('{{')) {
            return new Response(text, { status: res.status, statusText: res.statusText, headers: res.headers });
        }
        const params = body instanceof FormData ? body : new URLSearchParams(body);
        let out = text;
        for (const [k, v] of params.entries()) {
            out = out.replaceAll('{{' + k + '}}', v);
        }
        out = out.replaceAll('{{seq}}', String(++seq));
        return new Response(out, { status: res.status, statusText: res.statusText, headers: res.headers });
    };
})();
