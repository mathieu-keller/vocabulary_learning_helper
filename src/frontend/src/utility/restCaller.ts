import {errorToast} from "./toast";

const printErrorMessageInToast = (r: Response): void => {
    if (r.status >= 200 && r.status <= 299) {
        errorToast(r.status + ": " + r.statusText, "status code is not expected.");
    } else {
        r.text().then(t => errorToast(r.status + ": " + r.statusText, t));
    }
};
type GetResponseType<r> = (data: r) => void;

function processResponse<d>(r: Response, expectedCode: number, getResponse?: null | GetResponseType<d>): void {
    if (r.status === expectedCode) {
        if (getResponse) {
            const contentType = r.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                r.json().then((j: d) => {
                    getResponse(j);
                });
            }
        }
    } else {
        printErrorMessageInToast(r);
    }
}

export function get<d>(url: string, getResponse?: null | GetResponseType<d>, expectedCode = 200): void {
    fetch(url).then((r: Response) => {
        processResponse(r, expectedCode, getResponse);
    }).catch(reason => console.error("error", reason));
}


export function post<d, r>(url: string, data: d | null, getResponse?: null | GetResponseType<r>, expectedCode = 201): void {
    fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }).then((r: Response) => {
        processResponse(r, expectedCode, getResponse);
    }).catch(reason => {
        console.error("error", reason);
    });
}

export function deleteCall<c, r>(url: string, data: c, getResponse: null | GetResponseType<r>, expectedCode = 200): void {
    fetch(url, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }).then((r: Response) => {
        processResponse(r, expectedCode, getResponse);
    }).catch(reason => console.error("error", reason));
}

