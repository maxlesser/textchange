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
    req.open('POST', '/addbook', true);
    console.log("attempting to add book");

    req.addEventListener('load', function(e){
        console.log("in here");
        var content1 = req.responseText;
        var data1= JSON.parse(content1);
        refreshSell(data1);
    }, false);
    req.send(fd);
 }

 function deletePost(clicked){

    var fd = new FormData();
    fd.append("post_id", clicked);
    fd.append("username", "Kappi");


    var req = new XMLHttpRequest();
    req.open('POST', '/remove_post', true);
    console.log("attempting to delete post");

    req.addEventListener('load', function(e){
        console.log("back from deleting");
        var content = req.responseText;
        var data= JSON.parse(content);
        refreshSell(data);
    }, false);
    req.send(fd);
 
 }

 function markSold(clicked){

    var fd = new FormData();
    fd.append("post_id", clicked);
    fd.append("username", "Kappi");


    var req = new XMLHttpRequest();
    req.open('POST', '/mark_as_sold', true);
    console.log("attempting to mark post sold");

    req.addEventListener('load', function(e){
        console.log("back from marking");
        var content = req.responseText;
        var data= JSON.parse(content);
        refreshSell(data);
    }, false);
    req.send(fd);
 
 }

function sell(){
    document.getElementById("buy").style.display = 'none';
    document.getElementById("sell").style.display = 'block';
    var Sellli = document.getElementById("sellTab");
    var Buyli = document.getElementById("buyTab");
    Sellli.className = "active";
    Buyli.className = "";
    console.log("where i should be");
    var request = new XMLHttpRequest();

        request.open('GET', '/user_posts/Kappi/book_posts.json', true);

        request.addEventListener('load', function(e){
            if (request.status == 200) {
                console.log("got that content");
                var content2 = request.responseText;
                var data2 = JSON.parse(content2);
                refreshSell(data2);
            } else {
                console.log("YOU SHOULD NOT BE HERE");
            }
        }, false);

        request.send(null);

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
                refreshBuy(data);
            } else {
                console.log("YOU SHOULD NOT BE HERE");
                // something went wrong, check the request status
                // hint: 403 means Forbidden, maybe you forgot your username?
            }
        }, false);
        
        // start the request, optionally with a request body for POST requests
        request.send(null);
}


function refreshBuy (data) {
    console.log("in refreshBuy");
    console.log(data)
    var ul = document.getElementById('list_thumbnails_buy');
    ul.innerHTML = " ";

    for (var i =0; i < data.rowCount; i ++){

            var li = document.createElement('li');
            var d = new Date(data.rows[i].time*1000);

            var newitem = '<div class="list_thumbnail">' +
              '<img src="../public/assets/testbook.jpeg" alt="" width="80" height="100">' +
              '<h3>'+ data.rows[i].title + '<small> by ' + data.rows[i].author + '</small>' +'</h3>' +
              '<p>Class: <strong>' + data.rows[i].class + '</strong> &emsp; Seller: <strong>' + data.rows[i].seller +'</strong> &emsp;'+
              
                '<span data-toggle="collapse" data-target="#demo">'+
                '<i class="icon-info-sign"></i>'+
                '</span></p>'+
     
                '<div id="demo" class="collapse">'+ data.rows[i].description +'</div>'+

              '<div class= "buy_btn">'+
                '<p>'+ 'Posted at:'+ '<small> '+ d.toLocaleTimeString()+', '+ d.toLocaleDateString()+'</small>' +'<br><br>'+
                '<button class="btn btn-large btn-primary pull-right" type="button">Buy for $'+ data.rows[i].price +'.00</button>'+
                
                '</p>'+
              '</div>' +
            '</div>' ;

            li.innerHTML = newitem;

            ul.appendChild(li);

        }    
    }   

function refreshSell (data) {
    console.log("in refreshSell");
    console.log(data)
    var ul = document.getElementById('list_thumbnails_sell');
    ul.innerHTML = " ";

    for (var i =0; i < data.rowCount; i ++){

            var li = document.createElement('li');
            var d = new Date(data.rows[i].time*1000);

            var newitem = '<div class="list_thumbnail">' +
              '<img src="../public/assets/testbook.jpeg" alt="" width="80" height="100">' +
              '<h3>'+ data.rows[i].title + '<small> by ' + data.rows[i].author + '</small>' +'</h3>' +
              '<p>Class: <strong>' + data.rows[i].class + '</strong> &emsp; Seller: <strong>' + data.rows[i].seller +'</strong> &emsp;'+
              
                '<span data-toggle="collapse" data-target="#demo">'+
                '<i class="icon-info-sign"></i>'+
                '</span></p>'+
     
                '<div id="demo" class="collapse">' + data.rows[i].description +'</div>';

            if (data.rows[i].sold == 0){
                newitem += '<div class= "buy_btn">'+
                '<p id ='+data.rows[i].id +'class = "right_text">'+ '&emsp;&emsp;&emsp;&emsp;&emsp;Posted at:'+ '<small> '+ d.toLocaleTimeString()+', '+ d.toLocaleDateString()+'</small>' +'<br><br>'+
                '<button class="btn btn-large btn-success " onClick="markSold($(this).parent().attr(\'id\'))" type="button">Mark as Sold</button>'+
                '<button class="btn btn-large btn-danger pull-right left_buffer" onClick="deletePost($(this).parent().attr(\'id\'))" type="button">Delete</button>'+
                
                    '</p>'+
                      '</div>' +
                    '</div>' ;
            }

            else{
                newitem += '<div class= "buy_btn">'+
                '<p id ='+data.rows[i].id +' >'+ 'Posted at:'+ '<small> '+ d.toLocaleTimeString()+', '+ d.toLocaleDateString()+'</small>' +'<br><br>'+
                '<button class="btn btn-large btn-danger pull-right" onClick="deletePost($(this).parent().attr(\'id\'))" type="button">Delete</button>'+
                    '</p>'+
                      '</div>' +
                    '</div>' ;
            }

              

            li.innerHTML = newitem;

            ul.appendChild(li);

        }    
    } 


