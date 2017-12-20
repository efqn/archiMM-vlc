const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const sql = require('./sql');
const spawn = require('child_process').spawn;

let sess;
let code;

let server_ports  = [];
let pids 		  = [];
let client_id    = [];
const ports_range = 16383;	// 65535 - 49152
const ports_offset = 49152;

class Server {

	constructor() {
		
		this.server = express();
		this.server.use(session({secret: 'ytb-big-data'}));
		this.server.use(bodyParser.json());
		this.server.use(bodyParser.urlencoded({extended: true}));

		for(var i=0; i<ports_range; i++) {
			server_ports.push(0);
			pids.push(0);
			client_id.push(0);
		}

		this.server.get('/', (req, res) => {
			sess = req.session;
			res.send(fs.readFileSync('./view/index.html', 'utf8'));

		});

		this.server.post('/closeVLC', (req,res) => {
			if(pids[req.body.clientID] !=0)
			{
				code = spawn('kill', [pids[req.body.clientID]]);
				code.on("error", function(err){
					console.log("ok");
				});
				pids[req.body.clientID] = 0;
				server_ports[req.body.data - ports_offset] = 0;
				console.log("closing port "+req.body.data);
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
			while(client_id[i] != 0 && i<ports_range) {
				i++;
			}
			if( i < ports_range) {
				client_id[i] = 1;
				res.end(""+ i);
				console.log("available id found");
			}
			else {
				res.end("no id available");
			}
		});

		this.server.post('/loadVLC', (req, res) => {

			let i = 0;
			console.log("searching available port...");
			while(server_ports[i] != 0 && i<ports_range) {
				i++;
			}
			if( i < ports_range) {
				server_ports[i] = 1;
				let port_selected = i+ ports_offset;
				console.log("port selected : "+port_selected);
				let code = spawn('vlc' , [req.body.data,':sout=#transcode{vcodec=theo,vb=800,scale=1,acodec=vorb,ab=128,channels=2,samplerate=44100}:http{mux=ogg,dst=:'+port_selected+'/}',':sout-keep'], {
					detached : true,
					stdio : 'ignore'
				});
				pids[req.body.clientID] = code.pid;
				console.log(req.body.clientID);
				console.log(code.pid);
				res.end(""+port_selected);
			}
			else {
				res.end("no port available");
			}
		});

		this.server.get('/loged', (req,res) => {
			sess = req.session;
			if(sess.email) {
			    res.end('Already');
			}
			else {
				res.end('done');
			    
			}
		});
		this.server.post('/login', (req, res) => {
			sess = req.session;
			sql.selectUser(req.body.email,req.body.pass,(data) =>{
				if (typeof data[0] !== "undefined")
				{
					sess.email = req.body.email;
					res.end('done');
				}
				else{
					res.end('Erreur');
				}
			});
		});

		this.server.get('/logout',(req,res) => {
			req.session.destroy(function(err) {
			  if(err) {
			    console.log(err);
			  } else {
			    res.end('done');
			  }
			});
		});

		this.server.post('/configwrite', function(req, res) {
		    var body = req.body.data;
		    var filePath = './model/config.txt';
		    fs.writeFile(filePath, body, function() {
		    	res.end();
		    });
		});

		this.server.use('/js', express.static('./js'));

		this.server.use('/config.txt', express.static('./model/config.txt'));

		this.server.use('/write.php', express.static('./model/write.php'));

		this.server.use('/quizz.txt', express.static('./model/quizz.txt'));

		this.server.use('/css', express.static('./css'));

	}



	start(host, port) {

		this.server.listen(port, host, () => {

			console.log(`Listening on '${host}' on the port ${port}...`);

		});

	}

}



module.exports = new Server();

