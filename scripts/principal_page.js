document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn-registrar-deportista").addEventListener("click", () => {
    window.location.href = "Botones/registro/registrar_deportista.html";
  });

  document.getElementById("btn-estado-cuenta").addEventListener("click", () => {
    window.location.href = "Botones/estado/estado_cuenta.html";
  });

  document.getElementById("btn-crear-equipo").addEventListener("click", () => {
    window.location.href = "Botones/crear_e/crear_equipo.html";
  });

  document.getElementById("btn-visualizar-equipo").addEventListener("click", () => {
    window.location.href = "Botones/visualizar/visualizar_equipos.html";
  });

  document.getElementById("btn-crear-campeonato").addEventListener("click", () => {
    window.location.href = "Botones/crear_c/crear_campeonato.html";
  });

  document.getElementById("btn-asociar-equipo").addEventListener("click", () => {
    window.location.href = "Botones/asociar/asociar_equipo.html";
  });
});
