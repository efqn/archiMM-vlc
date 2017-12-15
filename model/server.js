const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const exec = require('child_process').exec;

let sess;
let code;
class Server {

	constructor() {
		
		this.server = express();
		this.server.use(bodyParser.json());
		this.server.use(bodyParser.urlencoded({extended: true}));

		this.server.get('/', (req, res) => {
			sess = req.session;
			res.send(fs.readFileSync('./view/index.html', 'utf8'));
			//code = execSync('vlc /home/norabbit/Téléchargements/yourNameOST.mp4 :sout=#transcode{vcodec=theo,vb=800,scale=1,acodec=vorb,ab=128,channels=2,samplerate=44100}:http{mux=ogg,dst=:1234/} :sout-keep');
		});
		this.server.post('/loadVLC', (req, res) => {
			code = exec('vlc ' + req.body.data + ' :sout=#transcode{vcodec=theo,vb=800,scale=1,acodec=vorb,ab=128,channels=2,samplerate=44100}:http{mux=ogg,dst=:1234/} :sout-keep');
			console.log("ici");
			res.end("ok");
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

