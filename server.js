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

// app.set('port', process.env.APP_PORT)

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
// socket io for postgresql db
pool.connect();
pool.query('LISTEN changes')

// get info from db GET
app.get('/', async(req, res) => {
  try {
    const client = await pool.connect()
    var result = await client.query('SELECT * FROM babyfootparty');
    if(result == ""){
      console.log('Aucune partie');}
    res.render('index',{data: result.rows})
    client.release();
  }catch(err){
    console.error(err);
    res.send("Error 404 NOT FOUND" + err);
  }
});

// get the number of games completed
app.get('/', async(req, res) => {
  try {
    const client = await pool.connect()
    var nbDone = await client.query('SELECT COUNT(done) FROM public.babyfootparty WHERE done=true');
    res.render('index',{data: nbDone});
    console.log(data);
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
app.post('/doneChk/:id', async(req, res) => {
    const id = req.params.id;
    const sql = 'INSERT INTO babyfootparty (done) VALUES (true) WHERE id = $1';
    try {
      pool.query(sql, [id], (err, result) => {
      res.redirect('/');});
    }catch(err){
      console.error(err);
      res.send("Error 404 NOT FOUND" + err);
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
  //create a list for users connected //

  
  pool.on('notification', message => {
    connection.send({
      channel: message.channel,
      //payload: message.payload
    });
  });

  console.log('New user connected');
  // temporary - default username is Anonyme
  socket.username = "Anonyme";
  socket.on('change_username', data => {
    socket.username = data.username;
    console.log(socket.username);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected '+socket.username);
  });

  socket.on('new_message', data => {
    console.log('New message from '+socket.username);
    io.sockets.emit('receive_message', {message: data.message, username: socket.username})
  });

  socket.on('typing', data => {
    socket.broadcast.emit('typing', {username: socket.username})
  })

});

// default redirection
app.use(function(req, res, next){
  res.redirect('/');
});

// run app 3000 port
server.listen(process.env.APP_PORT, () => console.log('http://localhost:'+process.env.APP_PORT));