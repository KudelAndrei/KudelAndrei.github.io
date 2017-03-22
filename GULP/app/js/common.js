$(window).on('load', function () {
 $('.cssload-thecube').delay(500).fadeOut('slow');
})

$(document).ready(function(){
	setTimeout(function(){
		$('.container-fluid').removeClass('loader');
	}, 500);
	
	$(window).on('load resize', windowMobile);

	/*Cделать функцию очистки анимации*/

	/* Анимация */
		/* для общих секций */
		$('.section__head').addClass('animated fadeInDown');
		$('.about-image').addClass('animated fadeInDown');

		/* для about */
		$('.about__image').addClass('animated fadeInLeftBig');
		$('.about__head').addClass('animated fadeInDown');
		$('.about__age').addClass('animated zoomIn');
		$('.about__education, .about__quality, .about__motivation, .about__skills').addClass('animated fadeInUp');

		/* для work */
		$('.wrapper-owl').addClass('animated fadeInDown');
		$('.work-item').addClass('animated zoomIn');

		/* для contact */
		

	/* выравнивание по высоте */
	//$('.work-item img').equalHeights();
	$('.work-item__tools').equalHeights();



	/* Функция для постепенного появления меню */
	function loadMenu(){
		$('.menu__item').each(function(i){
			$(this).show(300*i).delay(150*i);
		});
	};

	loadMenu(1000);

	/* Функция для мобильного экрана */
	function windowMobile(){
		if ($(window).width() <= '768')
				$('.container-fluid').addClass('mobile');
			else
				$('.container-fluid').removeClass('mobile');
	}

	/* Функция вызывается при нажатии на логопит (для открытия меню) */
	function toggleMenu(){
		if ($(this).hasClass('toggle')){
			$(this).removeClass('toggle');
			textHome = "Главная";
			$('.text-active').text(textHome);
			$('.wrap-container').removeClass('menu--active');
			$('.section').fadeOut(700);
			/* обнуление анимации */
			$('.contact-info__item, .contact-social__item').each(function(i){
					$('.contact-info__item, .contact-social__item').eq(i).removeClass('animated fadeInUp');
			});	
		}
	};


	/* Функция выполняется при наведении на меню и при нажатии */
	function hoverMenu(){
		if($(this).hasClass('menu__item--about')){
			$('.menu__image').siblings().removeClass("hover");
			$('.menu__image--about').addClass('hover');
			$(this).click(function(){
				$('.section').removeClass('section--active');
				$('.about').fadeIn(600);
			});
		}
		/*
		else if ($(this).hasClass('menu__item--skills')){
			$('.menu__image').siblings().removeClass("hover");
			$('.menu__image--skills').addClass('hover');
			$(this).click(function(){
				$('.section').removeClass('section--active');
				$('.skills').fadeIn(500);
				$('.skills-card, .tools__item').each(function(i){
					setTimeout(function() {
						$('.skills-card, .tools__item').eq(i).addClass('animated fadeInUp');
					}, 200*i);		
				});
			});
		} */
		else if ($(this).hasClass('menu__item--work')){
			$('.menu__image').siblings().removeClass("hover");
			$('.menu__image--work').addClass('hover');
			$(this).click(function(){
				$('.section').removeClass('section--active');
				$('.work').fadeIn(600);
			});
		}
		else if ($(this).hasClass('menu__item--contact')){
			$('.menu__image').siblings().removeClass("hover");
			$('.menu__image--contact').addClass('hover');
			$(this).click(function(){
				$('.section').removeClass('section--active');
				$('.contact').fadeIn(600);
				/* анимация */
				$('.contact-info__item, .contact-social__item').each(function(i){
					setTimeout(function() {
						$('.contact-info__item, .contact-social__item').eq(i).addClass('animated fadeInUp');
					}, 200*i);		
				});
				/* end */
			});
		}
	};

	/* переход из биографии в работы*/
	$('#about__link--work').click(function(){
		$('.section').hide();
		$('.work').fadeIn();
	});

	/* переход из биографии в контакты*/
	$('#about__link--contact').click(function(){
		$('.section').hide();
		$('.contact').fadeIn();
		$('.contact-info__item, .contact-social__item').each(function(i){
			setTimeout(function() {
				$('.contact-info__item, .contact-social__item').eq(i).addClass('animated fadeInUp');
			}, 200*i);		
		});
	});



	/* Функиция при нажатии на меню */
	function toggleSection(){
		$(".wrap-container").addClass("menu--active");
		$(".logo").addClass("toggle");
		text = $(this).children('a').text();
		$('.text-active').text(text);
		//
	};


	/* при нажатии на скролл */
	$('.scroll').click(function(event){
		var top = $(this).offset().top + 60;		
		$('body,html').animate({scrollTop: top}, 500);
	});


	/* Вызов функция */
	$('.logo').click(toggleMenu);
	$('.menu__item').hover(hoverMenu);
	$('.menu__item').click(toggleSection);

	// закрытие меню
	$(".toggle").click(function(){
		$('.section').removeClass('section--active');
		$(".wrap-container").toggleClass("menu--active");
			$(this).removeClass("toggle");
			$('.text-active').text();
	});


	/* сладйре изучаемых материалов */
	$('.owl-study').owlCarousel({
		loop: true,
		items: 2,
		responsiveClass: true,
		autoplayTimeout: 5000,
		autoplay: true, 
	});

	/* Слайдер презентация*/
	$('.owl-works').owlCarousel({
		loop: true,
		center: true,
		autowidth: true,
		autoplay: true, 
		nav: false,
		navText: '',
		dots: false,
		stagePadding: 20,
		autoplayTimeout: 5000,
		margin: 10,
		autoplayHoverPause: true,
		responsiveClass: true,
		responsive: {
		 0:{
				items:2,
			},
			650:{
				items:3,
			},
			1000:{
				items:4,
			},
			1360:{
				items:5,
			}, 
			1720: {
				items:6,
			}
		}
	});
	
	/* Навигация по слайдам work*/
	var owl = $('.owl-works');
	owl.owlCarousel();
	$('.owl-left').click(function() {
		owl.trigger('prev.owl.carousel');
	})
	$('.owl-right').click(function() {
		owl.trigger('next.owl.carousel');
	});


	// вспывашки
	$('.popup-with-zoom-anim').magnificPopup({
		type: 'inline',
		fixedContentPos: false,
		fixedBgPos: true,
		overflowY: 'auto',
		closeBtnInside: true,
		preloader: false,
		midClick: true,
		removalDelay: 300,
		mainClass: 'my-mfp-zoom-in'
	});


});

