function getModo() {
  const params = new URLSearchParams(window.location.search);
  return params.get("modo") || "consultar";
}
const modo = getModo();