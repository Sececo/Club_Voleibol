function cerrarSesion() {
  localStorage.removeItem("email");
  localStorage.removeItem("usuario");
  localStorage.removeItem("password");
  window.location.href = "index.html";
}