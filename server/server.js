var express = require("express");
var mysql = require("mysql");
var exphbs = require('express-handlebars');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var passport = require('passport');
var https = require('https'), fs = require('fs');

var app = express();

// This line is from the Node.js HTTPS documentation.
var options = {
  key: fs.readFileSync('./keys/key.pem'),
  cert: fs.readFileSync('./keys/cert.pem')
};

// Create an HTTPS service identical to the HTTP service.
//https.createServer(options, app).listen(443);


/*Start the Server*/
app.listen(80,function(){
console.log("It's Started on PORT 80");
});




app.use(express.static('public'));
/*
* Configure MySQL parameters.
*/
var connection = mysql.createConnection({
host : "localhost",
user : "root",
password : "grapes123",
database : "grapesserver"
});

app.use(logger('combined'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(session({secret: 'supernova', saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Key, Authorization");
  next();
});

// Session-persisted message middleware
app.use(function(req, res, next){
  var err = req.session.error,
      msg = req.session.notice,
      success = req.session.success;

  delete req.session.error;
  delete req.session.success;
  delete req.session.notice;

  if (err) res.locals.error = err;
  if (msg) res.locals.notice = msg;
  if (success) res.locals.success = success;

  next();
});

/*Connecting to Database*/

connection.connect(function(error){
if(error)
{
console.log("Problem with MySQL"+error);
}
else
{
console.log("Connected with Database");
}
});

app.get('/',function(req,res){
	res.sendfile('public/www/index.html');
});

app.post('/api/register',function(req,res){
	var queryString= "INSERT INTO usuarios(username,email,passwordHash,fechaRegistro) VALUES (\""+req.body.username+"\",\""+req.body.email+"\",\""+req.body.password+"\",NOW()) ;";
	connection.query(queryString,function(err){
	if(err)
	{
		console.log("Problem with MySQL"+err);
		
	}
	else{
		res.status(200).send('OK');
	}
	});
});

app.post('/api/authenticate',function(req,res){
	console.log(req.body);
	var queryString= "SELECT * from usuarios where username=\""+req.body.username+"\" and passwordHash=\""+req.body.password+"\"";
	connection.query(queryString,function(err,rows){
		if(err)
		{
			res.status(200).send({ success: false });
			console.log("Problem with MySQL"+err);
		}
		else{
			if(typeof rows !== 'undefined' && rows.length > 0){
				res.status(200).send({ success: true });
			}
			else{
				console.log("nothing here");
				res.status(200).send({ success: false });
			}
		}
	});
});

app.post('/api/topSecret',function(req,res){
	console.log(req.body);
	var error=false;
	req.body.forEach(function(measure){
		var queryString= "INSERT INTO mediciones (valor,fecha,idMagnitud,idSensor) Select "+measure.valor+",\""+measure.fecha_hora+"\","+measure.id_magnitud+", (Select idSensor from sensores as s join campos as c on c.idCampo=s.idCampo where  c.uuid="+measure.uuid_campo + " and s.address="+measure.sensor_address+")";
		connection.query(queryString,function(err,rows){
			if(err)
			{
				console.log("Problem with MySQL"+err);
				error=true;
			}			
		});
	});
	res.status(200).send({ success: !error });
});

app.post('/api/load/temps',function(req,res){
	console.log(req.body);
	var queryString="SELECT c.idCampo,s.idSensor,m.fecha,m.valor,mag.nombre,mag.unidad from usuarios as u join duenios as d on u.idUsuario=d.idUsuario join campoperteneceaduenio as cpd  on d.idDuenio=cpd.idDuenio join campos as c on cpd.idCampo=c.idCampo join sensores as s on c.idCampo=s.idCampo join mediciones as m on s.idSensor=m.idSensor join magnitudes as mag on m.idMagnitud=mag.idMagnitud where u.username=\""+req.body.username+"\"";
	connection.query(queryString,function(err,rows){
	if(err)
	{
	console.log("Problem with MySQL"+err);
	}
	else
	{
	res.end(JSON.stringify(rows));	
	}
	});
});