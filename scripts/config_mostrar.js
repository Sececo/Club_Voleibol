document.addEventListener("DOMContentLoaded", () => {
    // --- INICIALIZACIÓN Y CONFIGURACIÓN ---

    const contenedor = document.getElementById("lista-items");
    const mensajeNoItems = document.getElementById("mensaje-no-items");
    const filtroContainer = document.getElementById("filtro-categorias");

    // Claves en localStorage según tipo
    const clavesStorage = {
        deportistas: "jugadores",
        campeonatos: "campeonatos",
        equipos: "equipos"
    };

    // Campos para mostrar y filtrar según tipo
    const campos = {
        deportistas: {
            filtro: "categoria",
            titulo: "Nombre",
            camposMostrar: ["nombres", "apellidos", "categoria", "pago"]
        },
        campeonatos: {
            filtro: "categoria",
            titulo: "Nombre",
            camposMostrar: ["nombre", "categoria", "fecha", "estado"]
        },
        equipos: {
            filtro: "categoria",
            titulo: "Nombre",
            camposMostrar: ["nombre", "categoria", "estado"]
        }
    };

    const claveLS = clavesStorage[tipo];
    const filtroClave = campos[tipo].filtro;
}
