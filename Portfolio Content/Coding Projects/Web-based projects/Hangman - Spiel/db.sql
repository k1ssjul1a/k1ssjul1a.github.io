-- Erstellt die Datenbank, falls sie noch nicht existiert
CREATE DATABASE IF NOT EXISTS hangman
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

-- Wechsle in die Datenbank
USE hangman;

-- Erstellt die Tabelle für die Wörter
CREATE TABLE IF NOT EXISTS words (
    id INT AUTO_INCREMENT PRIMARY KEY,
    word VARCHAR(100) NOT NULL
);
