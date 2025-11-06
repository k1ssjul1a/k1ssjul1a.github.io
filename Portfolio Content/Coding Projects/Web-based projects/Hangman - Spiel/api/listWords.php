<?php
// Stellt die Verbindung zur Datenbank her, indem das Verbindungs-Skript eingebunden wird
require '../db/db_connect.php';

// Führt eine SQL-Abfrage aus, um alle Wörter alphabetisch sortiert aus der Tabelle "words" zu holen
$stmt = $pdo->query("SELECT word FROM words ORDER BY word ASC");

// Holt alle Ergebnisse der Abfrage als assoziatives Array (z.B. [ ['word' => 'Apfel'], ['word' => 'Banane'] ])
$words = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Setzt den Content-Type Header auf "application/json", damit der Browser weiß, dass JSON-Daten folgen
header('Content-Type: application/json');

// Gibt das Ergebnis als JSON-String aus (z.B. [{"word":"Apfel"},{"word":"Banane"}])
echo json_encode($words);
