const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ejemplo de endpoint
router.get('/', (req, res) => {
  res.send('Hola desde integrantes');
});

// Crear un integrante
router.post('/', (req, res) => {
  const { nombre, apellido, descripcion, foto_url } = req.body;

  if (!nombre || !apellido) {
    return res.status(400).json({ error: 'Nombre y apellido son obligatorios' });
  }

  const sql = 'INSERT INTO Integrante (nombre, apellido, descripcion, foto_url) VALUES (?, ?, ?, ?)';
  db.query(sql, [nombre, apellido, descripcion, foto_url], (err, result) => {
    if (err) {
      console.error('Error al insertar integrante:', err);
      return res.status(500).json({ error: 'Error al insertar integrante' });
    }
    res.status(201).json({ message: 'Integrante creado correctamente', id: result.insertId });
  });
});

//DELETE - Eliminar un integrante
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM Integrante WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar integrante:', err);
      return res.status(500).json({ error: 'Error al eliminar integrante' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Integrante no encontrado' });
    }

    res.json({ message: 'Integrante eliminado correctamente' });
  });
});

module.exports = router;
