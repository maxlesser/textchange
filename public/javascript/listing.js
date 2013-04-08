//Requests and displays a list of books dependent on a search term


 window.addEventListener('load', function(){
 	//getText('/latestEntries');
    /*document.getElementById('search').addEventListener('onsubmit', function(){
        console.log("kappi you're a genius");
        //getText('/'+ document.getElementById("search").value);
     }, false);*/
 }, false);


function search(text){
    getText('/search/' + document.getElementById("search").value + '/books.json');
}

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
                console.log("YOU SHOULD NOT BE HERE");
                // something went wrong, check the request status
                // hint: 403 means Forbidden, maybe you forgot your username?
            }
        }, false);
        
        // start the request, optionally with a request body for POST requests
        request.send(null);
}


function refresh (data) {
    console.log("in refresh");
    console.log(data)
    var ul = document.getElementById('list_thumbnails');
    ul.innerHTML = " ";

    for (var i =0; i < data.length; i ++){


            var li = document.createElement('li');

            var newitem = '<div class="list_thumbnail">' +
              '<img src="../public/assets/testbook.jpeg" alt="" width="80" height="100">' +
              '<h3>'+ data[i].title + '<small> by ' + data[i].author + '</small></h3>
              <p>Class: <strong>' + data[i].class + '</strong> &emsp; Seller: <strong>' + data[i].Seller +'</strong></p>
              <div class= "buy_btn">
                <p>
                <button class="btn btn-large btn-primary" type="button">Buy</button><br><br>
                
                </p>
              </div>
            </div>' ;

            li.innerHTML = newitem;



            ul.insertBefore(li, ul.getElementsByTagName("li")[0]);

        }    
    }   
}


