//Requests and displays a list of books dependent on a search term


 window.addEventListener('load', function(){
 	getText('/latestEntries');
 }, false);

document.getElementById("search").addEventListener('onsubmit', function(){
	console.log("kappi you're a genius");
 	getText('/'+ document.getElementById("search").value);
 }, false);


 function getText(url){
    console.log("in get text");

        // create a request object
        var request = new XMLHttpRequest();

        // specify the HTTP method, URL, and asynchronous flag
        request.open('GET', url, true);

        // add an event handler
        request.addEventListener('load', function(e){
            if (request.status == 200) {
                // do something with the loaded content
                var content = request.responseText;
                var data = JSON.parse(content);
                refresh(data);
            } else {
                var ul = document.getElementById('list');
                // create a new li element for the Tweet, and append it
                var li = document.createElement('li');
                li.innerHTML = 'Something went wrong :(';
                ul.insertBefore(li);
                // something went wrong, check the request status
                // hint: 403 means Forbidden, maybe you forgot your username?
            }
        }, false);
        
        // start the request, optionally with a request body for POST requests
        request.send(null);
}


function refresh (data) {
    console.log("in refresh");
    var displaykeeper = 0;
    var ul = document.getElementById('list');
    ul.innerHTML = " ";

    for (var i =0; i < data.length; i ++){

            displaykeeper ++;

            var li = document.createElement('li');
            li.innerHTML = '<strong>' + data[i].title + '</strong> ' + 'by' + data[i].author + '<br>Used for:' +  '<small>' + data[i].class + '</small>';
            ul.insertBefore(li, ul.getElementsByTagName("li")[0]);

              if (displaykeeper >= 30){
                var ul = document.getElementById('messages');
                var li = ul.getElementsByTagName('li')[29];
      
        }    
    }   
}


