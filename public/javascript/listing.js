
var socket;


// $.fn.typeahead.Constructor.prototype.render = function (items) {

//     var that = this;

//     items = $(items).map(function (i, item) {
//       i = $(that.options.item).attr('data-value', item);
//       i.find('a').html(that.highlighter(item));
//       return i[0];
//     });

//     this.$menu.html(items);
//     return this;
// };

(function(a,b){"use strict";var c=a.document,d;var e=function(a,e,f){var g=this,i,j,k,l,m,n,o={updated:[]};this.listContainer=typeof a=="string"?c.getElementById(a):a;if(!this.listContainer)return;this.items=[];this.visibleItems=[];this.matchingItems=[];this.searched=false;this.filtered=false;this.list=null;this.templateEngines={};this.page=e.page||200;this.i=e.i||1;j={start:function(a,b){b.plugins=b.plugins||{};this.classes(b);i=new m(g,b);this.callbacks(b);this.items.start(a,b);g.update();this.plugins(b.plugins)},classes:function(a){a.listClass=a.listClass||"list";a.searchClass=a.searchClass||"search";a.sortClass=a.sortClass||"sort"},callbacks:function(a){g.list=d.getByClass(a.listClass,g.listContainer,true);d.addEvent(d.getByClass(a.searchClass,g.listContainer),"keyup",g.search);n=d.getByClass(a.sortClass,g.listContainer);d.addEvent(n,"click",g.sort)},items:{start:function(a,c){if(c.valueNames){var d=this.get(),e=c.valueNames;if(c.indexAsync){this.indexAsync(d,e)}else{this.index(d,e)}}if(a!==b){g.add(a)}},get:function(){var a=g.list.childNodes,c=[];for(var d=0,e=a.length;d<e;d++){if(a[d].data===b){c.push(a[d])}}return c},index:function(a,b){for(var c=0,d=a.length;c<d;c++){g.items.push(new l(b,a[c]))}},indexAsync:function(a,b){var c=a.splice(0,100);this.index(c,b);if(a.length>0){setTimeout(function(){j.items.indexAsync(a,b)},10)}else{g.update()}}},plugins:function(a){var b={templater:i,init:j,initialItems:k,Item:l,Templater:m,sortButtons:n,events:o,reset:r};for(var c=0;c<a.length;c++){a[c][1]=a[c][1]||{};var d=a[c][1].name||a[c][0];g[d]=g.plugins[a[c][0]].call(g,b,a[c][1])}}};this.add=function(a,c){if(c){p(a,c)}var d=[],e=false;if(a[0]===b){a=[a]}for(var f=0,h=a.length;f<h;f++){var i=null;if(a[f]instanceof l){i=a[f];i.reload()}else{e=g.items.length>g.page?true:false;i=new l(a[f],b,e)}g.items.push(i);d.push(i)}g.update();return d};var p=function(a,b,c){var d=a.splice(0,100);c=c||[];c=c.concat(g.add(d));if(a.length>0){setTimeout(function(){p(a,b,c)},10)}else{g.update();b(c)}};this.show=function(a,b){this.i=a;this.page=b;g.update()};this.remove=function(a,b,c){var d=0;for(var e=0,f=g.items.length;e<f;e++){if(g.items[e].values()[a]==b){i.remove(g.items[e],c);g.items.splice(e,1);f--;d++}}g.update();return d};this.get=function(a,b){var c=[];for(var d=0,e=g.items.length;d<e;d++){var f=g.items[d];if(f.values()[a]==b){c.push(f)}}if(c.length==0){return null}else if(c.length==1){return c[0]}else{return c}};this.sort=function(a,c){var e=g.items.length,f=null,i=a.target||a.srcElement,j="",k=false,l="asc",m="desc",c=c||{};if(i===b){f=a;k=c.asc||false}else{f=d.getAttribute(i,"data-sort");k=d.hasClass(i,l)?false:true}for(var o=0,p=n.length;o<p;o++){d.removeClass(n[o],l);d.removeClass(n[o],m)}if(k){if(i!==b){d.addClass(i,l)}k=true}else{if(i!==b){d.addClass(i,m)}k=false}if(c.sortFunction){c.sortFunction=c.sortFunction}else{c.sortFunction=function(a,b){return d.sorter.alphanum(a.values()[f].toLowerCase(),b.values()[f].toLowerCase(),k)}}g.items.sort(c.sortFunction);g.update()};this.search=function(a,c){g.i=1;var d=[],e,f,h,j,k,c=c===b?g.items[0].values():c,a=a===b?"":a,l=a.target||a.srcElement;a=l===b?(""+a).toLowerCase():""+l.value.toLowerCase();k=g.items;a=a.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&");i.clear();if(a===""){r.search();g.searched=false;g.update()}else{g.searched=true;for(var m=0,n=k.length;m<n;m++){e=false;f=k[m];j=f.values();for(var o in c){if(j.hasOwnProperty(o)&&c[o]!==null){h=j[o]!=null?j[o].toString().toLowerCase():"";if(a!==""&&h.search(a)>-1){e=true}}}if(e){f.found=true;d.push(f)}else{f.found=false}}g.update()}return g.visibleItems};this.filter=function(a){g.i=1;r.filter();if(a===b){g.filtered=false}else{g.filtered=true;var c=g.items;for(var d=0,e=c.length;d<e;d++){var f=c[d];if(a(f)){f.filtered=true}else{f.filtered=false}}}g.update();return g.visibleItems};this.size=function(){return g.items.length};this.clear=function(){i.clear();g.items=[]};this.on=function(a,b){o[a].push(b)};var q=function(a){var b=o[a].length;while(b--){o[a][b]()}};var r={filter:function(){var a=g.items,b=a.length;while(b--){a[b].filtered=false}},search:function(){var a=g.items,b=a.length;while(b--){a[b].found=false}}};this.update=function(){var a=g.items,b=a.length;g.visibleItems=[];g.matchingItems=[];i.clear();for(var c=0;c<b;c++){if(a[c].matching()&&g.matchingItems.length+1>=g.i&&g.visibleItems.length<g.page){a[c].show();g.visibleItems.push(a[c]);g.matchingItems.push(a[c])}else if(a[c].matching()){g.matchingItems.push(a[c]);a[c].hide()}else{a[c].hide()}}q("updated")};l=function(a,c,d){var e=this,f={};this.found=false;this.filtered=false;var h=function(a,c,d){if(c===b){if(d){e.values(a,d)}else{e.values(a)}}else{e.elm=c;var f=i.get(e,a);e.values(f)}};this.values=function(a,c){if(a!==b){for(var d in a){f[d]=a[d]}if(c!==true){i.set(e,e.values())}}else{return f}};this.show=function(){i.show(e)};this.hide=function(){i.hide(e)};this.matching=function(){return g.filtered&&g.searched&&e.found&&e.filtered||g.filtered&&!g.searched&&e.filtered||!g.filtered&&g.searched&&e.found||!g.filtered&&!g.searched};this.visible=function(){return e.elm.parentNode?true:false};h(a,c,d)};m=function(a,c){if(c.engine===b){c.engine="standard"}else{c.engine=c.engine.toLowerCase()}return new g.constructor.prototype.templateEngines[c.engine](a,c)};j.start(f,e)};e.prototype.templateEngines={};e.prototype.plugins={};e.prototype.templateEngines.standard=function(a,e){function j(a){if(a===b){var d=f.childNodes,g=[];for(var h=0,i=d.length;h<i;h++){if(d[h].data===b){return d[h]}}return null}else if(a.indexOf("<")!==-1){var j=c.createElement("div");j.innerHTML=a;return j.firstChild}else{return c.getElementById(e.item)}}var f=d.getByClass(e.listClass,a.listContainer,true),g=j(e.item),i=this;var k={created:function(a){if(a.elm===b){i.create(a)}}};this.get=function(a,b){k.created(a);var c={};for(var e=0,f=b.length;e<f;e++){var g=d.getByClass(b[e],a.elm,true);c[b[e]]=g?g.innerHTML:""}return c};this.set=function(a,b){k.created(a);for(var c in b){if(b.hasOwnProperty(c)){var e=d.getByClass(c,a.elm,true);if(e){e.innerHTML=b[c]}}}};this.create=function(a){if(a.elm!==b){return}var c=g.cloneNode(true);c.id="";a.elm=c;i.set(a,a.values())};this.remove=function(a){f.removeChild(a.elm)};this.show=function(a){k.created(a);f.appendChild(a.elm)};this.hide=function(a){if(a.elm!==b&&a.elm.parentNode===f){f.removeChild(a.elm)}};this.clear=function(){if(f.hasChildNodes()){while(f.childNodes.length>=1){f.removeChild(f.firstChild)}}}};d={getByClass:function(){if(c.getElementsByClassName){return function(a,b,c){if(c){return b.getElementsByClassName(a)[0]}else{return b.getElementsByClassName(a)}}}else{return function(a,b,d){var e=[],f="*";if(b==null){b=c}var g=b.getElementsByTagName(f);var h=g.length;var i=new RegExp("(^|\\s)"+a+"(\\s|$)");for(var j=0,k=0;j<h;j++){if(i.test(g[j].className)){if(d){return g[j]}else{e[k]=g[j];k++}}}return e}}}(),addEvent:function(a,c){if(c.addEventListener){return function(c,e,f){if(c&&!(c instanceof Array)&&!c.length&&!d.isNodeList(c)&&c.length!==0||c===a){c.addEventListener(e,f,false)}else if(c&&c[0]!==b){var g=c.length;for(var i=0;i<g;i++){d.addEvent(c[i],e,f)}}}}else if(c.attachEvent){return function(c,e,f){if(c&&!(c instanceof Array)&&!c.length&&!d.isNodeList(c)&&c.length!==0||c===a){c.attachEvent("on"+e,function(){return f.call(c,a.event)})}else if(c&&c[0]!==b){var g=c.length;for(var i=0;i<g;i++){d.addEvent(c[i],e,f)}}}}}(this,c),getAttribute:function(a,c){var d=a.getAttribute&&a.getAttribute(c)||null;if(!d){var e=a.attributes;var f=e.length;for(var g=0;g<f;g++){if(c[g]!==b){if(c[g].nodeName===c){d=c[g].nodeValue}}}}return d},isNodeList:function(a){var b=Object.prototype.toString.call(a);if(typeof a==="object"&&/^\[object (HTMLCollection|NodeList|Object)\]$/.test(b)&&(a.length==0||typeof a[0]==="object"&&a[0].nodeType>0)){return true}return false},hasClass:function(a,b){var c=this.getAttribute(a,"class")||this.getAttribute(a,"className")||"";return c.search(b)>-1},addClass:function(a,b){if(!this.hasClass(a,b)){var c=this.getAttribute(a,"class")||this.getAttribute(a,"className")||"";c=c+" "+b+" ";c=c.replace(/\s{2,}/g," ");a.setAttribute("class",c)}},removeClass:function(a,b){if(this.hasClass(a,b)){var c=this.getAttribute(a,"class")||this.getAttribute(a,"className")||"";c=c.replace(b,"");a.setAttribute("class",c)}},sorter:{alphanum:function(a,c,d){if(a===b||a===null){a=""}if(c===b||c===null){c=""}a=a.toString().replace(/&(lt|gt);/g,function(a,b){return b=="lt"?"<":">"});a=a.replace(/<\/?[^>]+(>|$)/g,"");c=c.toString().replace(/&(lt|gt);/g,function(a,b){return b=="lt"?"<":">"});c=c.replace(/<\/?[^>]+(>|$)/g,"");var e=this.chunkify(a);var f=this.chunkify(c);for(var g=0;e[g]&&f[g];g++){if(e[g]!==f[g]){var h=Number(e[g]),i=Number(f[g]);if(d){if(h==e[g]&&i==f[g]){return h-i}else{return e[g]>f[g]?1:-1}}else{if(h==e[g]&&i==f[g]){return i-h}else{return e[g]>f[g]?-1:1}}}}return e.length-f.length},chunkify:function(a){var b=[],c=0,d=-1,e=0,f,g;while(f=(g=a.charAt(c++)).charCodeAt(0)){var h=f==45||f==46||f>=48&&f<=57;if(h!==e){b[++d]="";e=h}b[d]+=g}return b}}};a.List=e;a.ListJsHelpers=d})(window)


//Requests and displays a list of books dependent on a search term
  
var options = {
    valueNames: [ 'time', 'condition', 'price', 'highlighter', 'writing' ]
};

var hackerList = new List('hacker-list', options);


 window.addEventListener('load', function(){
    getText('/search/recent.json');

    document.getElementById("newBookForm").addEventListener('submit', addBook, false);


    $('#condition_slider').slider({

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

    //console.log(username);

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
        content : 'Please upload an image. How else will we know how pretty your book is?'

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
function loadThreads(data){

    var ul = document.getElementById('threadList');
    ul.innerHTML = " ";

    var topThreadID = data.rows[0].id;

    requestMessages(topThreadID);

    var li = document.createElement('li');

    var newitem = '<li class="active"><a href="#" onClick= "';
    
    if (data.rows[0].seen == "false"){ newitem += 'requestMessages(';} 
    else{ newitem += 'requestMessages(';}
    
    newitem += topThreadID + ')" '+
    'data-toggle="tab"><strong>'+ bookname + '</strong><br>'+ sender +' <input type="hidden" name="read" value="';

    if (data.rows[0].seen == "false"){ newitem += 'no';} 
    else{ newitem += 'yes';}

    newitem += '"> </a></li>';

    li.innerHTML = newitem;

    ul.appendChild(li);

    for (var i =1; i < data.rowCount; i ++){

            var li = document.createElement('li');

            newitem = '<a href="#" id="thread'+data.rows[i].id+'" onClick= "requestMessages('+ data.rows[i].id+')" data-toggle="tab"><strong>'+data.rows[i].title + '</strong>'+
            '<br>'+ sender +' <input type="hidden" name="read" value="';

            if (data.rows[i].seen == "false"){ newitem += 'no';} 
            else{ newitem += 'yes';}

            newitem += '"> </a></li>';

            li.innerHTML = newitem;

            ul.appendChild(li);

            if (data.rows[i].seen == "false"){
                document.getElementById('thread'+data.rows[i].id).style.color="blue";
                newNotification();
            }
        }  

}


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
    //console.log("attempting to add book");

    req.addEventListener('load', function(e){
        //console.log("in here");
        var content1 = req.responseText;
        var data1= JSON.parse(content1);
        refreshSell(data1);
        getText('/search/recent.json');
        document.getElementById("newBookForm").reset();

    }, false);
    req.send(fd);
    hackerList = new List('hacker-list', options);
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
        document.getElementById('alert-text').innerHTML=("You must log in to sell books.");
        $('#blank-alert').modal("show");
    }
    else{
    document.getElementById("buy").style.display = 'none';
    document.getElementById("sell").style.display = 'block';
    var Sellli = document.getElementById("sellTab");
    var Buyli = document.getElementById("buyTab");
    Sellli.className = "active";
    Buyli.className = "";
    //console.log("where i should be");
    var request = new XMLHttpRequest();

        request.open('GET', '/book_posts.json', true);

        request.addEventListener('load', function(e){
            if (request.status == 200) {
                //console.log("got that content");
                var content2 = request.responseText;
                var data2 = JSON.parse(content2);
                refreshSell(data2);
            } else {
                //console.log("YOU SHOULD NOT BE HERE");
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

var searchType = "/search/";

function setSearchType(type)
{
    document.getElementById("search_type_span").innerHTML = type;
    if(type == "All")
        searchType = "/search/";
    else if(type == "Class")
        searchType = "/searchclass/";
    else if(type == "Title")
        searchType = "/searchtitle/";
    else if(type == "Author")
        searchType = "/searchauthor/";
}

function search(text){
    var highlighter = $('#highlighter_filter').hasClass('active') ? 1 : 0;
    var writing = $('#writing_filter').hasClass('active') ? 1 : 0;
    if(searchType == "/search/")
    {
        getText(searchType + document.getElementById("search").value + conditionButton + priceButton + highlighter + writing + '/books.json');
    }
    else
    {
        getText(searchType + document.getElementById("search").value + '/books.json');
    }

    hackerList = new List('hacker-list', options);
}

 function getText(url){
    //console.log("in get text");

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
                refreshBuy(data);

                hackerList = new List('hacker-list', options);
                console.log(data);
            } else {
                //console.log("YOU SHOULD NOT BE HERE");
                // something went wrong, check the request status
                // hint: 403 means Forbidden, maybe you forgot your     name?
            }
        }, false);
        
        // start the request, optionally with a request body for POST requests
        request.send(null);
}


function refreshBuy (data) {
    //console.log("in refreshBuy");
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

            var newitem = '<div class="list_thumbnail"><div id="thumbnail_top">' +
                '<div class="bookPic">' +
              '<img src="../'+ data.rows[i].image + '" alt=""  class="list_image">' + '</div>' + '<div class=\"info1\">' +

              '<h3 class="title">'+ data.rows[i].title + '<small> by ' + data.rows[i].author + '</small>' +'</h3>' +
              '<p>Class: <strong>' + data.rows[i].class + '</strong> &emsp; Seller: <strong>' + data.rows[i].seller_nickname +'</strong> &emsp;'+ '</div>' +
              
              '<div class= "buy_btn">'+
                '<p class="time">'+ 'Posted at:'+ '<small> '+ d.toLocaleTimeString()+', '+ d.toLocaleDateString()+'</small>' +'<br><br>'+
                '<form id="hiddenInfo">'+
                '<input type="hidden" name="seller" value="'+data.rows[i].seller+'">'+
                '<input type="hidden" name="seller_nickname" value="'+data.rows[i].seller_nickname+'">'+
                '<input type="hidden" name="title" value="'+data.rows[i].title+'">'+
                '<input type="hidden" name="post_id" value="'+data.rows[i].id+'">'+
                '<button class="price btn btn-large btn-primary pull-right" type="button"onClick="buy_button(this.form);">Buy for $'+ data.rows[i].price +'.00</button>'+
                '</form>'+
                '</p>'+
              '</div>' +

              '<div class = "conditionList">' +
              '<p class="condition">Condition: <strong>' + c + 
              '<br></strong>Highlighter Used: <strong><span class="highlighter">' + h +
              '</span><br></strong>Written In: <strong><span class="writing">' + w +'</span></strong> &emsp;'+
              '<br><span data-toggle="collapse" data-target="#b'+ keeper +'">'+
              'More info <i class="icon-info-sign"></i>'+
              '</span></p>'+
              '</div></div>' +
              
              '<div id="b'+keeper+'" class="collapse" style="padding-left:10px; display: inline-block"><div class="alert" id="description-alert"><strong>Description: </strong>'+ data.rows[i].description +'</div></div>'+
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
    //console.log("in refreshSell");
    //console.log(data)
    var ul = document.getElementById('list_thumbnails_sell');
    ul.innerHTML = " ";
    var keeper2 = 0;
    var endOfUnsold = 0;

    

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

            var newitem = '<div class="list_thumbnail"><div id="thumbnail_top">' +

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
              '</div></div>' +
              
              '<div id="'+keeper2+'" class="collapse" style="padding-left:10px; display: inline-block"><div class="alert" id="description-alert"><strong>Description: </strong>'+ data.rows[i].description +'</div></div>'+
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
                //console.log("got that content");
                var content = request.responseText;
                var data = JSON.parse(content);
                //console.log(data);
                if (data.ISBNdb.BookList[0].BookData == undefined)
                {
                    document.getElementById('alert-text').innerHTML=("Invalid ISBN.");
                    $('#blank-alert').modal("show");
                }
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
                //console.log("YOU SHOULD NOT BE HERE");
            }
        }, false);

        request.send(null);
    }

    var toggle1 = 0;
    var toggle2 = 0;

    function addFilters(input)
    {

        // if ($('#highlighter_filter').is(":checked") && $('#writing_filter').is(":checked"))
        // {
        //     hackerList.filter();
        //     hackerList.filter(function(item) {
        //        if (item.values().highlighter == "Yes" && item.values().writing == "Yes") {
        //            return true;
        //        } else {
        //            return false;
        //        }
        //     });
        // }
        //else if($('#highlighter_filter').is(":checked"))
            if (input=="hl")
        {
            if(toggle1 == 0){
                hackerList.filter();
                hackerList.filter(function(item) {
               if (item.values().highlighter == "No") {
                    toggle1=1;
                   return true;
               } else {
                    toggle1=1;
                   return false;
               }
            });
            }
            else{
                toggle1=0;
                hackerList.filter();
            }
            
        }
        //else if($('#writing_filter').is(":checked"))
            else if (input=="wr")
        {
            if (toggle2 == 0){
                hackerList.filter();
            hackerList.filter(function(item) {
               if (item.values().writing == "No") {
                   return true;
               } else {
                   return false;
               }
            });
            }

            else{
                toggle2=0;
                hackerList.filter();
            }
            
        }
        else
        {
            hackerList.filter();
        }
    }

var priceButton = 0;
var conditionButton = 0;
var timeButton = 0;

    function priceSortButton()
    {
        if(priceButton == 0)
        {
            priceButton = 1;
            conditionButton = 0;
            timeButton = 0;
        }
    }
    function conditionSortButton()
    {
        if(conditionButton == 0)
        {
            conditionButton = 1;
            priceButton = 0;
            timeButton = 0;
        }
    }
    function timeSortButton()
    {
        if(timeButton == 0)
        {
            timeButton = 1;
            conditionButton = 0;
            priceButton = 0;
        }
    }
