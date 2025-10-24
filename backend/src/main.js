// seteo de servidor principal siguiendo la documentacion de Express https://expressjs.com/en/starter/hello-world.html

// importacion de libreria
const express = require('express');
// permite comunicacion entre back y front
const cors = require('cors');
// endpoints
const routes = require('./routes/integrantes');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// uso de rutas predefinidas
app.use('/crd', routes);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
})