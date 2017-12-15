function loadLink(url)
{
	$.post("./loadVLC",{data:url},(data) =>{
        
        setTimeout(function(){
    		let chaine = '';
    		console.log(data);
	        console.log("ok");
	        chaine += '<video controls=""  name="media" src="http://localhost:'+data+'" type="video/ogg;" width="700">';
	        chaine += '</video>';
			$('#content').empty();
			$('#content').append(chaine);
		}, 2000);
        
    });
}