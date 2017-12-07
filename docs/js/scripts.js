$(document).ready(function() {

	var mainSlider = $("#owl-slider");
	mainSlider.owlCarousel({
			navigation : false, // Show next and prev buttons
			pagination: false,
			slideSpeed : 300,
			paginationSpeed : 400,
			singleItem:true
	});

	$("#owl-next").click(function(){
		mainSlider.trigger('owl.next');
	})
	$("#owl-prev").click(function(){
		mainSlider.trigger('owl.prev');
	})

	$('#summernote').summernote({
		toolbar: [
			['font', ['strikethrough']],
			['insert', ['link', 'picture']],
			['para', ['ul', 'ol', 'paragraph']]
		],
		height: 150,
		minHeight: null,
		maxHeight: null,
		lang: "ru-RU"
	});

	// $('.night-link').on('click', function(e){
	// 	$(this).toggleClass("active");
	// 	$('body').toggleClass("night-theme");
	// 	return false;
	// });

	$('.search-link').on('click', function(event) {
		event.preventDefault();
		$('#search').addClass('open');
	});

	$('#search, #search div.close').on('click keyup', function(event) {
		if (event.target == this || event.target.className == 'close' || event.target.className == 'icon-icon-close' || event.keyCode == 27) {
			$(this).removeClass('open');
		}
	});

	$('[data-toggle="tooltip"]').tooltip();

	var e = 500
	  , n = null ;
	$("#burger").on("click", function() {
	    if (null === n) {
	        var i = $(this)
	          , t = $("#navWrapper");
	        i.toggleClass("active"),
	        $("body").toggleClass("no-scroll"),
	        i.hasClass("active") || i.addClass("closing"),
	        t.hasClass("active") ? (t.removeClass("filled"),
	        setTimeout(function() {
	            t.removeClass("active")
	        }, 300)) : (t.addClass("active"),
	        setTimeout(function() {
	            t.addClass("filled")
	        }, 100)),
	        n = setTimeout(function() {
	            i.removeClass("closing"),
	            clearTimeout(n),
	            n = null
	        }, e)
	    }
	})

});
