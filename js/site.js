/**
 * Created by Андрей on 24.10.2015.
 */

var okName = "Ок";
var cancelName = "Отмена";

function setConfirmButtons() {
    switch ($("#lang-select").find("a").text()) {
        case "Eng":
            console.log("Eng");
            okName = "Ок";
            cancelName = "Отмена";
            break;
        case "Рус":
            console.log("Rus");
            okName = "Ok";
            cancelName = "Cancel";
            break;
    }
}

yii.confirm = function(message, ok, cancel) {
    swal({
        title: "",
        text: message,
        type: "warning",
        showCancelButton: true,
        closeOnConfirm: true,
        confirmButtonText: okName,
        confirmButtonColor: "#ec6c62",
        cancelButtonText: cancelName
    }).then(function(result) {
        if (result) {!ok || ok(); } else {!cancel || cancel(); }
    });
};

function tog(v) {
    return v ? 'addClass' : 'removeClass';
}

/*
 * Calculates bottom offset to load new mazes when scrolling
 */
function getBottomOffset(mazes) {

    mazes = mazes || 3;

    var storymazes = $('.story-wrapper').get().reverse(),
        offset = 0,
        i;
    //fix error on pajes were none storymaze
    if (0 === storymazes.length) return offset;

    mazes = storymazes.length < mazes ? storymazes.length : mazes;

    for (i = 0; i < mazes; i++) {
        offset += storymazes[i].clientHeight;
    }
    return offset;
}

/*$(document).on('input', '.clearable', function() {
    $(this)[tog(this.value)]('x');
}).on('mousemove', '.x', function(e) {
    $(this)[tog(this.offsetWidth-18 < e.clientX-this.getBoundingClientRect().left)]('onX');
}).on('click', '.onX', function(){
    $(this).removeClass('x onX').val('').change();
});*/

var loc = "";
if ((window.location.href).indexOf("?") > 0) {
    loc = (window.location.href).substr(0, (window.location.href).indexOf("?")).split("/");
} else if ((window.location.href).indexOf("#") > 0) {
    loc = (window.location.href).substr(0, (window.location.href).indexOf("#")).split("/");
} else {
    loc = (window.location.href).split("/");
}

$(document).ready(function() {

    //checkNew();
    /*(function poll(){
        setTimeout(function(){
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
                            poll();
                        }
                    });
                }
            });
        }, 10000);
    })();*/

    var isMobile = window.matchMedia("only screen and (max-width: 760px)");
    var isIpadMiniP = window.matchMedia("only screen and (min-width: 768px) and (max-width: 1024px) and (orientation : portrait)");

    var isIOS = iOS();

    // scrolling offset in pixels, new mazes start to preload
    var scrollRefreshOffset = getBottomOffset();
    if (isIOS) {
        $(".download-link-mob").hide();
        $(".download-link").hide();
    }

    if (isMobile.matches || isIpadMiniP.matches) {
        if ($(".download-link-mob").css("display") != "none") {
            $(".wrap > .container").css('padding-top', '5%');
        }
        if (loc[3] == "") {
            $(".heartA").hide();
            $(".profileA").hide();
            $(".mymazeA").hide();
            $(".homeH").hide();
            $(".searchA").hide();
            $(".homeA").show();
        } else if (loc[3] == "site") {
            $(".heartA").hide();
            $(".profileA").hide();
            $(".mymazeA").hide();
            switch (loc[4]) {
                case "index.html":
                    $(".homeH").hide();
                    $(".searchA").hide();
                    $(".homeA").show();
                    break;
                case "search.html":
                    $(".searchH").hide();
                    $(".homeA").hide();
                    $(".searchA").show();
                    break;
            }
        } else if (loc[3] == "user") {
            $(".homeA").hide();
            $(".searchA").hide();
            $(".mymazeA").hide();
            switch (loc[4]) {
                case "actions.html":
                    $(".heartH").hide();
                    $(".profileA").hide();
                    $(".heartA").show();
                    break;
                case "view":
                    $(".profileA").show();
                    $(".profileH").hide();
                    $(".heartA").hide();
                    break;
            }
        } else if (loc[3] == "story") {
            $(".homeA").hide();
            $(".searchA").hide();
            $(".heartA").hide();
            $(".profileA").hide();
            $(".mymazeH").hide();
            $(".mymazeA").show();
        } else {
            $(".homeA").hide();
            $(".searchA").hide();
            $(".heartA").hide();
            $(".profileA").hide();
            $(".mymazeH").hide();
            $(".mymazeA").show();
        }
    }



    $(window).scroll(function() {
        /*if (!$('.welcome-block').hasClass('welcome-fixed')){
            $('.welcome-block').toggleClass('welcome-fixed');
        }
        if ($(window).scrollTop() == 0){
            if ($('.welcome-block').hasClass('welcome-fixed')){
                $('.welcome-block').toggleClass('welcome-fixed');
            }
        }*/

        var windowHeight = $(window).height();

        if (isMobile.matches) {
            windowHeight = window.innerHeight;
        }


        if ($(window).scrollTop() - ($(document).height() - windowHeight) > -scrollRefreshOffset) {

            if ($('.search-result-content')[0] != undefined) {
                loadTimelineStories('search', function() {
                    scrollRefreshOffset = getBottomOffset();
                });
            }

            if ($('.site-index')[0] != undefined) {
                loadTimelineStories('home', function() {
                    scrollRefreshOffset = getBottomOffset();
                });
            }

            if ($('.profile-wrapper')[0] != undefined) {
                loadTimelineStories('profile', function() {
                    scrollRefreshOffset = getBottomOffset();
                });
            }

            if ($('.user-followers')[0] != undefined) {
                loadFollowers();
            }
        }
    });
    bindSubscribeButtons();
});

