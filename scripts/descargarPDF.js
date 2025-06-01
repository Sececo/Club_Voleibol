

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


    