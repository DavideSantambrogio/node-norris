- [x] Sfruttando l’api https://api.chucknorris.io/jokes/random creare un applicazione che scarica una battuta random e la mostra all’utente, 

- [x] la aggiunge ad un file json norrisDb.json.

- [x] Il file json quindi dovrà contenere la lista di tutte le battute scaricate nell’arco del tempo.

- [x] Per evitare che nodemon riavvii il server ogni volta che questo file viene modificato, aggiungete la seguente configurazione nel file package.json:
"nodemonConfig": {
	"ignore": ["norrisDb.json"]
}
E ricordate, con Chuck Norris le API non hanno il coraggio di ritornare un errore, per paura che Chuck le punisca.
BONUS:
- [x] Quando viene scaricata una battuta, controllare che questa non sia già presente nel file json locale. Se lo è, caricare un altra battuta.
Buon lavoro!