// Geocoding API (Nominatim)
const geocodingApiUrl = "https://nominatim.openstreetmap.org/search?format=json&q=";
const geocodingCityPlzApiUrl = "https://nominatim.openstreetmap.org/search?format=json";
// Beispiel:
// https://nominatim.openstreetmap.org/search?format=json&q=Berlin

// Wetter API (Open-Meteo)
const weatherApiUrl = "https://api.open-meteo.com/v1/forecast?current_weather=true&";
// Beispiel (Koordinaten für Berlin):
// https://api.open-meteo.com/v1/forecast?current_weather=true&latitude=52.52&longitude=13.41

class WeatherData {
    // TODO Klasse für Wetterdaten
    city_name;
    weathercode;
    temperature;

    constructor(city_name, weathercode, temperature) {
        this.city_name = city_name;
        this.weathercode = weathercode;
        this.temperature = temperature;
    }
}

class LocationData {
    // TODO Klasse für Ortsdaten
    display_name;
    lat;
    lon;

    constructor(display_name, lat, lon) {
        this.display_name = display_name;
        this.lat = lat;
        this.lon = lon;
    }
}

//häufig benötigte HTML Elemente
const cityInput = document.getElementById("cityInput");
const zipInput = document.getElementById("zipInput");
const cityName = document.getElementById("cityName");
const iconDisplay = document.getElementById("iconDisplay");
const celsiusDisplay = document.getElementById("celsiusDisplay");
const weatherDescription = document.getElementById("weatherDescription");
const displayDiv = document.getElementById("displayDiv");



//Eingaben holen, udpateWeatherData aufrufen, oder Fehler anzeigen wenn es nicht funktioniert
async function searchWeather() {
    const city = cityInput.value.trim();
    const plz = zipInput.value.trim();

    try {
        const locationData = await getCoordinates(city, plz);   // Ortsdaten abfragen
        const weatherData = await fetchWeatherData(locationData);   // Wetterdaten abfragen
        updateWeatherData(weatherData);  // Wetterdaten anzeigen
    } catch (error) {
        function displayError(message) {
            displayDiv.style.display = "block";
            cityName.textContent = "Error";
            celsiusDisplay.textContent = "";
            iconDisplay.innerHTML = "";
            weatherDescription.textContent = message;
        }
        console.error("Fehler beim Abfragen des Wetters: ", error);
        displayError(error.message);
        // TODO Fehler auf Webseite anzeigen
        if (!city && !plz) {
            throw new Error("Please enter a city name or zip code");
        }
    }

    //Eingabefelder zurücksetzen
    cityInput.value = "";
    zipInput.value = "";

}

//Wetter anzeigen mit Hilfe von
function updateWeatherData(weatherData) {
    // TODO Wetterdaten auf Webseite anzeigen
    cityName.textContent = weatherData.city_name;
    celsiusDisplay.textContent = `${weatherData.temperature} °C`
    iconDisplay.innerHTML = getWeatherIcon(weatherData.weathercode);
    weatherDescription.textContent = getWeatherDescription(weatherData.weathercode);

    displayDiv.style.display = "inline-block";
}


//Ortsdaten holen (basiert auf Usersuche)
async function getCoordinates(city, zip) {
    // TODO Ortsdaten mittels fetch abfragen
    try {
        let url;
        //Daten basiert auf Stadt und PLZ holen
        if (city && zip) {
            url = `${geocodingCityPlzApiUrl}&city=${encodeURIComponent(city)}&postalcode=${encodeURIComponent(zip)}&accept-language=de`;
        } else if (city) { //Daten basiert nur auf Stadt suchen
            url = `${geocodingApiUrl}${encodeURIComponent(city)}&accept-language=de`;
        } else if (zip) { //Daten basiert nur auf PLZ suchen
            url = `${geocodingApiUrl}${encodeURIComponent(zip)}&accept-language=de`;
        } else {
            throw new Error("Bitte Stadt oder PLZ eingeben!")
        }

        //fetch abwarten, dann die Ausgabe als json in einem Variable speichern
        const responsePlace = await fetch(url);
        if (!responsePlace.ok) {
            throw new Error("Die Suche war nicht erfolgreich.")
        }
        const placeResult = await responsePlace.json();
        if (!placeResult || placeResult.length === 0) {
            throw new Error("Location not found");
        }

        //neues Location-Object generieren mit den Daten
        return new LocationData(
            placeResult[0].display_name,
            parseFloat(placeResult[0].lat),
            parseFloat(placeResult[0].lon)
        );

    } catch (error) {
        console.log(error.message);
        throw error;
    }
}

