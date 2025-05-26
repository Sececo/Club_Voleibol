document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modalConfirmacion");
    const btnConfirm = document.querySelector(".confirm");
    const btnCancel = document.querySelector(".cancel");
    const btnSalir = document.querySelector(".salir");

    // Mostrar modal
    btnSalir.addEventListener("click", () => {
        modal.style.display = "block";
    });

    // Cerrar modal
    btnCancel.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Confirmar salida
    btnConfirm.addEventListener("click", () => {
        window.location.href = "index.html";
    });

    // Cerrar modal si se hace clic fuera de él
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
});
