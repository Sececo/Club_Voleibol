// Obtener tipo y modo desde el DOM
export function tipoyModo() {
            const tipo = document.body.getAttribute("data-tipo"); // "deportistas", "campeonatos" o "equipos"
            const urlParams = new URLSearchParams(window.location.search);
            const modo = urlParams.get("modo") || "consultar"; // consultar o eliminar

            if (!["deportistas", "campeonatos", "equipos"].includes(tipo)) {
                console.error("Tipo inválido en data-tipo");
                return;
            } else {
                return { tipo, modo };
            }

}
