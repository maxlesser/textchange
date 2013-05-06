var socket;

window.addEventListener('load',function(){

	$("#messaging-button").click(function (e) {
		e.preventDefault();

		$('#messaging-modal').modal('toggle');

		noNotifications();
		//$('#its4amfuck').scrollTop($('#its4amfuck')[0].scrollHeight);
		$("#its4amfuck").animate({ scrollTop: $('#its4amfuck')[0].scrollHeight}, 1000);



		// socket.emit('messages',1,function(messages){
  //           console.log(messages);
  //       });  
	});

	$('#messaging-modal').on('hidden', function () {
    	noNotifications();
	});

	document.getElementById('messageForm').addEventListener('submit',sendMessage, false);


	if (document.querySelector('meta[name=nickname]').content != "null"){
 		socket = io.connect();
 		socket.on('newMessage',  function(data){
			console.log(data);
			updateThreads(data);
		});
        socket.emit('join',document.querySelector('meta[name=username]').content,function(messageThreads){
        console.log(messageThreads);
        loadThreads(messageThreads);

    	});  
	}


	//all the socket.ons and the join go in here
});


function newNotification(){

	var a = document.getElementById('messaging-button');
	a.style.backgroundColor= "#BDCDE9";


}

function noNotifications(){

	var a = document.getElementById('messaging-button');
	a.style.backgroundColor = "";
}

function requestMessages(id){

	// var idNumber = id.substring(7);
	// idNumber = parseInt(idNumber); 

	var thread = document.getElementById('thread'+id);
	var read = $('#thread'+id+' input').val();
	if (read == "yes"){
		socket.emit('requestMessages',id, function(data){

			var ul = document.getElementById('messageThread');
		    ul.innerHTML = " ";

		    for (var i =0; i < data.rowCount; i ++){

		            var li = document.createElement('li');
		            var d = new Date(data.rows[i].time*1000);

		            var newitem = '<strong>' + data.rows[i].nickname + ': </strong> ' + data.rows[i].content + 
		            '<br><small class="pull-right">- ' + d.toLocaleTimeString()+', '+ d.toLocaleDateString()+ '</small><br>';

		            li.innerHTML = newitem;

		            if (document.querySelector('meta[name=nickname]').content != data.rows[i].nickname ){
		            	li.className += ' senderMessage';
		            }

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

		            var newitem = '<strong>' + data.rows[i].nickname + ': </strong> ' + data.rows[i].content + 
		            '<br><small>- ' + d.toLocaleTimeString()+', '+ d.toLocaleDateString()+ '</small>';

		            li.innerHTML = newitem;

		            if (document.querySelector('meta[name=nickname]').content != data.rows[i].nickname ){
		            	li.className += ' senderMessage';
		            }
		            
		            ul.appendChild(li);
		        } 

		    thread.style.color="";
			$('#thread'+id+' input').val('yes');
		 	//remove notifications if applicable


	});
	}
}

function updateThreads(data){

	var thread = document.getElementById('thread'+ data);

	if (thread){
		//remember to check if current thread!!!! and refresh accordingly: requestMessages(id);
		var li = thread.parentNode;
		var classes = li.classList;
		if (classes.length == 1)
		{
			thread.style.color="#062691";
			$('#thread'+data+' input').val("no");

		}    
		else
		{
			requestMessages(data);	
		}

        newNotification();
	}

	else{
		var ul = document.getElementById('threadList');
		var li = document.createElement('li');
	    li.setAttribute("class","messages");


		var myName = document.querySelector('meta[name=username]').content
		

    	socket.emit('findOut', data, function(threadInfo){

    		var nickname = threadInfo.rows[0].buyer_nickname;

			var newitem = '<a href="#" id="thread'+ data+'" onClick= "requestMessages('+data+')"'+
            ' data-toggle="tab"><strong>'+threadInfo.rows[0].title + '</strong>'+
            '<br>'+ threadInfo.rows[0].buyer_nickname +' <input type="hidden"  value="no"> </a>';

            li.innerHTML = newitem;
            $("#threadList").prepend(li);
            //ul.insertBefore(li);

            document.getElementById('thread'+data).style.color="#062691";
            newNotification();
			$('#thread'+data+' input').val("no");
			$('#thread'+data).click();
			document.getElementById('messageField').value = "Hi " + threadInfo.rows[0].seller_nickname + ", I would love to purchase " + threadInfo.rows[0].title + ". Let me know when you're free. \n -" + document.querySelector('meta[name=nickname]').content;


    	});

	}
	

}



function loadThreads(data){

    var ul = document.getElementById('threadList');
    ul.innerHTML = " ";

    if (data.rowCount == 0)
    {
    	return;
    }

    var topThreadID = data.rows[0].id;


    var li = document.createElement('li');
    li.setAttribute("class","active messages");


    var newitem = '<a href="#" id="thread'+data.rows[0].id+'" onClick= "requestMessages(' + topThreadID + ')" '+
    'data-toggle="tab"><strong>'+ data.rows[0].title + '</strong><br>'+ data.rows[0].other_name +' <input type="hidden" value="';

    if (data.rows[0].seen == "false"){ newitem += 'no';} 
    else{ newitem += 'yes';}

    newitem += '"> </a>';

    li.innerHTML = newitem;

    ul.appendChild(li);

    requestMessages(topThreadID);


    for (var i =1; i < data.rowCount; i ++){

            var li = document.createElement('li');
    		li.setAttribute("class","messages");

            newitem = '<a href="#" id="thread'+data.rows[i].id+'" onClick= "requestMessages('+ data.rows[i].id+')" data-toggle="tab"><strong>'+data.rows[i].title + '</strong>'+
            '<br>'+ data.rows[i].other_name +' <input type="hidden" value="';

            if (data.rows[i].seen == "false"){ newitem += 'no';} 
            else{ newitem += 'yes';}

            newitem += '"> </a>';

            li.innerHTML = newitem;

            ul.appendChild(li);

            if (data.rows[i].seen == "false"){
                document.getElementById('thread'+data.rows[i].id).style.color="#062691";
                newNotification();
            }
        }  

}

function parseId(str)
{
	var idNumber = str.substring(6);
	var intIdNumber = parseInt(idNumber); 
	return intIdNumber;
}


function sendMessage(e){
	e.preventDefault();

    var text = document.getElementById('messageField').value;
    var id = parseId($('li.active.messages a').attr('id'));

    socket.emit('newMessageUpload', text, id, document.querySelector('meta[name=username]').content, document.querySelector('meta[name=nickname]').content);
    $("#messageField").val("");

}




function buy_button(input)
{
		if (document.querySelector('meta[name=username]').content == "null")
		{
			alert("Please sign in to buy books!");
			return;
		}	

		if (document.querySelector('meta[name=username]').content == input.seller.value)
		{
			alert("Silly duck, you can't buy your own book...");
			return;
		}	
		socket.emit('buyClick',document.querySelector('meta[name=username]').content, document.querySelector('meta[name=nickname]').content,
			input.seller.value , input.seller_nickname.value, input.title.value, input.post_id.value, function(messages){
		
		updateThreads(messages.rows[0].id);
		$('#messaging-modal').modal('toggle');
		$('#thread'+messages.rows[0].id).click();

    });  
}
