// Fetcher for swr
// if there is a payload it will contain the method and body
// if there is no payload default to GET
// Supports array keys from swr (e.g., ['/api/endpoint', username]) for conditional fetching - extracts the URL (first element)
export async function fetcher(
  url: string | string[], 
  payload?: { method?: string, body?: string }
) {
  // if url is an array, use the 1st element as the url, the 2nd element is ignored
  // as it is used for refreshing the data
  const urlString = Array.isArray(url) ? url[0] : url
  
  const options = {
    method: payload?.method || "GET",
    ...(payload?.body && { body: payload.body }),
    headers: {
      "Content-Type": "application/json",
    },
  };

  return fetch(urlString, options).then(res => {
    if (!res.ok) {
      return res.json().then(error => Promise.reject(error));
    }
    return res.json();
  });
}
