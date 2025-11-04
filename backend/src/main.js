// seteo de servidor principal siguiendo la documentacion de Express https://expressjs.com/en/starter/hello-world.html

// importacion de libreria
const express = require('express');
// permite comunicacion entre back y front
const cors = require('cors');
// endpoints
const integrantesRoutes = require('./routes/integrantes');
const puestosRoutes = require('./routes/puestos');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// uso de rutas predefinidas
app.use('/api/integrantes', integrantesRoutes);
app.use('/api/puestos', puestosRoutes);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
})