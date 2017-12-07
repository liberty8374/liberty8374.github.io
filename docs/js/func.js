/**
 * Created by Андрей on 31.10.2015.
 */

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

function saveProgress(event, currId, prevId) {
    if (currId!=0) {
        var startHref = $("#story-start-link").attr('href') || undefined;
        console.log(startHref);
        event.preventDefault();
        $.ajax({
            type    : 'POST',
            url     : '/episode/save-progress.html',
            data    : { 'currId' : currId, 'prevId' : prevId },
            success : function (data) {
                //console.log(event.target.parentElement.parentElement);
                if (startHref) {
                    window.location = startHref;
                    return true;
                } else if (event.target.attributes.href == undefined || event.target.attributes.href.nodeValue == undefined) {
                    if (event.target.parentElement.attributes.href == undefined) {
                        var href = event.target.parentElement.parentElement.attributes.href.nodeValue;
                    } else {
                        var href = event.target.parentElement.attributes.href.nodeValue;
                    }
                } else {
                    var href = event.target.attributes.href.nodeValue;
                }

                window.location = href;
                //console.log(event.srcElement.attributes.href.nodeValue);
            }
        });
    }
}

function likeStory(storyId) {
    var likePic = $('#plus-karma'),
        ratingLabel = $('#rating-label');

    $.get('/api/stories/like?authKey=0&storyId='+storyId, function(data) {
        ratingLabel.html(data.count);
        if(data.action) {
            $(likePic).attr('src', '/img/plus-small-bl.png');
        }
    });
}

function repostStory(event, storyId) {
    event.preventDefault();
    $.ajax({
        type    : 'POST',
        url     : '/story/repost.html',
        data    : { 'storyId' : storyId },
        success : function(data) {
            var repostLbl = $('*#repost-label-' + storyId);
            var repostPic = $('*#repost-img-' + storyId);
            var repostBtn = '/img/repost.png';
            var noRepostBtn = '/img/support_icon2_last_word.png';
            // if ($('.story-wrapper')[0]) {
            //     noRepostBtn = '/img/repost-small-bl.png';
            // } else if ($('.episode-wrapper')[0]) {
            //     noRepostBtn = '/img/repost-small-bl.png';
            // }
            if (repostPic.attr('src') == noRepostBtn) {
                repostPic.attr('src', repostBtn)
            } else {
                repostPic.attr('src', noRepostBtn)
            }
            repostLbl.html(data);
        }
    });
}

/*function checkNew() {
    $.ajax({
        type    : 'GET',
        url     : '/user/get-authkey.html',
        success : function(data) {
            url = '/api/news/check-new';
            params = { 'authKey' : data };
            $.ajax({
                type    : 'GET',
                url     : url,
                data    : params,
                success : function(data) {
                    alert(data);
                    //checkNew();
                }
            });
        }
    });
}*/

