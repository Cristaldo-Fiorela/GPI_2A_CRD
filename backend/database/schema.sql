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
