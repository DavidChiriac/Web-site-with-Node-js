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
	const listaIntrebari = [
		{
			intrebare: 'Întrebarea 1',
			variante: ['varianta 1', 'varianta 2', 'varianta 3', 'varianta 4'],
			corect: 0
		},
		{
			intrebare: 'Întrebarea 2',
			variante: ['varianta 1', 'varianta 2', 'varianta 3', 'varianta 4'],
			corect: 0
		},
		{
			intrebare: 'Întrebarea 3',
			corect: ''
		},
		{
			intrebare: 'Întrebarea 4',
			corect: 0
		},
		{
			intrebare: 'Întrebarea 5',
			variante: ['varianta 1', 'varianta 2', 'varianta 3', 'varianta 4'],
			corect: 0
		},
		{
			intrebare: 'Întrebarea 6',
			variante: ['varianta 1', 'varianta 2', 'varianta 3', 'varianta 4'],
			corect: 0
		},
		{
			intrebare: 'Întrebarea 7',
			variante: ['varianta 1', 'varianta 2', 'varianta 3', 'varianta 4'],
			corect: 0
		},
		{
			intrebare: 'Întrebarea 8',
			corect: 0
		},
		{
			intrebare: 'Întrebarea 9',
			corect: 0
		},
		{
			intrebare: 'Întrebarea 10',
			corect: 0
		}
	];
	// în fișierul views/chestionar.ejs este accesibilă variabila 'intrebari' care conține vectorul de întrebări
	res.render('chestionar', {intrebari: listaIntrebari});
});

app.get('/autentificare', (req, res) => res.render('autentificare', {mesajEroare: req.cookies.mesajEroare}));

app.post('/verificare-autentificare', (req, res) => {
	res.clearCookie('utilizator');
	console.log(req.body);
	if(req.body.username=="admin" && req.body.password=="admin"){
		res.cookie('utilizator', req.body.username);
		res.clearCookie('mesajEroare');
		res.redirect('/index');
	}
	else{
		res.cookie('mesajEroare', 'Utilizator sau parola incorecte');
		res.redirect('/autentificare');
	}
}); 

app.post('/log-out', (req, res) =>{
	res.clearCookie('utilizator')
	res.redirect('/index')
});

app.get('/rezultat_chestionar', (req, res) => {
	const listaIntrebari = [
		{
			intrebare: 'Întrebarea 1',
			variante: ['varianta 1', 'varianta 2', 'varianta 3', 'varianta 4'],
			corect: 0
		},
		{
			intrebare: 'Întrebarea 2',
			variante: ['varianta 1', 'varianta 2', 'varianta 3', 'varianta 4'],
			corect: 0
		},
		{
			intrebare: 'Întrebarea 3',
			corect: ''
		},
		{
			intrebare: 'Întrebarea 4',
			corect: 0
		},
		{
			intrebare: 'Întrebarea 5',
			variante: ['varianta 1', 'varianta 2', 'varianta 3', 'varianta 4'],
			corect: 0
		},
		{
			intrebare: 'Întrebarea 6',
			variante: ['varianta 1', 'varianta 2', 'varianta 3', 'varianta 4'],
			corect: 0
		},
		{
			intrebare: 'Întrebarea 7',
			variante: ['varianta 1', 'varianta 2', 'varianta 3', 'varianta 4'],
			corect: 0
		},
		{
			intrebare: 'Întrebarea 8',
			corect: 0
		},
		{
			intrebare: 'Întrebarea 9',
			corect: 0
		},
		{
			intrebare: 'Întrebarea 10',
			corect: 0
		}
	];
	res.render('rezultat_chestionar', {intrebari:listaIntrebari})
	
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
		res.send({ code:400, failed: "error occurred"});
	  }
	
	try{
		con = mysql.createConnection({
			host: "localhost",
			user: "root",
			password: "",
			database: "cumparaturi"
		});
		let Produse = `create table produse(
			id int primary key auto_increment,
			nume varchar(255)not null
		)`;
		con.query(Produse, function (err, result, fields) {});
		console.log("Tabel creat!");
	} catch (error){
		res.send({ code:400, failed: "error occurred"});
	}
});

app.post('/inserare-bd', (req, res) =>{

	res.redirect('/index');
});

app.listen(port, () => console.log(`Serverul rulează la adresa http://localhost:6789`));