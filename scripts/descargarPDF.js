/**
 * Descarga un PDF de manera estética usando html2pdf.
 * @param {string} titulo - Título del PDF.
 * @param {string} contenidoHTML - Contenido HTML a convertir en PDF.
 * @param {string} nombreArchivo - Nombre del archivo PDF.
 */
export function descargarPDF(titulo, contenidoHTML, nombreArchivo = "documento.pdf") {
    // Crear un contenedor temporal
    const contenedor = document.createElement("div");
    contenedor.innerHTML = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="text-align:center;">${titulo}</h2>
            <div>${contenidoHTML}</div>
        </div>
    `;
    html2pdf()
        .set({
            margin: 10,
            filename: nombreArchivo,
            html2canvas: { scale: 2 },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
        })
        .from(contenedor)
        .save();
}

// Ejemplo para deportistas
document.addEventListener("click", async function(e) {
  if (e.target.classList.contains("btn-descargar")) {
    const id = e.target.getAttribute("data-id");
    const res = await fetch(`http://localhost:3000/deportistas/${id}`);
    if (!res.ok) {
      alert("No se pudo obtener la información.");
      return;
    }
    const deportista = await res.json();
    // Usa tu función descargarPDF aquí
    descargarPDF(
      "Estado de Cuenta - " + deportista.nombres,
      `<p><strong>Nombre:</strong> ${deportista.nombres} ${deportista.apellidos}</p>
       <p><strong>Categoría:</strong> ${deportista.categoria}</p>
       <p><strong>Estado de Pago:</strong> ${deportista.pago ? "Al día" : "Pendiente"}</p>`,
      `estado_${deportista.nombres}_${deportista.apellidos}.pdf`
    );
  }
  if (e.target.classList.contains("btn-eliminar")) {
    const id = e.target.getAttribute("data-id");
    eliminarItem(id, claveLS, () => mostrarItems(document.getElementById("categoria-select")?.value || "todas"));
  }
});