$(function() {
    var isMobile = window.matchMedia("only screen and (max-width: 760px)");
    var isIpadMiniP = window.matchMedia("only screen and (min-width: 768px) and (max-width: 1024px) and (orientation : portrait)");

    if (!isMobile.matches && !isIpadMiniP.matches) {
        //$('.pretty-tooltip').tooltip();
        $('*:not(.social-likes,.social-likes>div)').tooltip();
    }
});

function episodeSequelDidChange($container) {
    var sequel = $container.find('input[type=radio]:checked').val();
    var divLastWord = $('#div-last-word');
    var divNext1 = $('#div-next-1');
    var divTextNext1 = $('#div-next-text-1');
    var divNext2 = $('#div-next-2');
    var divTextNext2 = $('#div-next-text-2');
    var divNext3 = $('#div-next-3');
    var divTextNext3 = $('#div-next-text-3');

    switch (sequel) {
        case '0':
            divLastWord.show();
            divNext1.hide();
            divTextNext1.hide();
            divNext2.hide();
            divTextNext2.hide();
            divNext3.hide();
            divTextNext3.hide();
            break;
        case '1':
            divLastWord.hide();
            divNext1.show();
            divTextNext1.show();
            divNext2.hide();
            divTextNext2.hide();
            divNext3.hide();
            divTextNext3.hide();
            break;
        case '2':
            divLastWord.hide();
            divNext1.show();
            divTextNext1.show();
            divNext2.show();
            divTextNext2.show();
            divNext3.hide();
            divTextNext3.hide();
            break;
        case '3':
            divLastWord.hide();
            divNext1.show();
            divTextNext1.show();
            divNext2.show();
            divTextNext2.show();
            divNext3.show();
            divTextNext3.show();
            break;
        default:
            divLastWord.hide();
            divNext1.hide();
            divTextNext1.hide();
            divNext2.hide();
            divTextNext2.hide();
            divNext3.hide();
            divTextNext3.hide();
            return;
    }
}

$('#episode-sequel').change(function() {
    episodeSequelDidChange($(this));
});

$('#episode-sequel').ready(function() {
    episodeSequelDidChange($(this));
});

$(function() {
    var $elem = $('.container');

    $('#nav_up').fadeIn('slow');
    $('#nav_down').fadeIn('slow');

    $(window).bind('scrollstart', function() {
        $('#nav_up,#nav_down').stop().animate({ 'opacity': '0.2' });
    });
    $(window).bind('scrollstop', function() {
        $('#nav_up,#nav_down').stop().animate({ 'opacity': '1' });
    });

    $('#nav_down').click(
        function(e) {
            $('html, body').animate({ scrollTop: $(document).height() }, 800);
        }
    );
    $('#nav_up').click(
        function(e) {
            $('html, body').animate({ scrollTop: '0px' }, 800);
        }
    );
});

