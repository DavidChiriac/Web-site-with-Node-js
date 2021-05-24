const cookieParser=require('cookie-parser');

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser')

const app = express();

app.use(cookieParser());

const port = 6789;

// directorul 'views' va conține fișierele .ejs (html + js executat la server)
app.set('view engine', 'ejs');
// suport pentru layout-uri - implicit fișierul care reprezintă template-ul site-ului este views/layout.ejs
app.use(expressLayouts);
// directorul 'public' va conține toate resursele accesibile direct de către client (e.g., fișiere css, javascript, imagini)
app.use(express.static('public'))
// corpul mesajului poate fi interpretat ca json; datele de la formular se găsesc în format json în req.body
app.use(bodyParser.json());
// utilizarea unui algoritm de deep parsing care suportă obiecte în obiecte
app.use(bodyParser.urlencoded({ extended: true }));
// la accesarea din browser adresei http://localhost:6789/ se va returna textul 'Hello World'
// proprietățile obiectului Request - req - https://expressjs.com/en/api.html#req
// proprietățile obiectului Response - res - https://expressjs.com/en/api.html#res
app.get('/', (req, res) => {
	res.render('index', {utilizator: req.cookies.utilizator});
});

app.get('/index', (req, res) => {
	res.render('index', {utilizator: req.cookies.utilizator});	
	
});

// la accesarea din browser adresei http://localhost:6789/chestionar se va apela funcția specificată
app.get('/chestionar', (req, res) => {
	var fs = require('fs');
	var obj;
	fs.readFile('intrebari.json', 'utf8', function (err, data) {
 	 	if (err) throw err;
  	  	obj = JSON.parse(data);
	  	res.render('chestionar', {intrebari: obj});
	});
	// în fișierul views/chestionar.ejs este accesibilă variabila 'intrebari' care conține vectorul de întrebări
	
});

app.get('/autentificare', (req, res) => res.render('autentificare', {mesajEroare: req.cookies.mesajEroare}));

app.post('/verificare-autentificare', (req, res) => {
	res.clearCookie('utilizator');
	console.log(req.body);
	var fs = require('fs');
	var obj;
	fs.readFile('utilizatori.json', 'utf8', function (err, data) {
 	 	if (err) throw err;
  	  	obj = JSON.parse(data);
		var nrUtilizatori = Object.keys(obj).length;
		var ok=0;
		for(var i=0;i<nrUtilizatori;i++){
			if(obj[i].username==req.body.username && obj[i].password == req.body.password){
				ok=1;
				res.cookie('utilizator', req.body.username);
				res.clearCookie('mesajEroare');
				res.redirect('/index');
				break;
			}
		}
		if(!ok){
			res.cookie('mesajEroare', 'Utilizator sau parola incorecte');
			res.redirect('/autentificare');
		}
	});
	/*if(req.body.username=="admin" && req.body.password=="admin"){
		res.cookie('utilizator', req.body.username);
		res.clearCookie('mesajEroare');
		res.redirect('/index');
	}
	else{
		res.cookie('mesajEroare', 'Utilizator sau parola incorecte');
		res.redirect('/autentificare');
	}*/
}); 

app.post('/log-out', (req, res) =>{
	res.clearCookie('utilizator')
	res.redirect('/index')
});

app.get('/rezultat_chestionar', (req, res) => {
	var fs = require('fs');
	var obj;
	fs.readFile('intrebari.json', 'utf8', function (err, data) {
		if (err) throw err;
		obj = JSON.parse(data);
		res.render('rezultat_chestionar', {intrebari:obj})
	});
});

app.post('/rezultat_chestionar', (req, res) => {
	console.log(req.body)
	res.redirect('/rezultat_chestionar')
});

app.get('/creare-bd', (req, res) =>{
	
	var mysql = require('mysql');

	con = mysql.createConnection({
		host: "localhost",
		user: "root",
		password: ""
	});

	con.connect(function(err) {
		if (err) throw err;
		console.log("Connected!");
	});

	try{
		con.query("CREATE DATABASE cumparaturi", function (err, result) {});
	  	res.redirect('/index');
	} catch (error) {
	  }
	
	try{
		con = mysql.createConnection({
			host: "localhost",
			user: "root",
			password: "",
			database: "cumparaturi"
		});
		let Produse = `create table produse(
			id int primary key,
			nume varchar(255)not null
		)`;
		con.query(Produse, function (err, result, fields) {});
		console.log("Tabel creat!");
	} catch (error){
	}
});

app.post('/inserare-bd', (req, res) =>{
	var mysql = require('mysql');

	var con = mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "",
		database: "cumparaturi"
	});
	try{
 		con.query("INSERT INTO produse (id, nume) VALUES (1, 'after-shave')", function (err, result) {});
		con.query("INSERT INTO produse (id, nume) VALUES (2, 'crema hidratanta')", function (err, result) {});
		con.query("INSERT INTO produse (id, nume) VALUES (3, 'sampon')", function (err, result) {});
		con.query("INSERT INTO produse (id, nume) VALUES (4, 'gel de duș')", function (err, result) {});

		res.redirect('/index');
	} catch{
	}
});

app.listen(port, () => console.log(`Serverul rulează la adresa http://localhost:6789`));