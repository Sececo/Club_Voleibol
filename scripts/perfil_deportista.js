document.addEventListener("DOMContentLoaded", function() {
  const deportistas = JSON.parse(localStorage.getItem("deportistas")) || [];
  const emailGuardado = localStorage.getItem("email");
  const deportista = deportistas.find(dep => dep.email === emailGuardado);

  if (deportista) {
    document.getElementById("nombre-perfil").textContent = deportista.nombres || deportista.nombre || deportista.usuario;
    document.getElementById("email-perfil").textContent = "Correo: " + deportista.email;
    document.getElementById("equipo-perfil").textContent = deportista.equipo ? "Equipo: " + deportista.equipo : "Sin equipo asignado";
    // Puedes agregar más campos aquí si lo deseas
  }
});