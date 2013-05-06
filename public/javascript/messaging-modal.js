var socket = io.connect();

window.addEventListener('load',function(){
	document.getElementById('messageForm').addEventListener('submit',sendMessage, false);

	socket.on('newMessage',  function(data){
		updateThreads(data);
	});

	//all the socket.ons and the join go in here
});


function newNotification(){

	var li = document.getElementById('messagesBar');

	var newMessage = '<a href="#" id= "messaging-button" style="background-color:#0819A9"><i class="icon-envelope"></i>New messages!</a>';
	
	li.innerHTML = newMessage;

}

function noNotifications(){

	var li = document.getElementById('messagesBar');

	var newMessage = '<a href="#" id= "messaging-button"><i class="icon-envelope"></i>Messages</a>';
	
	li.innerHTML = newMessage;
}

function requestMessages(id){

	var thread = document.getElementById('thread'+id);

	if (thread.read.value == "yes"){
		socket.emit('requestMessages',id, function(data){

			var ul = document.getElementById('messageThread');
		    ul.innerHTML = " ";

		    for (var i =0; i < data.rowCount; i ++){

		            var li = document.createElement('li');
		            var d = new Date(data.rows[i].time*1000);

		            var newitem = '<strong>' + data.rows[i].sender + ': </strong> ' + data.rows[i].content + 
		            '<br><small>- ' + d.toLocaleTimeString()+', '+ d.toLocaleDateString()+ '</small>';

		            li.innerHTML = newitem;

		            ul.appendChild(li);
		        } 

	});
	}
	

	else{
			socket.emit('requestMessagesUnread',id, function(data){

			var ul = document.getElementById('messageThread');
		    ul.innerHTML = " ";

		    for (var i =0; i < data.rowCount; i ++){

		            var li = document.createElement('li');
		            var d = new Date(data.rows[i].time*1000);

		            var newitem = '<strong>' + data.rows[i].sender + ': </strong> ' + data.rows[i].content + 
		            '<br><small>- ' + d.toLocaleTimeString()+', '+ d.toLocaleDateString()+ '</small>';

		            li.innerHTML = newitem;

		            ul.appendChild(li);
		        } 

		    thread.style.color="";
		    thread.read.value = "yes";

		 	//remove notifications if applicable



	});
	}
}

function updateThreads(data){

	var thread = document.getElementById('thread'+ ID OF THREAD);

	if (thread){
		//remember to check if current thread!!!! and refresh accordingly: requestMessages(id);
		thread.style.color="blue";
        newNotification();
        thread.read.value = "no";
	}

	else{
		var ul = document.getElementById('threadList');
		var li = document.createElement('li');

            newitem = '<a href="#" id="thread'+CHANGE TO ID OF THREAD+'" onClick= "requestMessagesUNREAD('+CHANGE TO ID OF THREAD+')"'+
            ' data-toggle="tab"><strong>'+Bookname + '</strong>'+'
            <br>'+ sender +' <input type="hidden" name="read" value="no"> </a>';

            li.innerHTML = newitem;

            ul.insertBefore(li);

            document.getElementById('thread'+ID OF THREAD).style.color="blue";
            newNotification();
            thread.read.value = "no";
		    
	}
	

}



function loadThreads(data){

	var ul = document.getElementById('threadList');
    ul.innerHTML = " ";

    var topThreadID = ID OF TOP THREAD;

    requestMessages(topThreadID);

    var li = document.createElement('li');

    var newitem = '<li class="active"><a href="#" onClick= "';
    
    if (UNREAD MESSAGE){ newitem += 'requestMessagesUNREAD(';} 
    else{ newitem += 'requestMessages(';}
    
    newitem += topThreadID + ')" '+
    'data-toggle="tab"><strong>'+ bookname + '</strong><br>'+ sender +' <input type="hidden" name="read" value="';

    if (UNREAD MESSAGE){ newitem += 'no';} 
    else{ newitem += 'yes';}

    newitem += '"> </a></li>';

    li.innerHTML = newitem;

    ul.appendChild(li);

    for (var i =1; i < data.rowCount; i ++){

            var li = document.createElement('li');

            newitem = '<a href="#" id="thread'+CHANGE TO ID OF THREAD+'" onClick= "requestMessages('+ CHANGE TO ID OF THREAD+')" data-toggle="tab"><strong>'+Bookname + '</strong>'+
			'<br>'+ sender +' <input type="hidden" name="read" value="';

		    if (UNREAD MESSAGE){ newitem += 'no';} 
		    else{ newitem += 'yes';}

		    newitem += '"> </a></li>';

            li.innerHTML = newitem;

            ul.appendChild(li);

            if (UNREAD){
            	document.getElementById('thread'+ID OF THREAD).style.color="blue";
            	newNotification();
            }
        }  

}

function sendMessage(e){
	e.preventDefault();

    var text = document.getElementById('messageField').value;
    socket.emit('message', text);
}



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
