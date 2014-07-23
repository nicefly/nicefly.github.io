var stateLevel = 0;
var currentLevel = 0;

jQuery( function($) {
	startLeft = true;

	if( window.location.pathname != '/' ) {
		startLeft = false;
	}

	history.replaceState({
		href: window.location.href,
		left: startLeft,
		green: $('header').hasClass('green'),
		level: stateLevel,
		scroll: false
	});

	$(window).on('popstate', function(e){
		state = e.originalEvent.state;

		if( state ) {
			//console.log( state );
			dir = state.left;
			if( state.level < currentLevel) {
				dir = !dir;
			}

			currentLevel = state.level;

			$(document).trigger('pageSlide', [
				dir, state.href, state.green, state.scroll, false
			]);
		}
	});

$(document).on('fireDomLoad', function() {

	/* Homepage Circle Nav Hover Effect
	----------------------- */
	$('#circlemenu a').hover( function() {
		$(this).closest('#circlemenu').addClass( $(this).parent().attr('class') );
	}, function() {
		$(this).closest('#circlemenu').removeClass( $(this).parent().attr('class') );
	});


	/* Photobooth Steps
	----------------------- */
	$('#steps .step').each( function() {
		$('<li>').text( $(this).data('title') ).appendTo( $('#steps .nav') );
	});
	$('#steps .nav li').click( function() {
		$(this).addClass('active').siblings('.active').removeClass('active');
		$('#steps .steps li').eq( $(this).index() ).slideDown().siblings().slideUp();
	}).first().addClass('active');


	/* Contact Form Validation
	------------------------- */
	$f = $('#contact form');

	$('input, select, textarea', $f).blur( function() {
		if( !$(this).val() || $(this).val() == '' ) {
			$(this).addClass('error');
		} else {
			$(this).removeClass('error');
		}
	})

	$f.submit( function() {
		$f = $(this);
		var shouldSubmit = true;
		$('input, select, textarea', $f).not('[type=hidden]').each( function() {
			if( !$(this).val() || $(this).val() == '' ) {
				$(this).addClass('error');
				shouldSubmit = false;
			} else {
				$(this).removeClass('error');
			}
		});
		return shouldSubmit;
	});

	$('#contact #gforms_confirmation_message').addClass('active').delay(1500).fadeOut('slow', function() {
		$(this).removeClass('active').show();
	});
});


/* Nav menu click
----------------------- */
$('body').on('click', '#menu span', function() {
	$('#menu').toggleClass('active');
});



/* Slideshow Social Slider
----------------------- */
$('body').on('click', '#slideshow .social-btn', function(e) {
	$social = $(this).siblings('.social');
	if( !$social.hasClass('active') ) {
		$social.addClass('active').parent().on('mouseleave touchmove', function(e) {
			$(this).off('mouseleave touchmove').find('.social').removeClass('active');
		});
	} else {
		$social.removeClass('active').parent().off('mouseleave touchmove');
	}
});


/* Contact Form Resize
----------------------- */
contactColumns();

$(window).resize( function() {
	contactColumns();
})

function contactColumns() {
	if( $(window).width() < 980 ) {
		$('.gform_body .gfield').each( function() {
			if( $(this).hasClass('gf_right_half') ) {
				$(this).removeClass('gf_right_half').data('contactColumn', 'right');
			}

			if( $(this).hasClass('gf_left_half') ) {
				$(this).removeClass('gf_left_half').data('contactColumn', 'left');
			}
		});
	} else {
		$('.gform_body .gfield').each( function() {
			if( $(this).data('contactColumn') ) {
				if( $(this).data('contactColumn') == 'left') {
					$(this).addClass('gf_left_half');
				} else {
					$(this).addClass('gf_right_half');
				}
			}
		});
	}
}


/* Ajax Page Slide
----------------------- */

$('body').on('click', 'a.slideHome', function() {
	if( $(this).hasClass('ir') && currentLevel != 0 ) {
		history.back();
		return false;
	}else if( history.pushState ) {
		$(document).trigger('pageSlide', [
			false, $(this).attr('href'), false, false, true
		]);
		return false;
	}
});

$('body').on('click', 'a.slideNextPost, a.slideAllPosts, a.slideRight, #main-blog h2 a', function() {
	if( history.pushState ) {
		$(document).trigger('pageSlide', [
			true, $(this).attr('href'), true, false, true
		]);
		return false;
	}
});

$('body').on('click', '#main-categories .slides a', function() {
	if( history.pushState ) {
		$(document).trigger('pageSlide', [
			false, $(this).attr('href'), true, false, true
		]);
		return false;
	}
});

$('body').on('click', '#pagination a', function() {
	if( history.pushState ) {
		$(document).trigger('pageSlide', [
			true, $(this).attr('href'), true, false, true
		]);
		return false;
	}
});

$(document).on('pageSlide', function(e, left, href, green, scroll, updateHistory) {
	dataArray = {};
	dataArray['ajax'] = 1;

	nClass = 'left';
	sOld = $(window).width();

	if( left ) {
		nClass = 'right';
		sOld = -sOld;
	}

	$pc = $('#page-container').addClass('loading');
	$o = $pc.children('.main-content');
	$('#slideshow', $o).remove();

	$o.animate({
		left: sOld
	}, 299, function() {
		$(this).remove();

		$('body').trigger('fix-height');
	});

	$.get( href, dataArray, function( data, status ) {
		$d = $(data);
		title = $d.first().text();

		$n = $d.eq(2);

		if( updateHistory ) {
			stateLevel++;
			currentLevel = stateLevel;

			/* Change title/URL */
			document.title = title;
			history.pushState({
				left: left,
				green: green,
				scroll: scroll,
				level: stateLevel,
				href: href
			}, title, href);
		}

		$pc.removeClass('loading');

		$n.addClass(nClass+' new')
			.appendTo( $pc )
			.css('top', (scroll) ? scroll : 0 )
			.imagesLoaded( function() {
				$(document).trigger('fireImagesLoad');
			});

		$n.animate({
			left: 0
		}, 300, function() {
			$(this).removeClass('new left right').removeAttr('style');
			$(document).trigger('fireDomLoad');

			setTimeout( function() {
				$('html,body').scrollTop(0);
				skrollrObj.refresh();
				$.waypoints('refresh');

				if( scroll ) {
					$('html,body').scrollTo($(scroll).offset().top, {
						duration: 500
					});
				}

			}, 100);

			if( green ) {
				$('header').addClass('active green');

			} else {
				$('header').removeClass('active green');
			}

			$('header li').removeClass('active');
			if( $n.is('#main-photobox') ) {
				$('header li.photobox').addClass('active');
			} else if( $n.is('#main-galleries') ) {
				$('header li.galleries').addClass('active');
			} else if( $n.is('#main-blog') ) {
				$('header li.blog').addClass('active');
			}
		});

	});
});

/* Fix height */
$('body').on('fix-height', function() {
	$('.skrollr-dummy').hide().height( $(window).height() ).show();
});

$(document).on('fireResize', function() {
	$('body').trigger('fix-height');
});

/* Categories menu click
----------------------- */

$('body').on('click', '#blognav a', function() {
	if( $(this).is('#categories') ) {
		$(this).parent().next().children('a.active').click();
		$(this).toggleClass('active').next('ul').slideToggle('fast');
	} else if( $(this).is('#search') ) {
		$(this).parent().prev().children('a.active').click();
		$(this).toggleClass('active').next('form').slideToggle('fast');
	} else {
		$(document).trigger('pageSlide', [
			true, $(this).attr('href'), true, false, true
		]);
	}
	return false;
});



/* Search form submit
----------------------- */
$('body').on('submit', '#searchform', function() {
	v = $('input[name=s]', $(this)).val()
	if( v != '' ) {
		$(document).trigger('pageSlide', [
			true, 'http://heandshephoto.dev/#/search/'+v+'/', true, false, true
		]);
	}
	return false;
});



/* Slideshow
----------------------- */

$(document).on('fireDomLoad', function() {
	$s = $('#slideshow');
	$('#slideshow-controls span').click( function() {
		var offsetLeft,
			scrollPos,
			sl = $s.scrollLeft(),
			dir = ($(this).hasClass('next')) ? 'right' : 'left',
			header = ($('hgroup h2').offset().left > 72) ? $('hgroup h2').offset().left - 72 : 0;

		$('li.slide', $s).each( function() {
			if( dir == 'right' ) {
				if( $(this).offset().left > 72 + 5 + header ) {
					scrollPos = $(this).position().left - 72 + 5 - header;
					return false;
				}
			} else {
				if( $(this).offset().left >= 72 - 5 + header && $(this).prev().length ) {
					scrollPos = $(this).prev().position().left - 72 + 5 - header;
					return false;
				}
			}
		});
		if( typeof(scrollPos) != "undefined" ) {
			$s.scrollTo( scrollPos, {
				duration: 500
			});
		}
	});
});


/* Referral Images
----------------------- */

$(document).on('fireResize fireImagesLoad', function() {
	$('#referral .image').each( function() {
		$i = $(this);
		$('strong', $i).height( $('img', $i).height());
	})
});


$(window).resize( function(){
	$(document).trigger('fireResize');
})

$(window).load( function(){
	$(document).trigger('fireImagesLoad');
});

$(document).trigger('fireDomLoad');


});
