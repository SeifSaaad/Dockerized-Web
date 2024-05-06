CREATE DATABASE IF NOT EXISTS team_database;

USE team_database;

CREATE TABLE team_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  age INT NOT NULL,
  cgpa DECIMAL(3, 2) NOT NULL
);
