const HttpBuildQuery = (params) => {
    const enc = s => encodeURIComponent(s).replace(/%20/g, '+');
    const out = [];
    const walk = (key, val) => {
        if (val === true) val = "1";
        if (val === false) val = "0";
        if (val === null || val === undefined) return;
        if (typeof val === "object") {
            Object.entries(val).forEach(([k, v]) => walk(`${key}[${k}]`, v));
        } else {
            out.push(`${enc(key)}=${enc(val)}`);
        }
    };
    Object.entries(params).forEach(([k, v]) => walk(k, v));
    return out.join('&');
};
