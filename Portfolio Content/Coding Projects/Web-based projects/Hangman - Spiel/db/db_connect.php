<?php
// Erstellt eine neue PDO-Verbindung zur MySQL-Datenbank "hangman" auf dem lokalen Server (Port 3306)
$pdo = new PDO(
    "mysql:host=mysql.horschitz.xyz:3306;dbname=hangman;charset=utf8mb4", // Verbindungs-DSN (Datenbank, Zeichencodierung)
    "students",     // Benutzername für die DB
    "ox(j3)QjYu)Xmpvf",         // Passwort (hier leer – bitte in produktiven Umgebungen unbedingt absichern!)
    [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION // Aktiviere Ausnahmebehandlung bei Fehlern (für Debugging & Sicherheit)
    ]
);
