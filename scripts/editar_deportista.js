window.mostrarEditarDeportista = async function(id) {
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
    document.getElementById("edit-email").value = dep.email || "";
    document.getElementById("edit-categoria").value = dep.categoria || "benjamin";
    document.getElementById("edit-estado").value = dep.estado || "activo";
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
    const email = document.getElementById("edit-email").value.trim();
    const categoria = document.getElementById("edit-categoria").value;
    const estado = document.getElementById("edit-estado").value;
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

    // Guardar cambios en el backend
    const res = await fetch(`http://localhost:3000/deportistas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombres, apellidos, email, categoria, estado })
    });
    if (res.ok) {
        document.getElementById("modal-editar-deportista").style.display = "none";
        alert("Datos actualizados correctamente.");
        window.mostrarItems(document.getElementById("categoria-select")?.value || "todas");
    } else {
        errorMsg.textContent = "Error al actualizar los datos.";
    }
};