var loading = 0;
function loadTimelineStories(place, callback) {
    if(loading == 1) {
        return;
    }
    loading = 1;
    var isMobile = window.matchMedia("only screen and (max-width: 760px)");
    if (isMobile.matches) {
        var loaderSize = 30;
    } else {
        var loaderSize = 60
    }
    var animateProgress = function() {
        if (loading == 0) {
            return;
        }
        $('.progress-load').show()
            .circleProgress({
                value: 1.0,
                size: loaderSize,
                animation: {
                    duration: 1000,
                    easing: 'circleProgressEasing',
                    complete: function () {
                        animateProgress();
                    }
                },
                fill: {
                    gradient: ['#000', '#fff']
                }
            });
    };
    animateProgress();
    var count = 10;
    var showedStories = $('.story-wrapper');
    var offset = showedStories.length;
    var url = '';
    var params = {};
    switch(place) {
        case 'home':
            // /api/stories/home?authKey=&count=&offset=
            $.ajax({
                type    : 'GET',
                url     : '/user/get-authkey.html',
                success : function(data) {
                    url = '/api/stories/home';
                    params = { 'authKey' : data, 'count' : count, 'offset' : offset };
                    $.ajax({
                        type    : 'GET',
                        url     : url,
                        data    : params,
                        success : function(data) {
                            constructStory(data, place, callback);
                            //loading = 0;
                        }
                    });
                }
            });
            break;
        case 'search':
            // /api/stories/search?s=null&count=&offset=
            var searchString = getUrlParameter('s');
            var filter = {
                top: getUrlParameter('filter[top]'),
                period: getUrlParameter('filter[period]'),
                length: getUrlParameter('filter[length]'),
                illustrated: getUrlParameter('filter[illustrated]')
            };
            var sort = getUrlParameter('sort');
            var method = $('.sort.active.a-up')[0] != undefined ? 1 : null;
            var loaded = $('.story-wrapper').map( function(i, elm) {
                return parseInt($(elm).attr('data-story-id'));
            } );
            var recommendedTimeline = false;
            loaded = Array.prototype.join.call(loaded,',');

            if(/site\/recommended/.test($(location).attr('pathname')) ||
                $(location).attr('pathname') == '/') {
                url = '/api/stories/recommended';
                recommendedTimeline = true;
                params = {
                    'loaded':loaded,
                    'sort': getUrlParameter('sort')
                }
            } else if(/site\/popular/.test($(location).attr('pathname'))) {
                url = '/api/stories/popular';
                params = {
                    'asc' : method,
                    'count': count,
                    'offset': offset,
                    'sort': getUrlParameter('sort')
                }
            } else {
                var label = getUrlParameter('l');
                url = '/api/stories/search';
                params = {
                    's': searchString,
                    'count': count,
                    'offset': offset,
                    'sort': sort,
                    'asc': method,
                    'filter': filter
                };
                if (label) {
                    params['l'] = parseInt(label);
                }
            }
            $.ajax({
                type    : 'GET',
                url     : url,
                data    : params,
                success : function(data) {
                    if (recommendedTimeline) {
                        $.each(data, function(i, elem) {
                            data[i].recommendedTimeline = true;
                        });
                    }

                    console.log(data);
                    constructStory(data, place, callback);
                    //loading = 0;
                }
            });
            break;
        case 'profile':
            var urlPath = window.location.pathname;
            var userId = urlPath.substring(11, urlPath.indexOf("."));
            // /api/stories/profile?id=&count=&offset=
            url = '/api/stories/profile';
            params = { id : userId, count : count, offset : offset };
            $.ajax({
                type    : 'GET',
                url     : url,
                data    : params,
                success : function(data) {
                    constructStory(data, place, callback);
                    //loading = 0;
                }
            });
            break;
        default:
            $('.progress-load').hide();
            alert("Oooops! Smth goes wrong...");
    }
}

function constructStory(data, place, callback) {
    if(data == 0) {
        loading = 0;
        $('.progress-load').hide();
        $('.maze-btn-black.more').hide();
        return;
    }
    var aArr = [];
    var responses = [];
    $.each(data, function(i, item) {
        if (i != "all") {
            var id = item.id;
            var reposted = 0;
            if (item.repostInfo != undefined) {
                reposted = item.repostInfo.reposted;
            }
            var rUser = '';
            var rDate = '';
            var recommendedTimeline = item.recommendedTimeline;

            if (reposted == 1) {
                rUser = item.repostInfo.userId;
                rDate = item.repostInfo.repostDateOriginal;
            } else {
                rUser = item.userId;
                rDate = item.publishStart;
            }
            aArr.push($.ajax({
                type    : 'POST',
                url     : '/story/astory.html',
                data    : { id : id, rUser : rUser, rDate : rDate, place : place, recommendedTimeline: recommendedTimeline },
                success : function(data) {
                    responses[i] = data;
                }
            }));
        }
    });
    $.when.apply(null, aArr).done(function() {
        $.each(responses, function (i, item) {
            var lastStory = $('.story-wrapper').last();
            lastStory.after($(item));
        });
        $('.progress-load').hide();
        callback();
        loading = 0;
    });
}

function goBack(event) {
    event.preventDefault();
    history.back();
}

var loadingF = 0;
function loadFollowers(){
    /*if(loadingF == 1) {
        return;
    }
    loadingF = 1;
    var loaderSize = 60;
    var isMobile = window.matchMedia("only screen and (max-width: 760px)");
    if (isMobile.matches) {
        loaderSize = 30;
    }
    var animateProgress = function() {
        $('.progress-load').show()
            .circleProgress({
                value: 1.0,
                size: loaderSize,
                animation: {
                    duration: 1000,
                    easing: 'circleProgressEasing',
                    complete: function () {
                        animateProgress();
                    }
                },
                fill: {
                    gradient: ['#000', '#fff']
                }
            });
    };
    animateProgress();
    var count = 50;
    var showedEntries = $('.row.padding-left');
    var offset = showedEntries.length;
    var url = '/api/user/followers';
    var params = {};
    $.ajax({
        type    : 'GET',
        url     : url,
        data    : params,
        success : function(data) {
            constructStory(data, place);
        }
        error: function() {
         alert("search error");
         }
    });*/
}

