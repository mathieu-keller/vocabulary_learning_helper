const printErrorMessageInToast = (r: Response): void => {
    if (r.status >= 200 && r.status <= 299) {
        console.error(r.status + ": " + r.statusText, "status code is not expected.");
    } else {
        r.text().then(t => console.error(r.status + ": " + r.statusText, t));
    }
};

export function get<d>(url: string, getResponse: (data: d) => void, expectedCode = 200): void {
    fetch(url).then((r: Response) => {
        if (r.status === expectedCode) {
            r.json().then((j: d) => getResponse(j));
        } else {
            printErrorMessageInToast(r);
        }
    }).catch(reason => console.error("error", reason));
}

type GetResponseType<r> = (data: r) => void;

export function post<d, r>(url: string, data: d, getResponse: null | GetResponseType<r>, expectedCode = 201): void {
    fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }).then((r: Response) => {
        if (r.status === expectedCode) {
            if (getResponse) {
                r.json().then((j: r) => getResponse(j));
            }
        } else {
            printErrorMessageInToast(r);
        }
    }).catch(reason => {
        console.error("error", reason);
    });
}

export function deleteCall<c, r>(url: string, data: c, getResponse: (data: r) => void, expectedCode = 200): void {
    fetch(url, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }).then((r: Response) => {
        if (r.status === expectedCode) {
            r.json().then((j: r) => getResponse(j));
        } else {
            printErrorMessageInToast(r);
        }
    }).catch(reason => console.error("error", reason));
}

