async function processResponse<d>(r: Response, expectedCode: number): Promise<d | string> {
  if (r.status === expectedCode) {
    const contentType = r.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return await r.json() as d;
    }
  }
  return await r.text();
}

export async function get<d>(url: string, expectedCode = 200): Promise<d | string> {
  const response = await fetch(url);
  return processResponse<d>(response, expectedCode);
}


export async function post<d, r>(url: string, data: d | null, expectedCode = 201): Promise<r | string> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  });
  return processResponse<r>(response, expectedCode);
}

export async function deleteCall<c, r>(url: string, data: c, expectedCode = 200): Promise<r | string> {
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  });
  return processResponse<r>(response, expectedCode);
}

