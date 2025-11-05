// Aktiviert den "Strict Mode" für besseren Fehlercheck (E1 – JS-Grundlagen)
'use strict';

// Globale Variablen zum Spielstatus
let randomWord = '';     // Das zu erratende Wort (E1 – Variablen)
let hiddenWord = '';     // Version mit Unterstrichen (z.B. "_ _ _")
let attempts = 0;        // Zählt Fehlversuche (E1 – Datentypen/Zahlen)

//Level-Auswahl Funktion
function choseLevel () {
    //Restart Button verstecken - besonders nach einem Restart relevant
    document.getElementById("restartButton").style.display = "none";
    //alle Buttons mit Class .levels auswählen
    const buttons = document.querySelectorAll(".levels");

    //für alle Buttons: passendes Wort fetchen mit fetchWordByLevel Funktion
    buttons.forEach(button => {
        button.addEventListener("click", async () => {
            const selectedLevel = button.id; // Oder: button.textContent
            console.log("Gewählter Level:", selectedLevel);
            switch (selectedLevel) {
                case 'easy':
                    await fetchWordByLevel('easy');
                    break;
                case 'medium':
                    await fetchWordByLevel('medium');
                    break;
                case 'hard':
                    await fetchWordByLevel('hard');
                    break;
                case 'extreme':
                    await fetchWordByLevel('extreme');
                    break;
                default:
                    throw new Error('Unbekanntes Level');
            }
        });
    });
}


// async/await: Holt zufälliges Wort von Server (E3 – async/await)
// fetchWordByLevel holt wörter mit verschiedene Anzahl von Buchstaben
async function fetchWordByLevel(level) {
    console.log("📡 fetchWordByLevel erreicht mit:", level);
    //minimale und maximale Buchstabenanzahl
    let minLength = 1;
    let maxLength = 100;

    switch (level) {
        //Wörter mit 1-4 Buchstaben
        case 'easy':
            minLength = 1;
            maxLength = 4;
            break;
        //Wörter mit 5-8 Buchstaben
        case 'medium':
            minLength = 5
            maxLength = 8;
            break;
        //Wörter mit 9-12 Buchstaben
        case 'hard':
            minLength = 9
            maxLength = 12;
            break;
        //Wörter mit 13+ Buchstaben
        case 'extreme':
            minLength = 13;
            maxLength = 100; // alle Wörter, kein Filter
            break;
    }

    //Wort holen
    const response = await fetch(`api/getWord.php?minLength=${minLength}&maxLength=${maxLength}`);
    //Fehler: json statt JSON
    const data = await response.json();                     // Antwort parsen als JSON (E4, E6, E7)
    randomWord = data.word;                                 // Wort speichern
    hiddenWord = "_".repeat(randomWord.length);             // Unterstrich-Wort erzeugen (E2 – Strings)
    //Fehler: getElementById statt [...]ID
    document.getElementById("word").textContent = hiddenWord; // DOM aktualisieren (E2 – DOM)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

}

// Canvas-Element und Kontext für das Zeichnen des Hangman
let canvas = document.querySelector('#hangmanCanvas');
let ctx = canvas.getContext("2d");

// Array mit Funktionen zum Zeichnen der Hangman-Teile // Hier sind keine Fehler!
let hangmanParts = [
    function () { ctx.beginPath(); ctx.moveTo(50, 350); ctx.lineTo(150, 350); ctx.stroke(); }, // Base
    function () { ctx.beginPath(); ctx.moveTo(100, 350); ctx.lineTo(100, 50); ctx.stroke(); }, // Pole
    function () { ctx.beginPath(); ctx.moveTo(100, 50); ctx.lineTo(250, 50); ctx.stroke(); }, // Beam
    function () { ctx.beginPath(); ctx.moveTo(250, 50); ctx.lineTo(250, 100); ctx.stroke(); }, // Rope
    function () { ctx.beginPath(); ctx.arc(250, 130, 30, 0, Math.PI * 2); ctx.stroke(); }, // Head
    function () { ctx.beginPath(); ctx.moveTo(250, 160); ctx.lineTo(250, 270); ctx.stroke(); }, // Body
    function () { ctx.beginPath(); ctx.moveTo(250, 190); ctx.lineTo(200, 150); ctx.stroke(); }, // Left Arm
    function () { ctx.beginPath(); ctx.moveTo(250, 190); ctx.lineTo(300, 150); ctx.stroke(); }, // Right Arm
    function () { ctx.beginPath(); ctx.moveTo(250, 270); ctx.lineTo(200, 320); ctx.stroke(); }, // Left Leg
    function () { ctx.beginPath(); ctx.moveTo(250, 270); ctx.lineTo(300, 320); ctx.stroke(); } // Right Leg
];

