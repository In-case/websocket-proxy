var WebSocket = require('ws');
var wss = new WebSocket.Server({ port: process.env.PORT || 8080 });
wss.on('connection', function (cws, req) {
	console.log(`New connection from ${req.connection.remoteAddress}`);
	var tws = new WebSocket("ws://www.multiplayerpiano.com:443", {
		origin:"http://www.multiplayerpiano.com"
	});

	// client to server
	var messageBuffer = [];
	tws.on('open', function(){
		for (let message of messageBuffer)
			tws.send(message);
	});
	cws.on('message', function(message){
		if (tws.readyState == WebSocket.OPEN) tws.send(message);
		else messageBuffer.push(message);
	});
	cws.on('close', function(){
		tws.close();
		console.log(`Closing connection from ${req.connection.remoteAddress}`)
		delete messageBuffer;
	});
	cws.on('error', console.error);

	// server to client
	tws.on('message', function(message){
		cws.send(message.data);
	});
	tws.on('close', function(){
		cws.close();
	});
	tws.on('error', console.error);
});