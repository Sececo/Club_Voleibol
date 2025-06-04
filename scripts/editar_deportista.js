window.mostrarEditarDeportista = async function(id) {
    console.log("Editando deportista id:", id); // <-- Agrega esto
    // Traer datos del backend
    const res = await fetch(`http://localhost:3000/deportistas/${id}`);
    if (!res.ok) return alert("No se pudo obtener la información.");
    const dep = await res.json();

    // Mostrar el modal y llenar los campos
    const modal = document.getElementById("modal-editar-deportista");
    modal.style.display = "flex";
    document.getElementById("edit-id").value = dep.id;
    document.getElementById("edit-nombres").value = dep.nombres || "";
    document.getElementById("edit-apellidos").value = dep.apellidos || "";
    document.getElementById("edit-telefono").value = dep.telefono || "";
    document.getElementById("edit-email").value = dep.email || "";
    document.getElementById("edit-password").value = "";
    document.getElementById("edit-categoria").value = dep.categoria || "benjamin";
    document.getElementById("edit-estado").value = dep.estado || "activo";
    document.getElementById("edit-pago").value = dep.pago ? "true" : "false";
    document.getElementById("editar-error-msg").textContent = "";

    // Cerrar modal al hacer clic fuera del contenido o en la X
    modal.onclick = function(e) {
        if (e.target === modal) modal.style.display = "none";
    };
    document.getElementById("cerrar-modal-editar").onclick = function() {
        modal.style.display = "none";
    };
};

document.getElementById("form-editar-deportista").onsubmit = async function(e) {
    e.preventDefault();
    const id = document.getElementById("edit-id").value;
    const nombres = document.getElementById("edit-nombres").value.trim();
    const apellidos = document.getElementById("edit-apellidos").value.trim();
    const telefono = document.getElementById("edit-telefono").value.trim();
    const email = document.getElementById("edit-email").value.trim();
    const password = document.getElementById("edit-password").value;
    const categoria = document.getElementById("edit-categoria").value;
    const estado = document.getElementById("edit-estado").value;
    const pago = document.getElementById("edit-pago").value === "true";
    const errorMsg = document.getElementById("editar-error-msg");

    // Validaciones
    if (!nombres || !apellidos) {
        errorMsg.textContent = "Nombre y apellidos son obligatorios.";
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errorMsg.textContent = "Correo no válido.";
        return;
    }
    if (!telefono.match(/^[0-9\-\+\s]{7,15}$/)) {
        errorMsg.textContent = "Teléfono no válido.";
        return;
    }

    // Construir el body
    const body = { nombres, apellidos, telefono, email, categoria, estado, pago };
    if (password) body.password = password;

    // Guardar cambios en el backend
    const res = await fetch(`http://localhost:3000/deportistas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });
    if (res.ok) {
        document.getElementById("modal-editar-deportista").style.display = "none";
        alert("Datos actualizados correctamente.");
        window.mostrarItems(document.getElementById("categoria-select")?.value || "todas");
    } else {
        errorMsg.textContent = "Error al actualizar los datos.";
    }
};

// Cierre del modal con la X y el botón Cancelar
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal-editar-deportista");
    const cerrarX = document.getElementById("cerrar-modal-editar");
    const btnCerrar = document.getElementById("cerrar-modal-editar-btn");
    if (cerrarX) cerrarX.onclick = () => modal.style.display = "none";
    if (btnCerrar) btnCerrar.onclick = () => modal.style.display = "none";
    window.onclick = function(event) {
        if (event.target === modal) modal.style.display = "none";
    }
});

document.addEventListener("click", function(e) {
    if (e.target.closest(".btn-editar")) {
        const id = e.target.closest("button").getAttribute("data-id");
        window.mostrarEditarDeportista(id);
    }
});