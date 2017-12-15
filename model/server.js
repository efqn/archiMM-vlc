const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const exec = require('child_process').exec;

let sess;
let code;

let server_ports = [];
const ports_range = 16383;	// 65535 - 49152

class Server {

	constructor() {
		
		this.server = express();
		this.server.use(bodyParser.json());
		this.server.use(bodyParser.urlencoded({extended: true}));

		// ports disponibles
		for(var i=0; i<ports_range; i++) {
			server_ports.push(0);
		}

		this.server.get('/', (req, res) => {
			sess = req.session;
			res.send(fs.readFileSync('./view/index.html', 'utf8'));
			//code = execSync('vlc /home/norabbit/Téléchargements/yourNameOST.mp4 :sout=#transcode{vcodec=theo,vb=800,scale=1,acodec=vorb,ab=128,channels=2,samplerate=44100}:http{mux=ogg,dst=:1234/} :sout-keep');
		});
		this.server.post('/loadVLC', (req, res) => {

			let port = 49152;
			let i = 0;
			console.log("searching available");
			while(server_ports[i] != 0 && i<ports_range) {
				i++;
			}
			if( i < ports_range) {
				server_ports[i] = 1;
				let port_selected = i+port;
				console.log("port selected :"+port_selected);
				code = exec('vlc ' + req.body.data + ' :sout=#transcode{vcodec=theo,vb=800,scale=1,acodec=vorb,ab=128,channels=2,samplerate=44100}:http{mux=ogg,dst=:'+port_selected+'/} :sout-keep');
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