function iOS() {

    var iDevices = [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
    ];

    while (iDevices.length) {
        if (navigator.platform === iDevices.pop()){ return true; }
    }

    return false;
}

function getOrientation(file, callback) {
    var reader = new FileReader();
    reader.onload = function(e) {

        var view = new DataView(e.target.result);
        if (view.getUint16(0, false) != 0xFFD8) return callback(-2);
        var length = view.byteLength, offset = 2;
        while (offset < length) {
            var marker = view.getUint16(offset, false);
            offset += 2;
            if (marker == 0xFFE1) {
                if (view.getUint32(offset += 2, false) != 0x45786966) callback(-1);
                var little = view.getUint16(offset += 6, false) == 0x4949;
                offset += view.getUint32(offset + 4, little);
                var tags = view.getUint16(offset, little);
                offset += 2;
                for (var i = 0; i < tags; i++)
                    if (view.getUint16(offset + (i * 12), little) == 0x0112)
                        return callback(view.getUint16(offset + (i * 12) + 8, little));
            }
            else if ((marker & 0xFF00) != 0xFF00) break;
            else offset += view.getUint16(offset, false);
        }
        return callback(-1);
    };
    reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
}

function claim(event, id, name) {
    event.preventDefault();
    //alert('claim ' + id);
    swal({
        title: "Storymaze",
        text: "Жалоба на историю " + name,
        input: "textarea",
        showCancelButton: true,
        // closeOnConfirm: false,
        //animation: "slide-from-top",
        inputPlaceholder: "Введите причину жалобы",
        confirmButtonText: "Отправить",
        cancelButtonText: "Отмена",
        inputValidator: function(result){
                return new Promise(function(resolve, reject) {
                    if (result) {
                        resolve();
                    } else {
                        reject("Введите причину жалобы!");
                    }
                });
            }
        }).then(function(result, p2){
            if(result) {
                $.ajax({
                    type : "POST",
                    url : "/story/claim.html",
                    dataType : 'json',
                    data : { storyId : id, comment : result },
                    success : function (response) {
                        if (response == 1) {
                            swal("Storymaze", "Спасибо. Жалоба на историю отправлена администрации сайта.");
                        }
                        else {
                            swal("Storymaze", "Ошибка. Попробуйте отправить жалобу повторно.");
                        }
                    },
                    error : function(error){
                        console.log(error);
                    }
                });
            }
        });
}

function bindSubscribeButtons(){
    $(document).on('click', '.follow-button', function()
    {
        var button = this,
            url = '/user/follow/' + $(button).attr('data-user-id') + '.html',
            buttons = $('.follow-button[data-user-id='+$(button).attr('data-user-id')+']'),
            doRequest = function(){
                $.get(url, function(data)
                {
                    if(data.ok)
                    {
                        $(buttons).text(data.text);
                        $(buttons).attr('data-following', data.subscribed);
                    }
                } );
            };
        if( $(button).attr('data-following') === "1" ) {
            yii.confirm( $(button).attr('confirm-text'), doRequest);
        } else {
            doRequest();
        }
        return false;
    });

    $(document).on('click', '.collection-button', function()
    {
        var button = this,
            url = '/user/collection/' + $(button).attr('data-story-id') + '.html',
            buttons = $('.collection-button[data-story-id='+$(button).attr('data-story-id')+']'),
            doRequest = function(){
                $.get(url, function(data)
                {
                    if(data.ok)
                    {
                        $(buttons).text(data.text);
                        $(buttons).attr('data-incollection', data.added);
                    }
                } );
            };
        if( $(button).attr('data-incollection') === "1" ) {
            yii.confirm( $(button).attr('confirm-text'), doRequest);
        } else {
            doRequest();
        }
        return false;
    });

};


function shuffleStories() {

    var stories = $('.clear-story-wrapper').toArray();

    var index = stories.length,
        tmp,
        randIndex;

    while (0 !== index) {
        tandIndex = Math.floor(Math.random() * index);
        index -= 1;
        tmp = stories[index];
        stories[index] = stories[tandIndex];
        stories[tandIndex] = tmp;
    }

    $('.clear-timeline-wrapper').html( $(stories) );

    return false;
}
