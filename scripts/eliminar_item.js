// --- FUNCIÓN PARA ELIMINAR ELEMENTO ---
    /**
     * Elimina el elemento seleccionado del localStorage y actualiza la lista.
     * @param {number} idx - Índice del elemento en el array.
     */
    export async function eliminarItem(id, tipo, refrescar) {
        if (!confirm("¿Seguro que quieres eliminar este elemento?")) return;
        let url = "";
        if (tipo === "deportistas") url = `http://localhost:3000/deportistas/${id}`;
        else if (tipo === "equipos") url = `http://localhost:3000/equipos/${id}`;
        else if (tipo === "campeonatos") url = `http://localhost:3000/campeonatos/${id}`;
        else return;
        const res = await fetch(url, { method: "DELETE" });
        if (res.ok) {
            alert("Elemento eliminado correctamente.");
            refrescar();
        } else {
            alert("Error al eliminar el elemento.");
        }
    }
