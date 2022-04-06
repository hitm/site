var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var fs = require('fs');
var https = require('https');

app.set('views', __dirname + '/views')
app.set('view engine', 'pug')
app.use(express.static(__dirname + '/public'))

server.listen(5000, function () {
  console.log('Server listening at port %d', 5000);
});

const opts = {
  key: fs.readFileSync('./sert/privateKey.key'),
  cert: fs.readFileSync('./sert/certificate.crt')
}

var httpsServer = https.createServer(opts, app);
httpsServer.listen(5001, function(){
  console.log("HTTPS on port " + 5001);
})

app.get('/', function (req, res) {
  res.render('index');
})

io.attach(httpsServer);
io.attach(server);

io.on('connection', function(client) {  
    console.log('Client connected...');
    client.on('click', function(data){
      console.log(JSON.parse(data));
        setTimeout(function() {
          client.emit("ok", "data");
        }, 3000);
    })
});