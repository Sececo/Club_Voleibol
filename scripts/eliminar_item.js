// --- FUNCIÓN PARA ELIMINAR ELEMENTO ---
    /**
     * Elimina el elemento seleccionado del localStorage y actualiza la lista.
     * @param {number} idx - Índice del elemento en el array.
     */
    export function eliminarItem(idx, claveLS, refrescar) {
        if (!confirm("¿Seguro que quieres eliminar este elemento?")) return;
        let items = JSON.parse(localStorage.getItem(claveLS)) || [];
        if (idx < 0 || idx >= items.length) {
            alert("Elemento no válido.");
            return;
        }
        items.splice(idx, 1);
        localStorage.setItem(claveLS, JSON.stringify(items));
        refrescar();
    }
