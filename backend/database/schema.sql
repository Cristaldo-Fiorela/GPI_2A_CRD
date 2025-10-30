CREATE DATABASE Integrantes;
USE Integrantes;  
-- Tabla de Puestos (cargos predefinidos)
CREATE TABLE Puesto (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL
);

-- Tabla de Integrantes
CREATE TABLE Integrante (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  descripcion TEXT,
  foto_url VARCHAR(255),
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Relación muchos-a-muchos entre Integrante y Puesto
CREATE TABLE Integrante_Puesto (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_integrante INT NOT NULL,
  id_puesto INT NOT NULL,
  FOREIGN KEY (id_integrante) REFERENCES Integrante(id) ON DELETE CASCADE,
  FOREIGN KEY (id_puesto) REFERENCES Puesto(id) ON DELETE CASCADE
);

-- Cargar algunos puestos por defecto
INSERT INTO Puesto (nombre) VALUES
('Frontend Developer'),
('Backend Developer'),
('Diseñador UX/UI'),
('Tester QA'),
('Project Manager');

-- Insertar integrantes de ejemplo
INSERT INTO Integrante (nombre, apellido, descripcion, foto_url)
VALUES
('Fiorela', 'Cristaldo', 'Desarrolladora full stack apasionada por React y Node.js', 'https://i.pravatar.cc/150?img=1'),
('Lucas', 'Gómez', 'Backend developer especializado en APIs con Express y MySQL', 'https://i.pravatar.cc/150?img=2'),
('Martina', 'Ríos', 'UX/UI designer enfocada en accesibilidad y experiencia de usuario', 'https://i.pravatar.cc/150?img=3');

-- Asignar puestos a los integrantes
INSERT INTO Integrante_Puesto (id_integrante, id_puesto)
VALUES
(1, 1),  -- Fiorela → Frontend Developer
(2, 2),  -- Lucas → Backend Developer
(3, 3);  -- Martina → UX/UI Designer
