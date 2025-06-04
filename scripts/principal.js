document.addEventListener("DOMContentLoaded", function() {
    document.querySelector(".btn-descargar-pdf")?.addEventListener("click", function() {
        const contenedor = document.createElement("div");
        contenedor.innerHTML = `
            <div style="font-family: Arial, sans-serif; font-size: 12pt; padding: 20px;">
                <h2 style="text-align:center; color:#E85B26; font-weight:bold;">Bienvenido al Club Deportivo de Voleibol Chaina</h2>
                <p>Este es un ejemplo de PDF generado desde el menú principal.</p>
            </div>
        `;
        html2pdf()
            .set({
                margin: 10,
                filename: "club_voleybol.pdf",
                html2canvas: { scale: 2 },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
            })
            .from(contenedor)
            .save();
    });
});