// Importazione dei moduli
const http = require("http");
require('dotenv').config(); // Carica le variabili d'ambiente da .env
const fs = require('fs');

// Configurazione delle variabili di ambiente
const port = process.env.PORT || 8080;
const host = process.env.HOST || "localhost";

// URL dell'API per ottenere una battuta random
const chuckNorrisApiUrl = 'https://api.chucknorris.io/jokes/random';
const norrisDbFilePath = 'norrisDb.json'; // Percorso del file norrisDb.json

// Funzione per ottenere una battuta random da Chuck Norris API
async function fetchNewJoke() {
    const response = await fetch(chuckNorrisApiUrl);
    const data = await response.json();
    return data.value;
}

// Funzione per ottenere una battuta unica
async function getUniqueChuckNorrisJoke(existingJokes) {
    let newJoke;
    do {
        newJoke = await fetchNewJoke();
    } while (existingJokes.includes(newJoke));
    return newJoke;
}

// Funzione principale per gestire le battute
async function getChuckNorrisJoke() {
    try {
        // Leggi le battute già presenti nel file norrisDb.json
        let existingJokes = [];
        try {
            const existingData = fs.readFileSync(norrisDbFilePath);
            existingJokes = JSON.parse(existingData).jokes || [];
        } catch (error) {
            // Se il file non esiste o non può essere letto, inizializza con una lista vuota
        }

        // Ottieni una battuta unica
        const newJoke = await getUniqueChuckNorrisJoke(existingJokes);

        // Aggiungi la nuova battuta al file norrisDb.json
        existingJokes.push(newJoke);
        const jsonData = JSON.stringify({ jokes: existingJokes }, null, 2);
        fs.writeFileSync(norrisDbFilePath, jsonData);

        return newJoke; // Restituisce solo il valore della nuova battuta
    } catch (error) {
        console.error('Errore durante il recupero della battuta da Chuck Norris API:', error);
        return null;
    }
}

// Creazione del server HTTP
const server = http.createServer(async function (req, res) {
    if (req.url === '/favicon.ico') {
        // Se la richiesta è per la favicon, rispondi con 404 Not Found
        res.writeHead(404);
        res.end();
        return;
    }

    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });

    // Ottieni una battuta di Chuck Norris
    const joke = await getChuckNorrisJoke();

    // Invia la battuta come risposta
    if (joke) {
        res.end(`${joke}`);
    } else {
        res.end('Impossibile recuperare la battuta.');
    }
});

// Avvio del server
server.listen(port, host, () => {
    const serverUrl = `http://${host}:${port}`;
    console.log(`Server avviato su ${serverUrl}`);
});