$(function() {
    var $comments = $('.commentText');
    /*$.each($comments, function(i) {
        var comment = $comments[i];
        if (comment.offsetHeight > 100) {
            $(comment).addClass("cursor-pointer");
            $(comment).addClass("great-comment");
            var $cWrap = $(comment).parents(".comment-wrapper");
            var $expander = $cWrap.find(".expander");
            $expander.append($('<i id="expander-direction" class="fa fa-arrow-down fa-2x">'));
            $(comment).click(function () {
                $(this).toggleClass("great-comment", 1000);
                var com = $(this).parents(".comment-wrapper");
                var exp = $(com).find("#expander-direction");
                if ($(this).hasClass("great-comment")) {
                    exp.switchClass("fa-arrow-down", "fa-arrow-up", 1000);
                } else {
                    exp.switchClass("fa-arrow-up", "fa-arrow-down", 1000);
                }
            });
            $expander.click(function () {
                $(comment).toggleClass("great-comment", 1000);
                var com = $(comment).parents(".comment-wrapper");
                var exp = $(com).find("#expander-direction");
                if ($(comment).hasClass("great-comment")) {
                    exp.switchClass("fa-arrow-down", "fa-arrow-up", 1000);
                } else {
                    exp.switchClass("fa-arrow-up", "fa-arrow-down", 1000);
                }
            });
        }
    })*/
});

$(document).click(function(e) {
    if (e.target.id != 'global-search' && $('#search-hint').css('display') != 'none') {
        $('#search-hint').hide();
        if (window.Search) {
            Search.destroy();
        }
    }
});

$('.navbar-fixed-top .search-hint-btn').click(function(e) {
    if (this.id == "by-author") {
        Search.destroy();
        $(".navbar-fixed-top #global-search").val("@");
    }
    if (this.id == "by-name") {
        Search.destroy();
        $(".navbar-fixed-top #global-search").val("");
    }
    if (this.id == "by-tag") {
        $(".navbar-fixed-top #global-search").val("#");
        $(".navbar-fixed-top #global-search").triggerHandler('search-by-tag');
    }
    $(".navbar-fixed-top #global-search").focus();
    $('.navbar-fixed-top #search-hint').hide();

});

$('.navbar-fixed-bottom .search-hint-btn').click(function(e) {
    if (this.id == "by-author") {
        Search.destroy();
        $(".navbar-fixed-bottom #global-search1").val("@");
    }
    if (this.id == "by-name") {
        Search.destroy();
        $(".navbar-fixed-bottom #global-search1").val("");
    }
    if (this.id == "by-tag") {
        $(".navbar-fixed-bottom #global-search1").val("#");
        $(".navbar-fixed-bottom #global-search1").triggerHandler('search-by-tag');
    }
    $(".navbar-fixed-bottom #global-search1").focus();
    $('.navbar-fixed-bottom#search-hint').hide();

});

$('#global-search')
    .keypress(function(e) {
        if (this.value == "") {
            $('#search-hint').show();
            Search.destroy();
        } else {
            $('#search-hint').hide();
        }
    })
    .focus(function(e) {
        $('#search-hint').show();
    })
    .keyup(function() {
        if (!this.value) {
            $('#search-hint').show();
            Search.destroy();
        }
    });

$('#global-search1')
    .keypress(function(e) {
        if (this.value == "") {
            $('#search-hint').show();
            Search.destroy();
        } else {
            $('#search-hint').hide();
        }
    })
    .focus(function(e) {
        $('#search-hint').show();
    })
    .keyup(function() {
        if (!this.value) {
            $('#search-hint').show();
            Search.destroy();
        }
    });

$('#save-episode-btn').click(function(event) {
    if ($('#episode-isfirst').is(':checked') && $('input[type=radio][value="0"]').is(':checked')) {
        sweetAlert("Ошибка!", "Нельзя делать первый эпизод концовкой!", "error");
        event.preventDefault();
    }
});

$('#search-by-popular-btn').click(function() {
    $('#global-search').val("");
    $('#global-search1').val("");
});
