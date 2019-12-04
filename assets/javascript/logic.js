$(document).ready(function () {

    // Get on-click radio button value stored into variable searchWithin. Do we want to use this to guide which API to run a search from?
    var searchWithin;
    var searchTerm;
    var searchTermSmall;

    $("#searchButton").on("click", function (event) {
        event.preventDefault();
        $('.current-articles').empty();
        searchWithin = $("input[type='radio']:checked").val();
        searchTerm = $("#searchTermSmall").val().trim();
        console.log(searchWithin + " is checked!");
        console.log("our current search term is: " + searchTerm);
        console.log("our current search term is: " + searchTermSmall);
        $(".searchTerm").val(""); // Clears text input box

        if (searchWithin == 'currentNews') {
            newsAPI(searchTerm);
        }

        if (searchWithin == 'historicalEvents') {
            currentsAPI(searchTerm);
        }

        if (searchWithin == "wikipediaInfo") {
            searchWiki(searchTerm);
        }



        // code to empty the youtube video divs and recreate the player divs 
        $('.video-pulls .image').each(function (index) {
            $(this).empty();
            $(this).append('<div id="player' + (index++) + '" class="has-ratio"></div>');
        });
        searchVideos(searchTerm);

    });


    /* 
        Code to query the CurrentsAPI 
    */
    function currentsAPI(search) {
        var apikey = '&apiKey=DZDcAWMI7tHZgDL-0HsY9xdV2PP2WERqSJ4RodnZ84DGyEwJ';
        var startDate; //Will have to have YYYY-MM-dd format 
        var endDate; // Will have to have YYYY-MM-dd format 
        var type; //Will be an integer: 1 for news, 2 for articles, 3 for discussion content, Default 1

        var lang = '&language=en'
        var keywords = search;
        var queryURL = 'https://api.currentsapi.services/v1/search?keywords=' + keywords + lang + apikey;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            for (var i = 0; i < 10; i++) {
                var author;
                console.log(response.news[i].author)
                if (response.news[i].author == null) {
                    author = 'Associated Press';
                }
                else {
                    author = response.news[i].author;
                }

                $('.current-articles').append('<article class="message is-info">' +
                    '<div class="columns">' +
                    '<div class="column is-1">' + '<img src="' + response.news[i].image/*image url goes here */ + '" />' + '</div>' +
                    '<div class="column is-11">' + '<p class="title">' + response.news[i].title + '</p>' + '<p class="subtitle"> Written By: ' + author + '</p>' +
                    '</div>' +
                    '</div>' +
                    '<div class="message-body">' + response.news[i].description + '</div>' + '<br />' +
                    '<a href="' + response.news[i].url + '" target=_blank>' + 'Open Article in New Tab' + '</a>' +
                    '<hr />' +
                    '</article>')

            }

            //We also want to make the response.news.published into a moment so that we can format it and display it
            // if (response.news.image !== 'none') {
            //     $('.article-img').append('<img src="' + response.news[3].image + '">');
            //     $('.article-info').append('<h1 class="article-title">' + response.news[3].title + '</h1>' + '<h3 class=article-by> By ' + response.news[3].author + '</h3>')
            //     $('.article-snippet').append('<p>' + response.news[3].description + '</p>')
            //     $('.article-link').append('<a href="' + response.news[3].url + '" target=_blank>' + 'Open Article in New Tab' + '</a>')
            // }
        });
    }




    /*  
    Code to query the NewsAPI
    */
    function newsAPI(search) {
        // http://lorempixel.com/g/400/200/
        var apiNews = '&apiKey=c2704563e1294b96ae07dbe18fda2af6';
        var keyword = search;
        var queryNews = 'https://newsapi.org/v2/everything?q=' + keyword + apiNews
        $.ajax({
            url: queryNews,
            method: "GET"
        }).then(function (response) {

            console.log(response)

            for (var i = 0; i < 10; i++) {
                var author;
                console.log(response.articles[i].author)
                if (response.articles[i].author == null) {
                    author = 'Associated Press';
                }
                else {
                    author = response.articles[i].author;
                }

                $('.current-articles').append('<article class="message is-info">' +
                    '<div class="columns">' +
                    '<div class="column is-1">' + '<img src="' + response.articles[i].urlToImage/*image url goes here */ + '" />' + '</div>' +
                    '<div class="column is-11">' + '<p class="title">' + response.articles[i].title + '</p>' + '<p class="subtitle"> Written By: ' + author + '</p>' +
                    '</div>' +
                    '</div>' +
                    '<div class="message-body">' + response.articles[i].description + '</div>' + '<br />' +
                    '<a href="' + response.articles[i].url + '" target=_blank>' + 'Open Article in New Tab' + '</a>' +
                    '<hr />' +
                    '</article>')
                // $('.article-img').append('<img src="' + response.articles[3].urlToImage + '">');
                // $('.article-info').append('<h1 class="article-title">' + response.articles[3].title + '</h1>' + '<h3 class=article-by> By ' + response.articles[3].author + '</h3>')
                // $('.article-snippet').append('<p>' + response.articles[3].description + '</p>')
                // $('.article-link').append('<a href="' + response.articles[3].url + '" target=_blank>' + 'Open Article in New Tab' + '</a>')
            }

        })
    }

    //     <article class="message is-info">
    //     <div class="columns">
    //         <div class="column is-1">
    //             <img src="https://picsum.photos/id/970/128/128" />
    //         </div>
    //         <div class="column is-11">
    //             <h1 class="title">Article Title</h1>
    //             <h2 class="subtitle">by Some Author</h2>
    //         </div>
    //     </div>
    //     <div class="message-body">
    //         I am a snippet of information from an article. Lorem ipsum dolor sit amet, consectetur
    //         adipiscing elit, sed do eiusmod tempor incididunt ut
    //         labore
    //         et
    //         dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
    //         ut
    //         aliquip
    //         ex ea commodo consequat.
    //     </div>
    //     <br />
    //     <a href="#">Link to Article.</a>
    // </article> 




    /* Start - To show Nasa Image of the day   */

    var today = moment().format('YYYY-MM-DD');
    var queryNASA = 'https://api.nasa.gov/planetary/apod?api_key=Ta10d3nY7WbfA7PR7VNlwYveTL1kVzMDe4LUm5V1&hd=TRUE$date=' + today
    // code to query the Nasa image of the day
    // Needs to be called and added to modal before modal is called so it doesn't have to load
    $.ajax({
        url: queryNASA,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        $('.nasa-img').html('<img src="' + response.hdurl + '">');
        $('.nasa-desc').html(response.explanation);

    });

    $('.nasa-btn').on('click', function () {
        $('#modal-id').addClass('is-active');
        $('#modal-id').addClass('is-clipped');
        $('.nasa-modal').attr('class', 'is-active');
        $('.nasa-modal').attr('class', 'is-clipped');
    });

    $(document).on('click', '.modal-close', function () {
        $('#modal-id').removeClass('is-active');
    });

    /* End - To show Nasa Image of the day   */

    /* Start - To show the fact of the day */
    $('.fact-btn').on('click', function () {
        var todayInSlashes = moment().format('MM/DD')
        var todayInMoreSlashes = moment().format('MM/DD/YYYY')
        var queryNumber = 'http://numbersapi.com/' + todayInSlashes + '/date'
        $('.fact-title').html('Today is ' + todayInMoreSlashes);
        $.ajax({
            url: queryNumber,
            method: "GET"
        }).then(function (response) {
            $('.fact-modal').addClass('is-active')
            $('.fact-modal').addClass('is-clipped')
            $('.rando-fact').html(response);
        })

    })

    $(document).on('click', '.delete', function () {
        $('.fact-modal').removeClass('is-active')

    })
    $(document).on('click', '.close-button', function () {
        $('.fact-modal').removeClass('is-active')

    })
    /* End - To show the fact of the day */

});


