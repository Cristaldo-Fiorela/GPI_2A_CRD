const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET PUESTOS
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM Puesto';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener los puestos:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    res.json(results);
  });
});

module.exports = router;
