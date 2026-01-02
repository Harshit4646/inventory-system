export async function api(url, method="GET", body=null){
  const res = await fetch(url, {
    method,
    headers: { "Content-Type":"application/json" },
    body: body ? JSON.stringify(body) : null
  });
  return res.json();
}
