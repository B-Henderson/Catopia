// Fetcher for SWR and mutations
// if there is a payload it will contain the method and body
// if there is no payload default to GET
export async function fetcher(url: string, payload?: { method?: string, body?: string }) {
  const options = {
    method: payload?.method || "GET",
    ...(payload?.body && { body: payload.body }),
    headers: {
      "Content-Type": "application/json",
    },
  };

  return fetch(url, options).then(res => {
    if (!res.ok) {
      return res.json().then(error => Promise.reject(error));
    }
    return res.json();
  });
}
