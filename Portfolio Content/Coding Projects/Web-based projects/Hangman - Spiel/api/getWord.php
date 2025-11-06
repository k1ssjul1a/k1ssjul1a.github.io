<?php
// Stellt eine Verbindung zur Datenbank her, indem das Verbindungs-Skript eingebunden wird
/** @var PDO $pdo */
require '../db/db_connect.php';


/*// Führt eine SQL-Abfrage aus, um ein zufälliges Wort aus der Tabelle "words" auszuwählen
// RAND() sortiert die Tabelle zufällig, LIMIT 1 begrenzt das Ergebnis auf einen Eintrag
$stmt = $pdo->query("SELECT word FROM words ORDER BY RAND() LIMIT 1");

// Gibt das Ergebnis als JSON zurück (z.B. {"word":"Zug"})
// fetch() holt den ersten Datensatz (assoziativ), json_encode() wandelt ihn in JSON um
echo json_encode($stmt->fetch());
*/

//Optionalen GET-Parameter maxLength holen
$minLength = isset($_GET['minLength']) ? intval($_GET['minLength']) : 1; // Default = 100 Buchstaben

$maxLength = isset($_GET['maxLength']) ? intval($_GET['maxLength']) : 100; // Default = 100 Buchstaben

//SQL-Abfrage vorbereiten: Wörter mit Länge <= maxLength zufällig sortieren, eins auswählen
$stmt = $pdo->prepare("SELECT word FROM words WHERE CHAR_LENGTH(word) BETWEEN :minLength AND :maxLength ORDER BY RAND() LIMIT 1");

//Wert für maxLength in die Abfrage einfügen (vor SQL-Injection geschützt)
$stmt->bindParam(':minLength', $minLength, PDO::PARAM_INT);
$stmt->bindParam(':maxLength', $maxLength, PDO::PARAM_INT);

//Abfrage ausführen
$stmt->execute();

//Ergebnis als assoziatives Array holen
$word = $stmt->fetch(PDO::FETCH_ASSOC);

//Falls ein Wort gefunden wurde => gib es als JSON zurück, sonst ein leeres
if ($word) {
    echo json_encode($word);
} else {
    echo json_encode(['word' => '']);
}