/************************************ User defined functions  /************************************/
function generateURL(url, params) {
    if (params) url += $.param(params);
    //console.log(url);
    return url;
}

function searchWiki(searchTerm) {
    var params = {
        action: "query",
        list: "search",
        srsearch: searchTerm,
        format: "json"
    };

    var queryURL = generateURL("https://en.wikipedia.org/w/api.php?origin=*&", params);

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        var results = response.query.search;
        $('.current-articles').empty();
        $.each(results, function (index, value) {
            var wikiArticle = $("<article class='message is-info'>");
            $('.current-articles').append(wikiArticle);
            var colDiv = $("<div class='columns'>");
            colDiv.append("<div class='column is-12'><h1 class='title'>" + results[index].title + "</h1></div>");
            var msgDiv = $("<div class='message-body'>" + results[index].snippet + "</div>");
            $(wikiArticle).append(colDiv, msgDiv);
            $(wikiArticle).append("<br />");
            $(wikiArticle).append("<a href='https://en.wikipedia.org/wiki/" + results[index].title + "' target='_blank'>" + results[index].title + "</a>");
            $('.current-articles').append("<hr />");
        });
    });
}

function searchVideos(searchTerm) {
    var playerInfoList = [];
    $.ajax({
        method: 'GET',
        url: 'https://www.googleapis.com/youtube/v3/search?',
        data: {
            q: searchTerm,
            part: 'snippet',
            key: 'AIzaSyDvZJroibDl30fxnmsNsCZO1o-9N-Em5zs',
            maxResults: 6
        },
        dataType: 'jsonp'
    }).then(function (response) {
        var results = response.items;
        $.each(results, function (index, value) {
            var videoObj = {
                id: 'player',
                height: '390',
                width: '640',
                videoId: results[index].id.videoId
            }
            playerInfoList.push(videoObj);
        });

        $(".is-16by9").toggle();

        onYouTubePlayerAPIReady();

        function onYouTubePlayerAPIReady() {
            for (var i = 0; i < playerInfoList.length; i++) {
                //console.log(playerInfoList[i].videoId);
                player = new YT.Player('player' + [i], {
                    height: '360',
                    width: '640',
                    videoId: playerInfoList[i].videoId
                });
            }
        }
    });

    // This code loads the IFrame Player API code asynchronously.
    var tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

}
/************************************ User defined functions  /************************************/

// Get the modal
// Get the modal
var modal = document.getElementById('id01');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

