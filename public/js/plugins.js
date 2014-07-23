var skrollrObj = false;

jQuery( function($) {

$(document).on('fireImagesLoad', function() {
	if( !/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
		if( !skrollrObj ) {
			skrollrObj = skrollr.init();
		} else {
			skrollrObj.refresh();
		}
	}

	/* Fix height */
	$('.skrollr-dummy').hide().height( $(window).height() ).show();
});

$(document).on('fireDomLoad', function() {

/* Waypoints
----------------------- */

$('#home').waypoint({
	offset: '-90%',
	handler: function(e, d) {
		if( d == "down" ) {
			$('header').addClass('active');
		} else if( d == 'up' ) {
			$('header').removeClass('active');
		}
	}
});

$('#blog').waypoint({
	offset: '5%',
	handler: function(e, d) {
		$('#menu li').removeClass('active');
		if( d == 'down' ) {
			$('header').addClass('active');
			$('#menu li.blog').addClass('active');
		} else if( d == 'up') {
			$('header').removeClass('active');
		}
	}
});

$('#about').waypoint({
	offset: '5%',
	handler: function(e, d) {
		$('header').addClass('active');
		$('#menu li').removeClass('active');
		if( d == 'down' ) {
			$('#menu li.about').addClass('active');
		} else if( d == 'up' ) {
			$('#menu li.blog').addClass('active');
		}
	}
});

$('#galleries').waypoint({
	offset: '5%',
	handler: function(e, d) {
		$('header').addClass('active');
		$('#menu li').removeClass('active');
		if( d == 'down' ) {
			$('#menu li.galleries').addClass('active');
		} else if( d == 'up' ) {
			$('#menu li.about').addClass('active');
		}
	}
});

$('#photobox').waypoint({
	offset: '5%',
	handler: function(e, d) {
		$('header').addClass('active');
		$('#menu li').removeClass('active');
		if( d == 'down' ) {
			$('#menu li.photobox').addClass('active');
		} else if( d == 'up' ) {
			$('#menu li.galleries').addClass('active');
		}
	}
});

$('#referrals').waypoint({
	offset: '5%',
	handler: function(e, d) {
		$('header').addClass('active');
		$('#menu li').removeClass('active');
		if( d == 'down' ) {
			$('#menu li.referrals').addClass('active');
		} else if( d == 'up' ) {
			$('#menu li.photobox').addClass('active');
		}
	}
});

$('#workshops').waypoint({
	offset: '5%',
	handler: function(e, d) {
		$('header').addClass('active');
		$('#menu li').removeClass('active');
		if( d == 'down' ) {
			$('#menu li.workshops').addClass('active');
		} else if( d == 'up' ) {
			$('#menu li.referrals').addClass('active');
		}
	}
});

$('#contact').waypoint({
	offset: '5%',
	handler: function(e, d) {
		$('header').addClass('active');
		$('#menu li').removeClass('active');
		if( d == 'down' ) {
			$('#menu li.contact').addClass('active');
		} else if( d == 'up' ) {
			$('#menu li.workshops').addClass('active');
		}
	}
});

$('#rockingmoose').waypoint({
	offset: '5%',
	handler: function(e, d) {
		$('header').addClass('active');
		$('#menu li').removeClass('active');
		if( d == 'down' ) {
			$('#menu li.rockingmoose').addClass('active');
		} else if( d == 'up' ) {
			$('#menu li.contact').addClass('active');
		}
	}
});

$('#main-galleries .gallery').waypoint({
	offset: 200,
	handler: function(e,d) {
		$('#main-galleries .nav a').removeClass('active');
		id = $(e.target).attr('id').replace('-gallery','');
		$nav = $('#main-galleries .nav .'+id);

		if( d == 'down' ) {
			$('a', $nav).addClass('active');
		} else if( d == 'up' ) {
			$nav.prev().children('a').addClass('active');
		}
	}
});

});

$(document).on('fireImagesLoad', function() {
	$.waypoints('refresh');
});



/* Scroll To
----------------------- */

$('body').on('click', '#menu a, #circlemenu a', function() {
	href = '#'+this.pathname.replace('/','').replace('/','');

	if( $(href).length ) {
		$('html,body').scrollTo( href, {
			easing: 'easeInOutQuint',
			margin: true,
			duration: 500,
			offset: {
				top: 7
			}
		});
	} else {
		location.hash = '';
		$(document).trigger('pageSlide', [
			false, '/', false, href, true
		]);
	}

	$('#menu').removeClass('active');
	return false;
});

$('body').on('click', '#main-galleries .nav a', function() {
	h = $('header').outerHeight() + $('#main-galleries .nav').outerHeight();
	$('body').scrollTo( $(this).attr('href'), {
		easing: 'easeInOutQuint',
		duration: 500,
		offset: {
			top: -h
		}
	});
	return false;
});

$('body').on('click', '#logo', function() {
	location.hash = '';

	if( $('#main').length ) {
		$('html,body').scrollTo( 0, {
			easing: 'easeInOutQuint',
			duration: 500
		});
	} else {
		$(document).trigger('pageSlide', [
			false, '/', false, 0, true
		]);
	}

	$('#menu').removeClass('active');
	return false;
});


/* Categories Carousel
----------------------- */

$(document).on('fireDomLoad', function(){
	$('#main-categories article').flexslider({
		animation: 'slide',
		slideshow: false,
		controlNav: false,
		move: 1,
		itemWidth: 360,
		itemMargin: 12,
		minItems: 1
	})
});

});
