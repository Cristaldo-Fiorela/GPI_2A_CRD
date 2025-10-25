const express = require('express');
const router = express.Router();

// ejemplo de endpoint
router.get('/', (req, res) => {
  res.send('Hola desde integrantes');
});

module.exports = router;
