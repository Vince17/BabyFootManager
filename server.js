const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const dotenv = require('dotenv').config();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

// set ejs files in "views" directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', process.env.APP_PORT)

// "public" directory as an asset folder
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(__dirname));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// database connection
const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});
pool.connect();


// get info from db GET
app.get('/', async(req, res) => {
  try {
    const client = await pool.connect()
    var result =  await client.query('SELECT * FROM babyfootparty');
    if(result == ""){
      console.log('Aucune partie');}
    res.render('index',{data: result.rows})
    client.release();
  }catch(err){
    console.error(err);
    res.send("Error 404 NOT FOUND" + err);
  }
});

//create a party POST
app.post('/create', async(req, res) => {
  text_party = req.body.party;
  if (text_party != ''){
    try {
      const sql = 'INSERT INTO babyfootparty (party) VALUES ($1)';
      const data = [text_party];
      pool.query(sql, data, (err, result) => {
      res.redirect('/');});
    }catch(err){
      console.error(err);
      res.send("Error 404 NOT FOUND" + err);
    }
  }
});

//checkbox party POST
app.post('/done/:id', async(req, res) => {
  const id = req.params.id;
  checkbox = Boolean(req.body.checkbox);
  console.log("Done");

  if (checkbox == true) {
    console.log("Done");
    const sql = 'INSERT INTO babyfootparty (done) VALUES (true) WHERE id = $1';
    try {
      pool.query(sql, [id], (err, result) => {
      res.redirect('/');});
    }catch(err){
      console.error(err);
      res.send("Error 404 NOT FOUND" + err);
    }
  } else{
    const sql = 'INSERT INTO babyfootparty (done) VALUES (false) WHERE id = $1';
    try {
      pool.query(sql, [id], (err, result) => {
      res.redirect('/');});
    }catch(err){
      console.error(err);
      res.send("Error 404 NOT FOUND" + err);
    }
  }
});

//remove a party POST
app.post('/delete/:id', async(req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM babyfootparty WHERE id = $1';
  try {
    pool.query(sql, [id], (err, result) => {
    res.redirect('/');});
  }catch(err){
    console.error(err);
    res.send("Error 404 NOT FOUND" + err);
}
});

// socket
io.on('connection', socket => {
  console.log('New user connected');

  socket.on('postgres', data => {
    pool.on('notification', data_db => {
      socket.emit('update', { message: data_db });
    });
  });

  socket.username = "Anonyme";
  socket.on('change_username', data => {
    socket.username = data.username;
    console.log(socket.username);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');  
  });

  socket.on('new_message', data => {
    console.log('New message');
    io.sockets.emit('receive_message', {message: data.message, username: socket.username})
  });

  socket.on('typing', data => {
    socket.broadcast.emit('typing', {username: socket.username})
  })
});

  //  socket.on('party', data => {
  //    socket.emit('party', data);
  //  });

// default redirection
app.use(function(req, res, next){
  res.redirect('/');
});

// run app 3000 port
server.listen(process.env.APP_PORT, () => console.log('http://localhost:'+process.env.APP_PORT));