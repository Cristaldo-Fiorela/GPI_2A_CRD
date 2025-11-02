const express = require('express');
const router = express.Router();
const db = require('../config/db');
const connection = require('../config/db');

// ejemplo de endpoint
/*router.get('/', (req, res) => {
  res.send('Hola desde integrantes');
});*/

// Crear un integrante
router.post('/', (req, res) => {
  const { nombre, apellido, descripcion, foto_url,puesto_id } = req.body;
  if (!nombre || !apellido) {
    return res.status(400).json({ error: 'Nombre y apellido son obligatorios' });
  }

  const sql = 'INSERT INTO Integrante (nombre, apellido, descripcion, foto_url) VALUES (?, ?, ?, ?)';
  db.query(sql, [nombre, apellido, descripcion, foto_url], (err, result) => {
    if (err) {
      console.error('Error al insertar integrante:', err);
      return res.status(500).json({ error: 'Error al insertar integrante' });
    }
    const integranteId = result.insertId;
    const sql2 = 'INSERT INTO Integrante_Puesto (id_integrante, id_puesto) VALUES (?, ?)';
     db.query(sql2, [integranteId, puesto_id], (err, result) => {
    if (err) { 
      console.error('Error  al insertar puesto:', err);
      return res.status(500).json({ error: 'Error al crear el puesto' });
    }
    res.status(201).json({ message: 'Integrante creado correctamente', id: integranteId });
  });
  });
  
});

//READ integrantesd
router.get('/',(req,res)=>{
  const sql = `
  SELECT 
    i.id,
    i.nombre,
    i.apellido,
    i.descripcion,
    i.foto_url,
    i.fecha_registro,
    GROUP_CONCAT(p.nombre SEPARATOR ", ") AS Puesto
  FROM Integrante i
  LEFT JOIN Integrante_Puesto ip ON i.id = ip.id_integrante
  LEFT JOIN Puesto p ON ip.id_puesto = p.id
  GROUP BY i.id
`;

  db.query(sql,(error,results)=>{
    // Si hay un error, lo enviamos con un status 500 y usamos 'return' para salir.
        if (error) {
            console.error('Error al obtener integrantes:', error);
            return res.status(500).json({ error: 'Error interno del servidor al consultar la base de datos.' });
        }
    if(results.length>0){
      res.json(results);
    }else{
     res.status(404).send('No se encontraron integrantes.');
    }
  })
});

//READ integrantes por ID
router.get('/:id',(req,res)=>{
  const {id}=req.params
  const sql=`SELECT i.id, i.nombre,i.apellido,i.descripcion,i.foto_url,i.fecha_registro,GROUP_CONCAT(p.nombre SEPARATOR ',') AS Puesto FROM Integrante i INNER JOIN Integrante_Puesto ip ON i.id=ip.id_integrante INNER JOIN Puesto p ON ip.id_puesto = p.id WHERE i.id= ${id} GROUP BY i.id`;

  db.query(sql,(error,results)=>{
    // Si hay un error, lo enviamos con un status 500 y usamos 'return' para salir.
        if (error) {
            console.error('Error al obtener integrantes:', error);
            return res.status(500).json({ error: 'Error interno del servidor al consultar la base de datos.' });
        }
    if(results.length>0){
      res.json(results);
    }else{
     res.status(404).send('No se encontraron integrantes.');
    }
  })
  
});

//UPDATE Integrantes 
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, descripcion, foto_url, puestos } = req.body;

  //  Actualizar datos básicos
  const updateSql = `
    UPDATE Integrante
    SET nombre = ?, apellido = ?, descripcion = ?, foto_url = ?
    WHERE id = ?
  `;

  db.query(updateSql, [nombre, apellido, descripcion, foto_url, id], (err) => {
    if (err) {
      console.error('Error al actualizar integrante:', err);
      return res.status(500).json({ error: 'Error al actualizar integrante' });
    }

    //  Borrar los puestos actuales
    db.query('DELETE FROM Integrante_Puesto WHERE id_integrante = ?', [id], (err) => {
      if (err) {
        console.error('Error al eliminar puestos:', err);
        return res.status(500).json({ error: 'Error al eliminar puestos previos' });
      }

      //  Insertar nuevos puestos
      if (puestos && puestos.length > 0) {
        const values = puestos.map((p) => [id, p]);
        db.query('INSERT INTO Integrante_Puesto (id_integrante, id_puesto) VALUES ?', [values], (err) => {
          if (err) {
            console.error('Error al insertar nuevos puestos:', err);
            return res.status(500).json({ error: 'Error al asignar nuevos puestos' });
          }
          res.json({ message: 'Integrante actualizado correctamente' });
        });
      } else {
        res.json({ message: 'Integrante actualizado sin puestos asociados' });
      }
    });
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
