// 🧩 Funktion: Lädt die Liste der gespeicherten Wörter von der Datenbank und zeigt sie im HTML an
async function loadWordList() {
    // Daten vom Server holen (E4/E6 – fetch API, async/await)
    const response = await fetch("api/listWords.php");

    // Antwort als JSON parsen (E6 – JSON)
    const data = await response.json();

    // Referenz auf das UL-Element mit der ID "wordList" //Fehler: worldlist => worldList
    const wordList = document.getElementById("wordList");

    // Vorherige Einträge entfernen, um doppelte Anzeige zu vermeiden
    wordList.innerHTML = "";

    // 🔁 Jedes Wort aus der Datenbank wird als <li> ins HTML eingefügt (E2 – Schleifen, DOM-Manipulation)
    //Fehler: forEach statt foreach
    data.forEach(entry => {
        const li = document.createElement("li");  // Neues Listenelement erstellen
        li.textContent = entry.word;              // Wort aus dem JSON einfügen
        wordList.appendChild(li);                 // Element zur Liste hinzufügen
    });
}

// 🖱️ Event: Wenn das Formular abgeschickt wird (E3 – Events)
document.getElementById("wordForm").addEventListener("submit", async (e) => {
    e.preventDefault(); // Standardaktion (Reload) unterdrücken

    // Eingegebenes Wort aus dem Input-Feld holen (E2 – DOM-Zugriff)
    const word = document.getElementById("newWord").value;

    // 📨 Wort per POST-Request an den Server senden (E4 – fetch POST)
    const response = await fetch("api/addWord.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Datenformat: JSON
        body: JSON.stringify({ word })                   // Inhalt: neues Wort als JSON-Objekt
    });

    // Antwort (z.B. "Wort gespeichert") verarbeiten
    const result = await response.json();

    // Rückmeldung im Browser anzeigen (E2 – DOM-Manipulation)
    document.getElementById("message").textContent = result.message;

    // Eingabefeld leeren für das nächste Wort
    document.getElementById("newWord").value = "";

    // 📝 Liste neu laden, damit das neue Wort direkt sichtbar ist
    //Fehler: await bevor loadWordList fehlt
    await loadWordList();
});

// 🚀 Beim Laden der Seite sofort die vorhandenen Wörter anzeigen
// Fehler: loadWorldList statt loadWorldLists
window.onload = loadWordList;
