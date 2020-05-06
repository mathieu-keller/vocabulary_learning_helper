const getCookie = (cname: string): string => {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
};


const printErrorMessageInToast = (r: Response): void => {
    if (r.status >= 200 && r.status <= 299) {
        console.error(r.status + ": " + r.statusText, "status code is not expected.");
    } else {
        r.text().then(t => console.error(r.status + ": " + r.statusText, t));
    }
};

export function get<d>(url: string, getResponse: (data: d) => void, expectedCode = 200): void {
    const token = getCookie("token");
    fetch(url, {
        headers: token ? {token} : {}
    }).then((r: Response) => {
        if (r.status === expectedCode) {
            r.json().then((j: d) => getResponse(j));
        } else {
            printErrorMessageInToast(r);
        }
    }).catch(reason => console.error("error", reason));
}

export function post<d, r>(url: string, data: d, getResponse: (data: r) => void, expectedCode = 201): void {
    const token = getCookie("token");
    fetch(url, {
        method: 'POST',
        headers: token ? {'Content-Type': 'application/json', token} : {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }).then((r: Response) => {
        if (r.status === expectedCode) {
            r.json().then((j: r) => getResponse(j));
        } else {
            printErrorMessageInToast(r);
        }
    }).catch(reason => {
        console.error("error", reason);
    });
}

export function deleteCall<c, r>(url: string, data: c, getResponse: (data: r) => void, expectedCode = 200): void {
    const token = getCookie("token");
    fetch(url, {
        method: 'DELETE',
        headers: token ? {'Content-Type': 'application/json', token} : {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }).then((r: Response) => {
        if (r.status === expectedCode) {
            r.json().then((j: r) => getResponse(j));
        } else {
            printErrorMessageInToast(r);
        }
    }).catch(reason => console.error("error", reason));
}

