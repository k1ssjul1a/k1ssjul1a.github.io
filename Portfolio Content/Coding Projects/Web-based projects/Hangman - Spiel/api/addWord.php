<?php
// Verbindet sich mit der Datenbank, indem das Verbindungs-Skript eingebunden wird
require '../db/db_connect.php';

// Liest den JSON-Body der Anfrage und wandelt ihn in ein assoziatives Array um
$data = json_decode(file_get_contents("php://input"), true);

// Prüft, ob im empfangenen Array ein nicht-leerer Eintrag mit dem Schlüssel 'word' vorhanden ist
if (!empty($data['word'])) {
    // Bereitet eine SQL-Anweisung vor, um ein Wort in die Datenbanktabelle 'words' einzufügen
    $stmt = $pdo->prepare("INSERT INTO words (word) VALUES (?)");

    // Führt die vorbereitete Anweisung aus und reinigt das Wort vorher:
    // - trim(): entfernt Leerzeichen vorne und hinten
    // - strtolower(): wandelt es in Kleinbuchstaben um
    $stmt->execute([strtolower(trim($data['word']))]);

    // Sendet eine Bestätigung als JSON-Antwort zurück
    echo json_encode(["message" => "Wort hinzugefügt!"]);
} else {
    // Wenn kein gültiges Wort übergeben wurde, gibt eine entsprechende Fehlermeldung als JSON zurück
    echo json_encode(["message" => "Kein Wort angegeben."]);
}
