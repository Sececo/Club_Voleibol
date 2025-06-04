document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formEquipo');
  const categoriaEquipo = document.getElementById('categoria_equipo');
  const sexoEquipo = document.getElementById('sexo_equipo');

  // Mostrar error debajo del campo
  function mostrarError(input, mensaje) {
    eliminarError(input);
    const error = document.createElement('small');
    error.classList.add('error-message');
    error.textContent = mensaje;
    input.parentNode.appendChild(error);
    input.classList.add('input-error');
  }
  function eliminarError(input) {
    const parent = input.parentNode;
    const error = parent.querySelector('.error-message');
    if (error) parent.removeChild(error);
    input.classList.remove('input-error');
  }

  // Validar campos
  function validarCampo(input, fn, msg) {
    eliminarError(input);
    if (!fn(input.value.trim())) {
      mostrarError(input, msg);
      return false;
    }
    return true;
  }

  // Validaciones en tiempo real
  [
    {id: 'nombre_equipo', fn: val => val.length > 0, msg: 'Campo obligatorio.'}
  ].forEach(({id, fn, msg}) => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('input', () => {
        validarCampo(input, fn, msg);
      });
    }
  });

  // Guardar equipo
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Limpiar errores anteriores
    form.querySelectorAll('.error-message').forEach(e => e.remove());
    form.querySelectorAll('.input-error').forEach(i => i.classList.remove('input-error'));

    let errores = [];

    // Validaciones de campos
    const nombre = document.getElementById('nombre_equipo');
    const categoria = categoriaEquipo;
    const sexo = sexoEquipo;

    if (!validarCampo(nombre, val => val.length > 0, 'Campo obligatorio.')) errores.push(nombre);
    if (!validarCampo(categoria, val => !!val, 'Seleccione categoría.')) errores.push(categoria);
    if (!validarCampo(sexo, val => !!val, 'Seleccione sexo.')) errores.push(sexo);

    if (errores.length > 0) {
      const primerError = form.querySelector('.input-error');
      if (primerError) primerError.focus();
      return;
    }

    // Crear equipo en la base de datos
    try {
      const equipo = {
        nombre: nombre.value.trim(),
        categoria: categoria.value,
        sexo: sexo.value
      };
      const res = await fetch('http://localhost:3000/equipos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(equipo)
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Error al registrar equipo");
        return;
      }
      alert('Equipo registrado correctamente');
      form.reset();
    } catch (err) {
      alert("Error de conexión con el servidor");
    }
  });
});
