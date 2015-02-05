
window.addEventListener('load',function(){

	$("#messaging-button").click(function (e) {
		e.preventDefault();

		$('#messaging-modal').modal('toggle');

		noNotifications();
		$('#its4amfuck').scrollTop($('#its4amfuck')[0].scrollHeight);
	});

	$('#messaging-modal').on('hidden', function () {
    	noNotifications();
	});

	document.getElementById('messageForm').addEventListener('submit',sendMessage, false);


	if (document.querySelector('meta[name=nickname]').content != "null"){

    	ajax.get('/messages/requestAllThreads', {}, function(threads) {
    		var parsed = JSON.parse(threads);
    		loadThreads(parsed);
    	});
        ajax.get('/messages/requestUnreadThreads', {}, updateUnreadThreads);
	}
});

function newNotification(){

	var a = document.getElementById('messaging-button');
	a.style.backgroundColor= "#BDCDE9";


}

function noNotifications(){

	var a = document.getElementById('messaging-button');
	a.style.backgroundColor = "";
}

// Requests all messages for given thread by ID
function requestMessages(id){

	// var idNumber = id.substring(7);
	// idNumber = parseInt(idNumber); 

	var thread = document.getElementById('thread'+id);
	var read = $('#thread'+id+' input').val();

	ajax.get('/messages/requestThread', {'threadID': id}, function(data) 
	{
		data = JSON.parse(data);
		var ul = document.getElementById('messageThread');
	    ul.innerHTML = " ";

	    for (var i =0; i < data.rowCount; i ++)
	    {

            var li = document.createElement('li');
            var d = new Date(data.rows[i].time*1000);

            if (document.querySelector('meta[name=nickname]').content != data.rows[i].nickname ){
            	li.className += ' senderMessage';
            }

            var newitem = '<strong>' + data.rows[i].nickname + ': </strong> ' + data.rows[i].content + 
            '<br><small class="pull-right">- ' + d.toLocaleTimeString()+', '+ d.toLocaleDateString()+ '</small><br>';

            li.innerHTML = newitem;

            ul.appendChild(li);

        } 

        $('#its4amfuck').scrollTop($('#its4amfuck')[0].scrollHeight);

	});

	if (read != "yes")
	{
		ajax.post('/messages/threadRead', {'threadID': id}, null);

	    thread.style.color="";
		$('#thread'+id+' input').val('yes');
	}
}

// updates Thread of threadID
// If none exists, creates the thread
function updateThread(threadID){

	var thread = document.getElementById('thread'+ threadID);
	document.getElementById('messageForm').style.visibility='visible' ; 

	if (thread){
		//remember to check if current thread!!!! and refresh accordingly: requestMessages(id);
		var li = thread.parentNode;
		var classes = li.classList;
		if (classes.length == 1)
		{
			thread.style.color="#062691";
			$('#thread'+threadID+' input').val("no");

		}    
		else
		{
			requestMessages(threadID);	
		}

        newNotification();
	}

	else{
		var ul = document.getElementById('threadList');
		var li = document.createElement('li');
	    li.setAttribute("class","messages");


		var myName = document.querySelector('meta[name=username]').content
		
		ajax.get('/messages/threadInfo', {'threadID': threadID}, function(threads) 
		{
			threadInfo = JSON.parse(threads);
    		var nickname = threadInfo.rows[0].buyer_nickname;

			var newitem = '<a href="#" id="thread'+ threadID+'" onClick= "requestMessages('+threadID+')"'+
            ' data-toggle="tab"><strong>'+threadInfo.rows[0].title + '</strong>'+
            '<br>'+ threadInfo.rows[0].buyer_nickname +' <input type="hidden"  value="no"> </a>';

            li.innerHTML = newitem;
            $("#threadList").prepend(li);
            //ul.insertBefore(li);

            document.getElementById('thread'+threadID).style.color="#062691";
            newNotification();
			$('#thread'+threadID+' input').val("no");
			$('#thread'+threadID).click();
			if (threadInfo.rows[0].buyer ==  myName)
			{
				document.getElementById('messageField').value = "Hi " + threadInfo.rows[0].seller_nickname + ", I would love to purchase " + threadInfo.rows[0].title + ". Let me know when you're free. \n -" + document.querySelector('meta[name=nickname]').content;
			}
    	});
	}
}

// Creates a 'thread' area for each thread (not populated with actual messages yet)
function loadThreads(data){

    var ul = document.getElementById('threadList');
    ul.innerHTML = " ";

    if (data.rowCount == 0)
    {
    	document.getElementById('messageForm').style.visibility='hidden' ;
    	return;
    }

	document.getElementById('messageForm').style.visibility='visible' ; 

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

    if (data.rows[0].seen == "false"){
                document.getElementById('thread'+data.rows[0].id).style.color="#062691";
                newNotification();
            }

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

// given json of the threads which are unread, updates their unread status
function updateUnreadThreads(unreadThreads) {
    if(unreadThreads)
    {
        var parsed = JSON.parse(unreadThreads); 
        if(parsed.rowCount > 0)
        {        
            for (index = 0; index < parsed.rowCount; ++index) {
                updateThread(parsed.rows[index].id);
            }
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

    ajax.post('/messages/post', {'threadID': id, 'message': text}, function() {});
    updateThread(id);

    $("#messageField").val("");
}




function buy_button(input)
{
	if (document.querySelector('meta[name=username]').content == "null")
	{
		document.getElementById('alert-text').innerHTML=("Please log in to buy books.");
        $('#blank-alert').modal("show");
		return;
	}	

	if (document.querySelector('meta[name=username]').content == input.seller.value)
	{
		document.getElementById('alert-text').innerHTML=("You can't buy your own book.");
        $('#blank-alert').modal("show");
		return;
	}

	ajax.post('/messages/buyClick', {'seller': input.seller.value, 'seller_nickname': input.seller_nickname.value, 'title': input.title.value, 'post_id': input.post_id.value}, function(messages){
		var parsed = JSON.parse(messages);
		updateThread(parsed.rows[0].id);
		$('#messaging-modal').modal('toggle');
		$('#thread'+parsed.rows[0].id).click();
	});  
}




var ajax = {};
ajax.x = function() {
    if (typeof XMLHttpRequest !== 'undefined') {
        return new XMLHttpRequest();  
    }
    var versions = [
        "MSXML2.XmlHttp.5.0",   
        "MSXML2.XmlHttp.4.0",  
        "MSXML2.XmlHttp.3.0",   
        "MSXML2.XmlHttp.2.0",  
        "Microsoft.XmlHttp"
    ];

    var xhr;
    for(var i = 0; i < versions.length; i++) {  
        try {  
            xhr = new ActiveXObject(versions[i]);  
            break;  
        } catch (e) {
        }  
    }
    return xhr;
};

ajax.send = function(url, callback, method, data, sync) {
    var x = ajax.x();
    x.open(method, url, sync);
    x.onreadystatechange = function() {
        if (x.readyState == 4) {
            callback(x.responseText)
        }
    };
    if (method == 'POST') {
        x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }
    x.send(data)
};

ajax.get = function(url, data, callback, sync) {
    var query = [];
    for (var key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    ajax.send(url + '?' + query.join('&'), callback, 'GET', null, sync)
};

ajax.post = function(url, data, callback, sync) {
    var query = [];
    for (var key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    ajax.send(url, callback, 'POST', query.join('&'), sync)
};


// periodically calls for unread threads, and for each one updates that thread's read status
window.setInterval(function() 
{
	ajax.get('/messages/requestUnreadThreads', {}, updateUnreadThreads);
}, 2000);