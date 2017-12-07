


$(document).ready(function() {

      var swiper = new Swiper('.swiper-container', {
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        slidesPerView: 3,
        spaceBetween: 6,

        breakpoints: {
            768: {
                slidesPerView: 2,
                spaceBetween: 6
            },
            320: {
                slidesPerView: 1,
                spaceBetween: 6
            }
        }
    });

    $('.card-index_btn').click(function(e) {
        e.preventDefault();
        $('.card-index').fadeIn();
    });

    $('.field-user-private label').click(function(e) {
        $(this).toggleClass('has-success');
    });

    $('.search-wrapper form .hover_tooltip span').hover(
       function(){ $(this).parents(".hover_tooltip").find('.blue_tooltip').fadeIn() },
       function(){ $(this).parents(".hover_tooltip").find('.blue_tooltip').fadeOut() }
    );

    $('.search-wrapper form .hover_tooltip').click(function(e) {
        e.preventDefault();
        $(this).find('.blue_tooltip').toggleClass('close');
    });


    $('.card-index .grey_btn').click(function(e) {
        e.preventDefault();
        $('.card-index').fadeOut();
    });

    $('.forgot_pass').click(function(e) {
        e.preventDefault();
        $(this).next().fadeIn();
    });

    $('.advanced_search').click(function(e) {
        e.preventDefault();
        $(this).toggleClass('open');
        $('.advanced_search_wrap').slideToggle();

    });

     $('.night-link').click(function(e) {
         e.preventDefault();

         var $button = $(this);
         var $body = $('body');
         var action = $body.hasClass('night_mode') ? 'off' : 'on';

         $.post('/api/site/nightmode', {action: action}, function (response) {
             $button.toggleClass('active');
             $body.toggleClass('night_mode');
             $body.toggleClass('night-theme');
         });
    });


    $('.profile_cards .profile_title_maze .card_list_btn').click(function(e) {
        e.preventDefault();
        $(this).parents('.profile_cards').find('.profile_white').addClass('card_list');
        $('.profile_cards_block').toggleClass('open');
        $('.profile_cards .profile_title_maze .border_button').toggleClass('open');

    });

    $('.profile_cards .profile_title_maze .list_btn').click(function(e) {
        e.preventDefault();
        $(this).parents('.profile_cards').find('.profile_white').removeClass('card_list');
        $('.profile_cards_block').toggleClass('open');
        $('.profile_cards .profile_title_maze .border_button').toggleClass('open');

    });

    $('.my-story-wrapper .more').click(function(e) {
        e.preventDefault();
        if ($(this).hasClass('open')) {
            $(this).parents('.my-story-wrapper').find('.story_short_preview').fadeOut();
            $(this).parents('.my-story-wrapper').removeClass('open');
            $(this).removeClass('open');
        } else {
            $(this).parents('.my-story-wrapper').find('.story_short_preview').fadeIn();
            $(this).parents('.my-story-wrapper').addClass('open');
            $(this).addClass('open');
        }
    });

    // wtf ???
    // $('.my-story-wrapper .delete_story').click(function(e) {
    //     e.preventDefault();
    //     $(this).parents('.my-story-wrapper').remove();
    // });

    $('.more_comments').click(function(e) {
        e.preventDefault();
        $(this).hide();
        $(this).siblings('.all_comments_wrap').slideDown();

    });

    $('.story_short .more').click(function(e) {
        e.preventDefault();
        if ($(this).hasClass('open')) {
            $(this).parents('ul').next().fadeOut();
            $(this).removeClass('open');
        } else {
            $(this).parents('ul').next().fadeIn();
            $(this).addClass('open');
        }
    });

    $('.reply').click(function(e) {
        e.preventDefault();
        $(this).parents('.media').find('.commentary-form').slideToggle();
    });

    $('.chat .reply-btn').click(function(e) {
        e.preventDefault();
        $(this).parents('.panel-chat').find('.commentary-form').slideToggle();
    });

    $('[data-toggle="tooltip"]').tooltip()

    var config = {
        '.chosen-select': {},
        '.chosen-select-deselect': { allow_single_deselect: true },
        '.chosen-select-no-single': { disable_search_threshold: 10 },
        '.chosen-select-no-results': { no_results_text: 'Oops, nothing found!' },
        '.chosen-select-width': { width: "95%" }
    }
    for (var selector in config) {
        $(selector).chosen(config[selector]);
    }

    $(window).scroll(function() {
        if ($(this).scrollTop() > 10) {
            $("#to_top").fadeIn(300);

        } else {
            $("#to_top").fadeOut(300);
        }

    });

    $('#to_top').click(function() {
        $('html, body').animate({
            scrollTop: 0
        }, 'slow');
        return false;

    });

    $('.redactor').click(function(e) {
        e.preventDefault();
        $(this).parent().toggleClass('open');
    });


    function responsive_scrolls() {
        var windows_height = $(window).height();
        var page_title = $('.page_title').height();
        var nav_tabs = $('.tab_wrap .nav-tabs').height();

        // $('.profile_white').css('min-height', windows_height) ;

        $('.my_story_block .col-md-6 .grey_bg').css('min-height', windows_height - page_title - nav_tabs - 108);

    };


    responsive_scrolls();
    $(window).resize(responsive_scrolls);



});
