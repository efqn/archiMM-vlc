const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const spawn = require('child_process').spawn;

let sess;
let code;

let server_ports  = [];
let pids 		  = [];
let client_id    = [];
const ports_range = 16383;	// 65535 - 49152

class Server {

	constructor() {
		
		this.server = express();
		this.server.use(bodyParser.json());
		this.server.use(bodyParser.urlencoded({extended: true}));

		// ports disponibles, pids & client_id
		for(var i=0; i<ports_range; i++) {
			server_ports.push(0);
			pids.push(0);
			client_id.push(0);
		}

		this.server.get('/', (req, res) => {
			sess = req.session;
			res.send(fs.readFileSync('./view/index.html', 'utf8'));
			//code = execSync('vlc /home/norabbit/Téléchargements/yourNameOST.mp4 :sout=#transcode{vcodec=theo,vb=800,scale=1,acodec=vorb,ab=128,channels=2,samplerate=44100}:http{mux=ogg,dst=:1234/} :sout-keep');
		});

		this.server.post('/closeVLC', (req,res) => {
			if(pids[req.body.clientID] !=0)
			{
				code = spawn('kill' + pids[req.body.clientID]);
				code.on("error", function(err){
					console.log("ok");
				});
				console.log(pids[req.body.clientID]);
				pids[req.body.clientID] = 0;
				console.log("work");
				/*server_ports[req.body.data] = 0;
				console.log("closing port "+req.body.data);*/
			}
		});

		this.server.get('/close', (req,res) => {
			if(client_id[req.body.clientID] == 1)
			{
				if(pids[req.body.clientID] !=0)
				{
					//code = exec('kill ' + pids[req.body.clientID]);
					pids[req.body.clientID] = 0;
				}
				client_id[req.body.clientID] = 0;
			}
		});

		this.server.get('/load', (req, res) => {
			let id = 49152;
			let i = 0;
			console.log("searching available id...");
			while(server_ports[i] != 0 && i<ports_range) {
				i++;
			}
			if( i < ports_range) {
				client_id[i] = 1;
				res.end(""+client_id[i]);
				console.log("available id found");
			}
			else {
				res.end("no id available");
			}
		});

		this.server.post('/loadVLC', (req, res) => {

			let port = 49152;
			let i = 0;
			console.log("searching available port...");
			while(server_ports[i] != 0 && i<ports_range) {
				i++;
			}
			if( i < ports_range) {
				server_ports[i] = 1;
				let port_selected = i+port;
				console.log("port selected : "+port_selected);
				let code = spawn('vlc' , [req.body.data + ' :sout=#transcode{vcodec=theo,vb=800,scale=1,acodec=vorb,ab=128,channels=2,samplerate=44100}:http{mux=ogg,dst=:'+port_selected+'/} :sout-keep'], {
					detached : true,
					stdio : 'ignore'
				});
				pids[req.body.clientID] = code.pid;
				console.log(code);
				res.end(""+port_selected);
			}
			else {
				res.end("no port available");
			}
		});

		this.server.use('/js', express.static('./js'));

		this.server.use('/css', express.static('./css'));

	}



	start(host, port) {

		this.server.listen(port, host, () => {

			console.log(`Listening on '${host}' on the port ${port}...`);

		});

	}

}



module.exports = new Server();

