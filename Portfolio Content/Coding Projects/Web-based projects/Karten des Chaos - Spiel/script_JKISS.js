"use strict";

//Reflexion
// größte Herausforderung beim Debuggen: die Fehler waren nicht zu schwer zu finden, aber die Herausforderung war, sicher zu sein, dass es keine Fehler mehr gibt und ich nicht weiter suchen muss.
// gelernt bei der Erweiterung: jetzt fühle ich mich mehr sicher, wenn ich Rest-Parametern benutze, die Aufgabe war eine gute Möglichkeit, sie zu üben.
// kreative Idee hinter meinem Design:
// 1. Funktionen: Ich dachte es wäre cool, wenn man irgendwelche magische Gegenstände mit den Karten sammeln (oder verlieren) könnte, und wenn man Glück hat, könnte man drei Karten ziehen. Das Spiel würde im Praxis natürlich irgendwelche Regeln benötigen, z.B. was man mit den Gegenstände im Spiel machen kann.
// 2. Design: Ich versuchte zusammenpassende Farbkombinationen aussuchen. Ich habe auch einen Effekt basiert auf Maus bewegung zugefügt.

// Jede Karte besteht aus [Titel, Beschreibung, Wirkung, Typ]
const karten = [
    ["Fluch der Müdigkeit", "Ein Schleier aus Erschöpfung legt sich über dich.", "Du kannst eine Runde lang nichts tun.", "curse"],
    ["Licht der Erkenntnis", "Ein helles Leuchten durchdringt deinen Geist.", "Du darfst drei Karten ziehen.", "blessing"],
    ["Stille der Leere", "Alles wird ruhig. Zu ruhig.", "Nichts passiert – und doch alles. Du darfst es nochmal probieren.", "neutral"]
];

// Korrektion - statt: const button = document.getElementByID("ziehen");:
const button = document.getElementById("ziehen");

//drei Karten ziehen button
const button3 = document.getElementById("ziehen3");
//wenn 3 Karten ziehen ist nicht möglich, bleibt versteckt
button3.style.display = "none";

//collected items, speichert Items und deren Anzahl
const collectedItems = {};

button.addEventListener("click", function() {
    // Korrektion - statt: const index = math.floor(Math.random() * karten.length);:
    const index = Math.floor(Math.random() * karten.length);
    const karte = karten[index];

    document.getElementById("titel").innerText = karte[0];
    document.getElementById("beschreibung").innerText = karte[1];
    document.getElementById("wirkung").innerText = karte[2];

    //div anzeigen
    document.getElementById("karte").style.display = "block";
    //kartentyp
    const cardType = karte[3];

    const cardDiv = document.getElementById("karte");
    const cardTitle = document.getElementById("titel");

    //wenn Kartentyp = collect, wird das Item in Collected Items zugefügt
    if (cardType === "collect") {
        const item = karte[2];
        //wenn Item schon in Collected Items ist, Anzahl von Item erhöhen
        if (collectedItems[item]) {
            collectedItems[item]++;
        } else {
            collectedItems[item] = 1; //wenn nicht, mit Anzahl 1 zufügen
        }
    }

    //wenn Kartentyp = bad luck: alle gesammelten Items verlieren
    if (cardType === "bad luck") {
        // Alle gesammelten Items entfernen
        for (let item in collectedItems) {
            delete collectedItems[item];
        }
    }
        //Styling von Karten
    styleCard(cardType, cardDiv, cardTitle, true);

    //Collected Items updaten
    updateItemDisplay();
});

//neue Karten zufügen
function addCards (...newCards) {
    //karten.push(...newCards);
    newCards.forEach(card => karten.push(card));
}

addCards(
    ["Fluch des Stillstands", "Die Zeit scheint für dich eingefroren zu sein.", "Du kannst eine Runde lang nichts tun.", "curse"],
    ["Segen der Weisheit", "Altes Wissen entfaltet sich in deinem Inneren.", "Du darfst drei Karten ziehen.", "blessing"],
    ["Kristallene Spindel", "Im Moos verborgen, entdeckst du ein filigranes, leuchtendes Werkzeug. Du erhältst den Gegenstand:", "Spindel der Zeit.", "collect"],
    ["Flüsternder Kelch", "Ein silberner Kelch murmelt dir alte Lieder zu. Du erhältst den Gegenstand:", "Kelch des Echos.", "collect"],
    ["Feder der Nebelkrähe", "Schwarz-glänzend und seltsam warm. Du spürst Magie darin. Du erhältst den Gegenstand:", "Krähenfeder.", "collect"],
    ["Verwunschener Zuckerwürfel", "Süß, aber irgendwie unheimlich. Warum hat er Augen? Du erhältst den Gegenstand:", "Magischer Zucker.", "collect"],
    ["Wissen der Wurmweisen", "Ein uralter Bibliothekswurm kriecht aus deinem Ärmel und flüstert: 'Magier sollten niemals blaue Socken tragen während einer Mondfinsternis.'", "Du weißt jetzt etwas, das niemand wissen sollte. Es hat aber keine Auswirkung.", "other"],
    ["Kichern der Kerze", "Eine Kerze fängt an zu lachen. Laut. Ansteckend. Du lachst mit – ob du willst oder nicht.", "Für den Rest der Runde kicherst du unkontrolliert. Sonst passiert nichts.", "other"],
    ["Ei des Wunders", "Ein Ei fällt vom Himmel. Es gluckert. Es funkelt. Es schnattert in Alt-Drakonisch.", "Du wirst für eine Runde zu Forsch verzaubert.", "odd"],
    ["Karte der großen Leere", "Du greifst in deine Tasche – leer. Alles, was du gesammelt hast, ist verschwunden. Vielleicht war es nie da?", "Du verlierst alle gesammelten Karten. Keine Gnade, nur Leere.", "bad luck"]
);

