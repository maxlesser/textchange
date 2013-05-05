var socket;


$.fn.typeahead.Constructor.prototype.render = function (items) {

    var that = this;

    items = $(items).map(function (i, item) {
      i = $(that.options.item).attr('data-value', item);
      i.find('a').html(that.highlighter(item));
      return i[0];
    });

    this.$menu.html(items);
    return this;
};


 window.addEventListener('load', function(){
    getText('/search/recent.json');

    document.getElementById("newBookForm").addEventListener('submit', addBook, false);


    $('#condition_slider').slider({
          formater: function(value) {
            if (value == 1)
                return ("Poor");
            else if(value == 2)
                return("OK");
            else if(value==3)
                return("Good");
          }
        }).on('slide', function(ev){
        if (ev.value == 1)
        {
            $('#slider_display').html("Poor");
            $('#condition_color .slider-handle').css('background', 'red');
            
        }
        else if (ev.value == 2)
        {
            $('#slider_display').html("OK");
            $('#condition_color .slider-handle').css('background', 'yellow');

        }
        else if (ev.value==3)
        {
            $('#slider_display').html("Good");
            $('#condition_color .slider-handle').css('background', 'green');


        }   
    });
    $('#condition_filter').slider({
          formater: function(value) {
            if (value == 1)
                return ("Poor");
            else if(value == 2)
                return("OK");
            else if(value==3)
                return("Good");
          }
        }).on('slide', function(ev){
        if (ev.value == 1)
        {
            $('#slider_display').html("Poor");
            $('#condition_color .slider-handle').css('background', 'red');
            
        }
        else if (ev.value == 2)
        {
            $('#slider_display').html("OK");
            $('#condition_color .slider-handle').css('background', 'yellow');

        }
        else if (ev.value==3)
        {
            $('#slider_display').html("Good");
            $('#condition_color .slider-handle').css('background', 'green');


        }   
    });





    var username = document.querySelector('meta[name=nickname]').content;

    console.log(username);

    if (username == "null"){
        document.getElementById("usernameDropdown").style.display = 'none';
        document.getElementById("messaging-button").style.display = 'none';
        document.getElementById("topRightLogin").style.display = 'block';
    }

    else{
        document.getElementById("usernameDropdown").style.display = 'block';
        document.getElementById("messaging-button").style.display = 'block';
        $('#usernameDropdown').html(username + " "+"<b class=\"caret\"></b>");

        document.getElementById("topRightLogin").style.display = 'none';
        socket = io.connect();
    }

    $('#isbn_info').popover({

                placement: 'bottom',
                content : 'An ISBN number is a 10 or 13 digit number that identifies a book. Enter an ISBN number here and we\'ll autofill part of the form!'
                //content : '<img  width="100px" height = "100px" src="'+data.rows[i].image+'"/>'

            });
    
    $('#condition_color .slider-handle').css('background', 'yellow');

    $('#uploadBox').popover({

        placement: 'right',
        trigger: 'manual',
        content : 'Please upload an image, how else will we know how pretty it is?'

            });


 }, false);


 // function searchISBN(num)
 // {
 //    // create a request object
 //    var request = new XMLHttpRequest();

 //    // specify the HTTP method, URL, and asynchronous flag
 //    request.open('GET', '/isbn/' + num, true);

 //    // add an event handler
 //    request.addEventListener('load', function(e){
 //        if (request.status == 200) {
 //            // do something with the loaded content
 //            var content = request.responseText;
 //            var data = JSON.parse(content);
 //            console.log(data);
 //            // this is where you put that shit in
 //        } else {
 //            console.log("YOU SHOULD NOT BE HERE");
 //            // something went wrong, check the request status
 //            // hint: 403 means Forbidden, maybe you forgot your     name?
 //        }
 //    }, false);
    
 //    // start the request, optionally with a request body for POST requests
 //    request.send(null);
 // }

 function getFileSize() {


    input = document.getElementById('uploadBox');
    
    file = input.files[0];
    return file.size;
    
}

 function addBook(e){
    e.preventDefault();

     if (document.getElementById("uploadBox").value == "")
    {
        $('#uploadBox').popover('show');
        return;

    }

    //Make sure to VERFIFY SHIZZ HERE
    var fd = new FormData(document.getElementById('newBookForm'));
    
    if ($('#highlighter_check').is(":checked"))
    {
        fd.append("highlighter", 1);
    }
    else
    {
        fd.append("highlighter", 0);

    }

    if ($('#writing_check').is(":checked"))
    {
        fd.append("writing", 1);

    }
    else
    {
        fd.append("writing", 0);
    }

    if (getFileSize() > 200000)
    {
        alert("Please keep your images under 200kb. Thanks!");
        return;
    }


    var req = new XMLHttpRequest();
    req.open('POST', '/addbook', true);
    console.log("attempting to add book");

    req.addEventListener('load', function(e){
        console.log("in here");
        var content1 = req.responseText;
        var data1= JSON.parse(content1);
        refreshSell(data1);
        getText('/search/recent.json');
        document.getElementById("newBookForm").reset();

    }, false);
    req.send(fd);

 }

 function deletePost(clicked){
    var r=confirm("You are about to delete this post!");
        if (r==true)
          {
        var fd = new FormData();
        fd.append("post_id", clicked);


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
    else{

    }
 
 }

 function markSold(clicked){

    var r=confirm("You are about to mark this book as sold!");
    if (r==true)
      {
           var fd = new FormData();
        fd.append("post_id", clicked);


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
    else
      {
      
      }


 
 }

function sell(){
    if (document.querySelector('meta[name=username]').content == "null")
    {
        alert("you must be logged in to sell books");
    }
    else{
    document.getElementById("buy").style.display = 'none';
    document.getElementById("sell").style.display = 'block';
    var Sellli = document.getElementById("sellTab");
    var Buyli = document.getElementById("buyTab");
    Sellli.className = "active";
    Buyli.className = "";
    console.log("where i should be");
    var request = new XMLHttpRequest();

        request.open('GET', '/book_posts.json', true);

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
    }

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
                var data = JSON.parse(content);
                refreshBuy(data);
            } else {
                console.log("YOU SHOULD NOT BE HERE");
                // something went wrong, check the request status
                // hint: 403 means Forbidden, maybe you forgot your     name?
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
    var keeper = 0;

    for (var i =0; i < data.rowCount; i ++){

            var li = document.createElement('li');
            var d = new Date(data.rows[i].time*1000);

            var c;

            if (data.rows[i].condition == 1){
                c = "Poor";
            }

            else if  (data.rows[i].condition == 2){
                c = "OK";
            }

            else{
                c = "Good";
            }

            var h;

            if (data.rows[i].highlighter == 0){
                h = "No";
            }

            else {
                h = "Yes";
            }

            var w;

            if (data.rows[i].writing == 0){
                w = "No";
            }

            else{
                w = "Yes";
            }
//  alt="" width = "80" height="100"

            var newitem = '<div class="list_thumbnail">' +
                '<div class="bookPic">' +
              '<img src="../'+ data.rows[i].image + '" alt=""  class="list_image">' + '</div>' + '<div class=\"info1\">' +

              '<h3 class="title">'+ data.rows[i].title + '<small> by ' + data.rows[i].author + '</small>' +'</h3>' +
              '<p>Class: <strong>' + data.rows[i].class + '</strong> &emsp; Seller: <strong>' + data.rows[i].seller_nickname +'</strong> &emsp;'+ '</div>' +
              
              '<div class= "buy_btn">'+
                '<p>'+ 'Posted at:'+ '<small> '+ d.toLocaleTimeString()+', '+ d.toLocaleDateString()+'</small>' +'<br><br>'+
                '<button class="btn btn-large btn-primary pull-right" type="button">Buy for $'+ data.rows[i].price +'.00</button>'+
                '</p>'+
              '</div>' +

              '<div class = "conditionList">' +
              '<p>Condition: <strong>' + c + 
              '<br></strong>Highlighter Used: <strong>' + h +
              '<br></strong>Written In: <strong>' + w +'</strong> &emsp;'+
              '<br><span data-toggle="collapse" data-target="#b'+ keeper +'">'+
              'More info <i class="icon-info-sign"></i>'+
              '</span></p>'+
              '</div>' +
              
              '<div id="b'+keeper+'" class="collapse" style="padding-left:10px;">'+ data.rows[i].description +'</div>'+
            '</div>' ;

            li.innerHTML = newitem;

            ul.appendChild(li);
            $('.list_image').popover({

                html: 'true',
                placement: 'right',
                template: '<div class="popover"><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>',
                content : '<div id="popOverBox"><img src="'+data.rows[i].image+'"  /></div>'
                //content : '<img  width="100px" height = "100px" src="'+data.rows[i].image+'"/>'

            });






            keeper +=1;

        }    
    }   

function refreshSell (data) {
    console.log("in refreshSell");
    console.log(data)
    var ul = document.getElementById('list_thumbnails_sell');
    ul.innerHTML = " ";
    var keeper2 = 0;
    var endOfUnsold = 0;

    var heading = document.createElement('li');
    var headingText = '<div class="division">Books you are selling</div>';
    heading.innerHTML = headingText;
    ul.appendChild(heading);

    for (var i =0; i < data.rowCount; i ++){

        var li = document.createElement('li');
            var d = new Date(data.rows[i].time*1000);

            var c;

            if (data.rows[i].condition == 1){
                c = "Poor";
            }

            else if  (data.rows[i].condition == 2){
                c = "OK";
            }

            else{
                c = "Good";
            }

            var h;

            if (data.rows[i].highlighter == 0){
                h = "No";
            }

            else {
                h = "Yes";
            }

            var w;

            if (data.rows[i].writing == 0){
                w = "No";
            }

            else{
                w = "Yes";
            }

            var newitem = '<div class="list_thumbnail">' +

                '<div class=\"bookPic\">' +
              '<img src="../'+ data.rows[i].image + '" alt="" class="list_image" >' + '</div>' + '<div class="info1">' +

              '<h3 class="title">'+ data.rows[i].title + '<small> by ' + data.rows[i].author + '</small>' +'</h3>' +
              '<p>Class: <strong>' + data.rows[i].class + '</strong> &emsp; Seller: <strong>' + data.rows[i].seller_nickname +'</strong> &emsp;'+ '</div>';

              if (data.rows[i].sold == 1){
                if (endOfUnsold == 0){
                    var li2 = document.createElement('li');
                    var division = '<div class="division">Books you have sold</div>';
                    li2.innerHTML = division;
                    ul.appendChild(li2);
                    endOfUnsold = 1;
                }

                 newitem += '<div class= "buy_btn">'+
                '<p id ='+data.rows[i].id +' >'+ 'Posted at:'+ '<small> '+ d.toLocaleTimeString()+', '+ d.toLocaleDateString()+'</small>' +'<br><br>'+
                '<button class="btn btn-large btn-danger pull-right deleteBtn" onClick="deletePost($(this).parent().attr(\'id\'))" type="button">Delete</button>'+
                    '</p>'+
                      '</div>'; 
              }
              
               else if (data.rows[i].sold == 0){
                newitem += '<div class= "buy_btn">'+
                '<p id ='+data.rows[i].id +' class = "right_text">'+ '&emsp;Posted at:'+ '<small> '+ d.toLocaleTimeString()+', '+ d.toLocaleDateString()+'</small>' +'<br><br>'+
                '<button class="btn btn-large btn-success markAsSold"  type="button" onClick="markSold($(this).parent().attr(\'id\'))">Mark as Sold</button>'+
                '<button class="btn btn-large btn-danger pull-right left_buffer deleteBtn" onClick="deletePost($(this).parent().attr(\'id\'))"  type="button">Delete</button>'+
                
                    '</p>'+
                      '</div>'; 
            }

              newitem += '<div class = \"conditionListSell\">' +
              '<p>Condition: <strong>' + c + 
              '<br></strong>Highlighter Used: <strong>' + h +
              '<br></strong>Written In: <strong>' + w +'</strong> &emsp;'+
              '<br><span data-toggle="collapse" data-target="#'+ keeper2 +'">'+
              'More info <i class="icon-info-sign"></i>'+
              '</span></p>'+
              '</div>' +
              
              '<div id="'+keeper2+'" class="collapse" style="padding-left:`0px;">'+ data.rows[i].description +'</div>'+
            '</div>' ;


              keeper2 +=1;

            li.innerHTML = newitem;

            ul.appendChild(li);

            $('.list_image').popover({

                html: 'true',
                placement: 'right',
                template: '<div class="popover"><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>',
                content : '<div id="popOverBox"><img src="'+data.rows[i].image+'"  /></div>'
                //content : '<img  width="100px" height = "100px" src="'+data.rows[i].image+'"/>'

            });

        }    
    } 


    function autofill(){
    var input = $('#isbnSearch').val();

    
    var request = new XMLHttpRequest();

        request.open('GET', '/isbn/'+input, true);

        request.addEventListener('load', function(e){
            if (request.status == 200) {
                console.log("got that content");
                var content = request.responseText;
                var data = JSON.parse(content);
                console.log(data);
                if (data.ISBNdb.BookList[0].BookData == undefined)
                    alert("invalid isbn");
                else
                {
                    var author = data.ISBNdb.BookList[0].BookData[0].AuthorsText[0];
                    var title = data.ISBNdb.BookList[0].BookData[0].Title[0];
                    var longtitle = data.ISBNdb.BookList[0].BookData[0].TitleLong[0];

                    if(typeof(longtitle) == "string")
                        $('#title_input').val(longtitle);
                    else
                        $('#title_input').val(title);
                    $('#author_input').val(author);
                }
            } else {
                console.log("YOU SHOULD NOT BE HERE");
            }
        }, false);

        request.send(null);

    }



