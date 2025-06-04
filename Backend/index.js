const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_cKsFPQSDgp25@ep-twilight-violet-a8f9c5bp-pooler.eastus2.azure.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

// --- ADMINISTRADOR ---
app.post('/administradores', async (req, res) => {

  const { nombre, email, password } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO administrador (nombre, correo, password)
       VALUES ($1, $2, $3) RETURNING *`,
      [nombre, email, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      res.status(400).json({ error: 'El correo ya está registrado.' });
    } else {
      console.log(email);
      console.error(error);
      res.status(500).json({ error: 'Error al registrar administrador' });
    }
  }
});

// --- DEPORTISTAS ---
app.post('/deportistas', async (req, res) => {
  const {
    nombres, apellidos, usuario, password, fecha_nacimiento, sexo,
    telefono, tipo_documento, documento, email, categoria, pago, estado,
    nombre_tutor, fecha_nacimiento_tutor, tipo_documento_tutor, documento_tutor, telefono_tutor, email_tutor
  } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO deportistas 
      (nombres, apellidos, usuario, password, fecha_nacimiento, sexo, telefono, tipo_documento, documento, email, categoria, pago, estado,
      nombre_tutor, fecha_nacimiento_tutor, tipo_documento_tutor, documento_tutor, telefono_tutor, email_tutor)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,COALESCE($12, TRUE),COALESCE($13, 'activo'),
      $14,$15,$16,$17,$18,$19) RETURNING *`,
      [
        nombres, apellidos, usuario, password, fecha_nacimiento, sexo, telefono, tipo_documento, documento, email, categoria,
        pago, estado,
        nombre_tutor, fecha_nacimiento_tutor, tipo_documento_tutor, documento_tutor, telefono_tutor, email_tutor
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      res.status(400).json({ error: 'El documento, usuario o email ya existe.' });
    } else {
      console.error(error);
      res.status(500).json({ error: 'Error al registrar deportista' });
    }
  }
});

// --- EQUIPOS ---
app.post('/equipos', async (req, res) => {
  const { nombre, categoria, sexo } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO equipos (nombre, categoria, sexo)
       VALUES ($1, $2, $3) RETURNING *`,
      [nombre, categoria, sexo]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    // Manejo de errores...
  }
});

// --- CAMPEONATOS ---
app.post('/campeonatos', async (req, res) => {
  const { nombre, fecha, hora, sede, categoria } = req.body;
  console.log("Datos recibidos:", { nombre, fecha, hora, sede, categoria });
  try {
    const result = await pool.query(
      `INSERT INTO campeonatos (nombre, fecha, hora, sede, categoria)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nombre, fecha, hora, sede, categoria]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.detail || "Error al registrar campeonato" });
  }
});

// Asociar deportistas a equipo
app.post('/equipo_deportista', async (req, res) => {
  const { equipo_id, deportistas } = req.body;
  try {
    for (const deportista_id of deportistas) {
      await pool.query(
        `INSERT INTO equipo_deportista (equipo_id, deportista_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [equipo_id, deportista_id]
      );
    }
    res.status(201).json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al asociar deportistas a equipo' });
  }
});

// Asociar equipos a campeonato
app.post('/campeonato_equipo', async (req, res) => {
  const { campeonato_id, equipos } = req.body;
  try {
    for (const equipo_id of equipos) {
      await pool.query(
        'INSERT INTO campeonato_equipo (campeonato_id, equipo_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [campeonato_id, equipo_id]
      );
    }
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al asociar equipos al campeonato' });
  }
});

// Registrar un nuevo administrador
app.post('/administradores', async (req, res) => {
  const { nombre, email, password } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO administrador (nombre, correo, password)       VALUES ($1, $2, $3) RETURNING *`,
      [nombre, email, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      res.status(400).json({ error: 'El correo ya está registrado.' });
    } else {
      console.log(email);
      console.log(correo);
      console.log(nombre);
      console.error(error); // <-- Aquí verás el error real en consola
      res.status(500).json({ error: 'Error al registrar administrador' });
    }
  }
});

// Login de administrador
app.post('/login_admin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      `SELECT * FROM administrador WHERE correo = $1 AND password = $2`,
      [email, password]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// Obtener todos los equipos
app.get('/equipos', async (req, res) => {
  const result = await pool.query('SELECT * FROM equipos');
  res.json(result.rows);
});

// Obtener un equipo por id
app.get('/equipos/:id', async (req, res) => {
  const result = await pool.query('SELECT * FROM equipos WHERE id=$1', [req.params.id]);
  res.json(result.rows[0]);
});

// Actualizar equipo
app.put('/equipos/:id', async (req, res) => {
  const { nombre, categoria, sexo } = req.body;
  await pool.query(
    'UPDATE equipos SET nombre=$1, categoria=$2, sexo=$3 WHERE id=$4',
    [nombre, categoria, sexo, req.params.id]
  );
  res.json({ success: true });
});

// Eliminar equipo
app.delete('/equipos/:id', async (req, res) => {
  await pool.query('DELETE FROM equipos WHERE id=$1', [req.params.id]);
  res.json({ success: true });
});

// Obtener todos los deportistas
app.get('/deportistas', async (req, res) => {
  const result = await pool.query('SELECT * FROM deportistas');
  res.json(result.rows);
});

// Obtener todos los campeonatos
app.get('/campeonatos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM campeonatos');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener campeonatos" });
  }
});

// Eliminar campeonato
app.delete('/campeonatos/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM campeonatos WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar campeonato' });
  }
});

// Actualizar deportista
app.put('/deportistas/:id', async (req, res) => {
  const { nombres, apellidos, telefono, email, categoria, estado, pago, password } = req.body;
  try {
    if (password && password.trim() !== "") {
      // Si se envía nueva contraseña, actualiza todo incluido password
      await pool.query(
        `UPDATE deportistas SET 
          nombres=$1, apellidos=$2, telefono=$3, email=$4, categoria=$5, estado=$6, pago=$7, password=$8
         WHERE id=$9`,
        [nombres, apellidos, telefono, email, categoria, estado, pago, password, req.params.id]
      );
    } else {
      // Si no se envía password, no la cambia
      await pool.query(
        `UPDATE deportistas SET 
          nombres=$1, apellidos=$2, telefono=$3, email=$4, categoria=$5, estado=$6, pago=$7
         WHERE id=$8`,
        [nombres, apellidos, telefono, email, categoria, estado, pago, req.params.id]
      );
    }
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar deportista' });
  }
});

// Obtener un deportista por id
app.get('/deportistas/:id', async (req, res) => {
  const result = await pool.query('SELECT * FROM deportistas WHERE id=$1', [req.params.id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'No encontrado' });
  }
  res.json(result.rows[0]);
});

app.get('/equipo_deportista', async (req, res) => {
  const result = await pool.query('SELECT * FROM equipo_deportista');
  res.json(result.rows);
});

app.listen(3000, () => {
  console.log('✅ Servidor backend corriendo en http://localhost:3000');
});
