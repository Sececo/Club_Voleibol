window.mostrarEditarDeportista = function(idx) {
    const deportistas = JSON.parse(localStorage.getItem("deportistas")) || [];
    const deportista = deportistas[idx];
    if (!deportista) return;

    // Crea un formulario modal simple
    let modal = document.getElementById("modal-editar-deportista");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "modal-editar-deportista";
        modal.style.position = "fixed";
        modal.style.top = "0";
        modal.style.left = "0";
        modal.style.width = "100vw";
        modal.style.height = "100vh";
        modal.style.background = "rgba(0,0,0,0.5)";
        modal.style.display = "flex";
        modal.style.alignItems = "center";
        modal.style.justifyContent = "center";
        modal.innerHTML = `
            <div style="background:#fff;padding:2em;border-radius:10px;min-width:300px;max-width:90vw;">
                <h3>Editar Deportista</h3>
                <form id="form-editar-deportista">
                    <label>Teléfono:<br>
                        <input type="text" id="edit-telefono" value="${deportista.telefono || ""}" />
                    </label><br><br>
                    <label>Email:<br>
                        <input type="email" id="edit-email" value="${deportista.email || ""}" />
                    </label><br><br>
                    <label>Contraseña:<br>
                        <input type="password" id="edit-password" placeholder="Nueva contraseña" />
                    </label><br><br>
                    <div id="editar-error-msg" style="color:red;margin-bottom:8px;"></div>
                    <button type="submit" class="btn-primary">Guardar</button>
                    <button type="button" class="btn-secondary" id="cancelar-editar">Cancelar</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
    } else {
        modal.style.display = "flex";
        document.getElementById("edit-telefono").value = deportista.telefono || "";
        document.getElementById("edit-email").value = deportista.email || "";
        document.getElementById("edit-password").value = "";
        document.getElementById("editar-error-msg").textContent = "";
    }

    // Cerrar modal
    document.getElementById("cancelar-editar").onclick = function() {
        modal.style.display = "none";
    };

    // Guardar cambios
    document.getElementById("form-editar-deportista").onsubmit = function(e) {
        e.preventDefault();
        const telefono = document.getElementById("edit-telefono").value.trim();
        const email = document.getElementById("edit-email").value.trim();
        const password = document.getElementById("edit-password").value.trim();
        const errorMsg = document.getElementById("editar-error-msg");

        // Validaciones simples
        if (!/^\+?[\d\s-]{7,15}$/.test(telefono)) {
            errorMsg.textContent = "Teléfono no válido.";
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errorMsg.textContent = "Correo no válido.";
            return;
        }
        if (password && password.length < 8) {
            errorMsg.textContent = "La contraseña debe tener mínimo 8 caracteres.";
            return;
        }

        // Guardar cambios
        deportista.telefono = telefono;
        deportista.email = email;
        if (password) deportista.password = password;

        deportistas[idx] = deportista;
        localStorage.setItem("deportistas", JSON.stringify(deportistas));
        modal.style.display = "none";
        alert("Datos actualizados correctamente.");
        // Refresca la lista
        if (window.mostrarItems) window.mostrarItems(document.getElementById("categoria-select")?.value || "todas");
    };
};