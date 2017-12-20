var id = 0;

function start()
{
	$.get("./load",(data) => {
		id = data;
		console.log("id : "+id);
	});
}

function loadLink(url)
{
	$.post("./loadVLC",{data:url,cliendID : id},(data) =>{
        
        setTimeout(function(){
    		let chaine = '';
    		console.log(data);
	        console.log("ok");
	        chaine += '<video controls=""  autoplay name="media" src="http://localhost:'+data+'" type="video/ogg;" width="700">';
	        chaine += '</video>';
			$('#content').empty();
			$('#content').append(chaine);
		}, 2000);
        
    });
}

$(window).bind("beforeunload",{cliendID : id}, function() { 
    $.post("./closeVLC",(data)=>{
    	
    }); 
});