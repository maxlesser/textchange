//Requests and displays a list of books dependent on a search term


 window.addEventListener('load', function(){
    getText('/search/recent.json');

        document.getElementById("newBookForm").addEventListener('submit', addBook, false);

 }, false);

 function addBook(e){
    e.preventDefault();
    //Make sure to VERFIFY SHIZZ HERE
    var fd = new FormData(document.getElementById('newBookForm'));

    var req = new XMLHttpRequest();
    req.open('POST', '/addbook');
    console.log("attempting to add book");

    req.addEventListener('load', function(e){
        var content1 = req.responseText;
        var data1= JSON.parse(content1);
        console.log(data1);
    });
 }


function sell(){
    document.getElementById("buy").style.display = 'none';
    document.getElementById("sell").style.display = 'block';
    var Sellli = document.getElementById("sellTab");
    var Buyli = document.getElementById("buyTab");
    Sellli.className = "active";
    Buyli.className = "";
    return false;
}

function buy(){
    document.getElementById("sell").style.display = 'none';
    document.getElementById("buy").style.display = 'block';
    var Sellli = document.getElementById("sellTab");
    var Buyli = document.getElementById("buyTab");
    Sellli.className = "";
    Buyli.className = "active";
    return false;
}


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
                console.log("ajdhkjfhkjdshf");
                console.log(content);
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

    for (var i =0; i < data.rowCount; i ++){

            var li = document.createElement('li');
            var d = new Date(data.rows[i].time*1000);

            var newitem = '<div class="list_thumbnail">' +
              '<img src="../public/assets/testbook.jpeg" alt="" width="80" height="100">' +
              '<h3>'+ data.rows[i].title + '<small> by ' + data.rows[i].author + '</small>' +'</h3>' +
              '<p>Class: <strong>' + data.rows[i].class + '</strong> &emsp; Seller: <strong>' + data.rows[i].seller +'</strong></p>'+
              '<div class= "buy_btn">'+
                '<p>'+ 'Posted at:'+ '<small> '+ d.toLocaleTimeString()+', '+ d.toLocaleDateString()+'</small>' +'<br><br>'+
                '<button class="btn btn-large btn-primary pull-right" type="button">Buy</button>'+
                
                '</p>'+
              '</div>' +
            '</div>' ;

            li.innerHTML = newitem;



            ul.insertBefore(li, ul.getElementsByTagName("li")[0]);

        }    
    }   