/* Ein Event Listener wird dem "Guess" Button hinzugefügt, um die Funktion checkGuess auszulösen. */
document.querySelector('.checkGuess').addEventListener('click', checkGuess);



/* Funktion zum Überprüfen des eingegebenen Buchstabens
   checkGuess überprüft den eingegebenen Buchstaben und aktualisiert das
   versteckte Wort und das Ergebnis entsprechend. */
function checkGuess() {
    const guess = document.querySelector("#guessInput").value.toLowerCase();
    let result = document.getElementById("result");
    let correctGuess = false;
    let newHiddenWord = "";

    // 🔁 Schleife über alle Buchstaben des Worts (E2 – Schleifen)
    //Fehler: randomWord statt randomWords
    for (let i = 0; i < randomWord.length; i++) {
        let letter = randomWord[i];

        if (letter === guess) {
            newHiddenWord += guess;
            correctGuess = true;
        } else {
            newHiddenWord += hiddenWord[i];
        }
    }

    hiddenWord = newHiddenWord;

    // 🎉 Wenn vollständig erraten → Spielende (E3 – Bedingungen)
    if (hiddenWord === randomWord) {
        result.textContent = "Gratuliere! Sie haben das Wort richtig erraten!<3";
        // Hintergrundfarbe verändert
        document.getElementById("resultField").style.backgroundColor = "#c2ff93";
        document.querySelector('.checkGuess').disabled = true;
        endGame();
    } else if (correctGuess) {
        result.textContent = "Sie haben einen Buchstaben richtig erraten!";
    } else {
        result.textContent = "Sie haben den Buchstaben falsch erraten! Versuchen Sie es erneut";
        //Fehler: attempts++ statt attempts--, wenn es erhöht werden muss
        attempts++;         // Fehlerzähler erhöhen
        drawHangman();      // Nächster Galgenteil
    }

    /* Aktualisiere das Wort im HTML mit dem aktuellen versteckten Wort */
    document.getElementById("word").textContent = hiddenWord;

    /* Setze das Eingabefeld zurück */
    document.querySelector("#guessInput").value = "";

    /* Fokussiere das Eingabefeld für den nächsten Tipp */
    document.querySelector("#guessInput").focus();
}

/* Funktion zum Zeichnen des Hangman
   drawHangman zeichnet den aktuellen Stand des Hangman, basierend auf der Anzahl der Versuche.
   Zuerst wird der entsprechende Hangman-Teil basierend auf der Anzahl der Versuche gezeichnet.
   Anschließend wird überprüft, ob die maximale Anzahl der Versuche erreicht wurde.
   Wenn dies der Fall ist, wird die Meldung "Game over. The word was: [randomWord]" angezeigt und
   die endGame Funktion aufgerufen, um das Spiel zu beenden. */
function drawHangman() {
   /* Zeichne den Hangman-Teil entsprechend der aktuellen Anzahl der Versuche */
    /* Überprüfe, ob die maximale Anzahl der Versuche erreicht ist */
    //Fehler: hangmanParts.length ist bereits die maximale Anzahl der Versuche -- +1 ist nicht nötig
    if (attempts >= hangmanParts.length) {
        /* Wenn die maximale Anzahl der Versuche erreicht ist, zeige die Meldung "Game over. The word was: [randomWord]" an */
        document.getElementById("result").textContent = "Game Over! Das Wort war: " + randomWord;
        endGame();
        // Hintergrundfarbe verändert
        document.getElementById("resultField").style.backgroundColor = "#ff6c6c";
    } else {
        /* Zeichne den Hangman-Teil entsprechend der aktuellen Anzahl der Versuche */
        hangmanParts[attempts]();
    }
}


//Nach gewinnen oder verlieren endet das Spiel
function endGame() {
    /* Das Eingabefeld und der Check-Button werden ausgewählt */
    document.querySelector("#guessInput").disabled = true;
    document.querySelector(".checkGuess").disabled = true;
    //Restart Button anzeigen
    document.getElementById("restartButton").style.display = "inline-block";
    //Nach clicken restartGame aufrufen
    document.getElementById("restartButton").addEventListener("click", restartGame);
}

//Spiel neustarten
function restartGame() {
    // Values zurücksetzen
    attempts = 0;
    randomWord = '';
    hiddenWord = '';
    //Text Content leeren
    document.getElementById("word").textContent = "";
    document.getElementById("result").textContent = "";
    document.getElementById("resultField").style.backgroundColor = "rgba(255, 248, 239, 0.82)";
    // Guess Input und Check Guess zurücksetzen
    document.querySelector("#guessInput").disabled = false;
    document.querySelector(".checkGuess").disabled = false;
    // Canvas leeren
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Restart Button verstecken
    choseLevel();
    }

/* Beim Laden der Seite wird das Spiel automatisch gestartet, indem die Funktion startGame aufgerufen wird. */
window.addEventListener('DOMContentLoaded', choseLevel);