//Wetterdaten holen (basiert auf Usersuche)
async function fetchWeatherData(locationData) {
    // TODO Wetterdaten für den gegebenen Ort mittels fetch abfragen
    try { //Wetterdaten abfragen mit Hilfe von bereits vorhandene Ortsdaten
        //fetch abwarten, dann die Ausgabe als json in einem Variable speichern
        const url = `${weatherApiUrl}latitude=${locationData.lat}&longitude=${locationData.lon}&accept-language=de`;
        const responseWeather = await fetch(url);
        if (!responseWeather.ok) {
            throw new Error("Die Suche war nicht erfolgreich.")
        }
        const weatherResult = await responseWeather.json();

        //neues Wetter-Object generieren mit den Daten
        return new WeatherData(
            locationData.display_name,
            weatherResult.current_weather.weathercode,
            weatherResult.current_weather.temperature
        );

    } catch (error) {
        console.log(error.message);
        throw error;
    }
}

// Abfrage des Wettericons zu einem Wettercode
function getWeatherIcon(weathercode) {
    let iconName;
    switch (weathercode) {
        case 0:
            iconName = "clear-day.svg";
            break;
        case 1:
        case 2:
        case 3:
            iconName = "partly-cloudy-day.svg";
            break;
        case 45:
        case 48:
            iconName = "fog.svg";
            break;
        case 51:
        case 53:
        case 55:
        case 56:
        case 57:
        case 61:
        case 63:
        case 65:
        case 66:
        case 67:
        case 80:
        case 81:
        case 82:
            iconName = "rain.svg";
            break;
        case 71:
        case 73:
        case 75:
        case 77:
        case 85:
        case 86:
            iconName = "snow.svg";
            break;
        case 95:
        case 96:
        case 99:
            iconName = "thunderstorms.svg";
            break;
        default:
            iconName = "unknown.svg"; // Füge ein Icon für unbekannte Wettercodes hinzu
    }
    return `<img src="icons/${iconName}" alt="Wetter Icon">`;
}

// Abfrage der Wetterbeschreibung zu einem Wettercode
function getWeatherDescription(weathercode) {
    const weatherDescriptions = {
        0: "Klarer Himmel",
        1: "Leicht bewölkt",
        2: "Teilweise bewölkt",
        3: "Bewölkt",
        45: "Nebel",
        48: "Ablagerungsnebel",
        51: "Leichter Nieselregen",
        53: "Mäßiger Nieselregen",
        55: "Starker Nieselregen",
        56: "Leichter gefrierender Nieselregen",
        57: "Starker gefrierender Nieselregen",
        61: "Leichter Regen",
        63: "Mäßiger Regen",
        65: "Starker Regen",
        66: "Leichter gefrierender Regen",
        67: "Starker gefrierender Regen",
        71: "Leichter Schneefall",
        73: "Mäßiger Schneefall",
        75: "Starker Schneefall",
        77: "Schneeregen",
        80: "Leichte Regenschauer",
        81: "Mäßige Regenschauer",
        82: "Starke Regenschauer",
        85: "Leichte Schneeschauer",
        86: "Starke Schneeschauer",
        95: "Gewitter",
        96: "Gewitter mit Hagel",
        99: "Gewitter mit starkem Hagel"
    };
    return weatherDescriptions[weathercode] || "Unbekannt";
}

//Event-Listener für Suchen-Button, was searchWeather funktion aufruft
document.getElementById("submitBtn").addEventListener("click", searchWeather);