//drei Karten ziehen
button3.addEventListener("click", function () {
    document.getElementById("karte").style.display = "none";

    //drei random Karten generieren
    const drawnCards = [];

    while (drawnCards.length < 3) {
        const index = Math.floor(Math.random() * karten.length);
        const karte = karten[index];

        //kein Duplikation
        if (!drawnCards.includes(karte)) {
            drawnCards.push(karte);
        }
    }

    //prüfen, ob die neu gezogene Karten "blessing" Kartentyp haben
    const hasBlessing = drawnCards.some(karte => karte[3] === "blessing");

    //wenn neu gezogene Karte auch ein "blessing" ist, bleibt das Button da, der Spieler kann wieder drei karten ziehen
    if (hasBlessing) {
        button3.style.display = "inline-block";
    } else {
        button3.style.display = "none"; //wenn kein "blessing" gezogen ist, wird das Button versteckt
    }


    //Karten zu Divs zuordnen
    drawnCards.forEach((karte, i) => {
        //beim karte2 Div starten
        const nummer = i + 2;


        document.getElementById("titel" + nummer).innerText = karte[0];
        document.getElementById("beschreibung" + nummer).innerText = karte[1];
        document.getElementById("wirkung" + nummer).innerText = karte[2];


        //neue Variablen, passend für styling mehrere Divs
        const cardDiv = document.getElementById("karte" + nummer);
        const cardTitle = document.getElementById("titel" + nummer);
        const cardType = karte[3];

        document.getElementById("dreikarten").style.display = "block";


        //gesammelte Elemente speichern
        if (cardType === "collect") {
            const item = karte[2];
            if (collectedItems[item]) {
                collectedItems[item]++;
            } else {
                collectedItems[item] = 1;
            }
        }

        //wenn Kartentyp = bad luck: alle gesammelten Items verlieren
        if (cardType === "bad luck") {
            // Alle gesammelten Items entfernen
            for (let item in collectedItems) {
                delete collectedItems[item];
            }
        }

        //Styling
        styleCard(cardType, cardDiv, cardTitle);

        updateItemDisplay();

    });

});


//Gesammelte Items anzeigen und aktualisieren
function updateItemDisplay() {
    const itemCollection = document.getElementById("itemCollection");
    let displayText = "";

    for (let item in collectedItems) {
        const count = collectedItems[item];
        displayText += `${count}× ${item}  `;
    }
    itemCollection.innerText = displayText;
}

//Karte Styling
function styleCard(cardType, cardDiv, cardTitle, isSingleCardDraw = false) {
    // Standard: Three-cards-button is hidden, unless special case
    //Drei Karten ziehen Button ist versteckt, außer Spezialfall
    if (isSingleCardDraw) {
        document.getElementById("dreikarten").style.display = "none";
    }

    switch (cardType) {
        case "curse":
            cardDiv.style.backgroundColor = "black";
            cardDiv.style.color = "#fbf7fa";
            cardTitle.style.color = "#fbf7fa";
            if (isSingleCardDraw) button3.style.display = "none";
            break;

        case "blessing":
            cardDiv.style.backgroundColor = "#dccb77";
            cardDiv.style.color = "#3a3101";
            cardTitle.style.color = "#3a3101";
            //Spezialfall, drei Karten ziehen Button soll sichtbar sein
            if (isSingleCardDraw) button3.style.display = "inline-block";
            break;

        case "neutral":
            cardDiv.style.backgroundColor = "#702880";
            cardDiv.style.color = "#e4bff8";
            cardTitle.style.color = "#e4bff8";
            if (isSingleCardDraw) button3.style.display = "none";
            break;

        case "odd":
            cardDiv.style.backgroundColor = "#0b6120";
            cardDiv.style.color = "#e5f6e8";
            cardTitle.style.color = "#e5f6e8";
            if (isSingleCardDraw) button3.style.display = "none";
            break;

        case "collect":
            cardDiv.style.backgroundColor = "#0c4a59";
            cardDiv.style.color = "#b5f6e7";
            cardTitle.style.color = "#b5f6e7";
            if (isSingleCardDraw) button3.style.display = "none";
            break;

        case "bad luck":
            cardDiv.style.backgroundColor = "#4a0505";
            cardDiv.style.color = "#f6b5b5";
            cardTitle.style.color = "#f6b5b5";
            if (isSingleCardDraw) button3.style.display = "none";
            break;

        default:
            cardDiv.style.backgroundColor = "#3753ae";
            cardDiv.style.color = "#dee6fd";
            cardTitle.style.color = "#dee6fd";
            if (isSingleCardDraw) button3.style.display = "none";
            break;
    }
}



//styling effects
//Fliegende Parcticles nach Maus Interaktion
document.addEventListener('mousemove', (e) => {
    // Particles erstellen
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Temporary Particle erstellen
    const particle = document.createElement('div');
    particle.className = 'particle';

    // Größe
    const size = Math.random() * 4 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    // Position zu Maus
    particle.style.left = `${mouseX - size / 2}px`;
    particle.style.top = `${mouseY - size / 2}px`;
    particle.style.opacity = '0.6';

    const particlesContainer= document.getElementById("particles-container");
    particlesContainer.appendChild(particle);

    // Animation
    setTimeout(() => {
        particle.style.transition = 'all 2s ease-out';
        const offsetX = (Math.random() * 50 - 10);
        const offsetY = (Math.random() * 50 - 10);
        particle.style.left = `${mouseX + offsetX}px`;
        particle.style.top = `${mouseY + offsetY}px`;
        particle.style.opacity = '0';

        // nach Animation entfernen
        setTimeout(() => {
            particle.remove();
        }, 2000);
    }, 10);
});