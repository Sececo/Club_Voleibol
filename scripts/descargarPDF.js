function descargarPDF(titulo, contenidoHTML, nombreArchivo = "documento.pdf") {
    const contenedor = document.createElement("div");
    contenedor.innerHTML = `
        <div style="font-family: Arial, sans-serif; font-size: 12pt; padding: 20px;">
            <h2 style="text-align:center; color:#E85B26; font-weight:bold;">${titulo}</h2>
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
};

document.addEventListener("click", async function(e) {
  // PDF de deportista
  if (e.target.closest(".btn-descargar-deportista")) {
    const btn = e.target.closest(".btn-descargar-deportista");
    const id = btn.getAttribute("data-id");
    const res = await fetch(`http://localhost:3000/deportistas/${id}`);
    if (!res.ok) return alert("No se pudo obtener la información.");
    const d = await res.json();
    descargarPDF(
      "Ficha Deportista",
      `<p><b>Nombre:</b> ${d.nombres} ${d.apellidos}</p>
       <p><b>Usuario:</b> ${d.usuario}</p>
       <p><b>Documento:</b> ${d.tipo_documento} ${d.documento}</p>
       <p><b>Fecha de Nacimiento:</b> ${d.fecha_nacimiento}</p>
       <p><b>Sexo:</b> ${d.sexo}</p>
       <p><b>Teléfono:</b> ${d.telefono}</p>
       <p><b>Email:</b> ${d.email}</p>
       <p><b>Categoría:</b> ${d.categoria}</p>
       <p><b>Pago:</b> ${d.pago ? "Al día" : "Pendiente"}</p>
       <p><b>Estado:</b> ${d.estado}</p>`,
      `deportista_${d.nombres}_${d.apellidos}.pdf`
    );
  }

  // PDF de equipo
  if (e.target.closest(".btn-descargar-equipo")) {
    const btn = e.target.closest(".btn-descargar-equipo");
    const id = btn.getAttribute("data-id");
    const res = await fetch(`http://localhost:3000/equipos/${id}`);
    if (!res.ok) return alert("No se pudo obtener el equipo.");
    const equipo = await res.json();

    // Traer jugadores asociados
    const resAsoc = await fetch(`http://localhost:3000/equipo_deportista`);
    const asociaciones = await resAsoc.json();
    const deportistasIds = asociaciones.filter(a => a.equipo_id == id).map(a => a.deportista_id);

    let jugadores = "";
    if (deportistasIds.length) {
      const resJug = await fetch(`http://localhost:3000/deportistas`);
      const todos = await resJug.json();
      jugadores = todos
        .filter(d => deportistasIds.includes(d.id))
        .map(d => `<li>${d.nombres} ${d.apellidos} (${d.documento})</li>`)
        .join("");
    }

descargarPDF(
      "Ficha Equipo",
      `<p><b>Nombre:</b> ${equipo.nombre}</p>
       <p><b>Categoría:</b> ${equipo.categoria}</p>
       <p><b>Sexo:</b> ${equipo.sexo}</p>
       <hr>
       <b>Jugadores:</b>
       <ul>${jugadores || "<i>Sin jugadores asociados</i>"}</ul>
      `,
      `equipo_${equipo.nombre}.pdf`
    );
  }

  // PDF de campeonato
  if (e.target.closest(".btn-descargar-campeonato")) {
    const btn = e.target.closest(".btn-descargar-campeonato");
    const id = btn.getAttribute("data-id");
    const res = await fetch(`http://localhost:3000/campeonatos/${id}`);
    if (!res.ok) return alert("No se pudo obtener la información.");
    const camp = await res.json();

    // Traer equipos asociados
    const resAsoc = await fetch(`http://localhost:3000/campeonato_equipo`);
    const asociaciones = await resAsoc.json();
    const equiposIds = asociaciones.filter(a => a.campeonato_id == id).map(a => a.equipo_id);

    let equiposHtml = "";
    if (equiposIds.length) {
      const resEq = await fetch(`http://localhost:3000/equipos`);
      const todos = await resEq.json();
      equiposHtml = todos
        .filter(eq => equiposIds.includes(eq.id))
        .map(eq => `<li>${eq.nombre} (${eq.categoria}, ${eq.sexo})</li>`)
        .join("");
    }

descargarPDF(
      "Ficha Campeonato",
      `<p><b>Nombre:</b> ${camp.nombre}</p>
       <p><b>Fecha:</b> ${camp.fecha}</p>
       <p><b>Hora:</b> ${camp.hora}</p>
       <p><b>Sede:</b> ${camp.sede}</p>
       <p><b>Categoría:</b> ${camp.categoria}</p>
       <hr>
       <b>Equipos Asociados:</b>
       <ul>${equiposHtml || "<i>Sin equipos asociados</i>"}</ul>
      `,
      `campeonato_${camp.nombre}.pdf`
    );
  }
});


