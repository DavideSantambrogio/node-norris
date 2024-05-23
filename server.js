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
async function getChuckNorrisJoke() {
    try {
        const response = await fetch(chuckNorrisApiUrl); // Utilizza fetch per effettuare la richiesta HTTP
        const data = await response.json(); // Estrai il corpo della risposta come JSON

        // Aggiungi la nuova battuta al file norrisDb.json
        const newJoke = data.value;
        const jokeData = { joke: newJoke };
        const jsonData = JSON.stringify(jokeData);
        fs.appendFileSync(norrisDbFilePath, jsonData + '\n');

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

    res.writeHead(200, { "Content-Type": "text/html charset=utf-8" });

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
