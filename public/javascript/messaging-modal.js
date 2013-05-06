$(document).ready(function() {
	$("#messaging-button").click(function () {
		$('#messaging-modal').modal('toggle');
		socket.emit('messages',1,function(messages){
            console.log(messages);
        });  
	});

	
});

function buy_button()
{
	socket.emit('buyClick','andy@nyc.rr.com', 'andy','wheels@nyc.rr.com' , 'max', "Test0", 1, function(messages){
            console.log(messages);
        });  
}