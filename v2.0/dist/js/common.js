/******************/ 
// поработать с прелоадером
// сделать аддаптивным фильтры
// сделать модальные окна
// попробовать использовать медиа запросы в js - https://www.sitepoint.com/javascript-media-queries/
/******************/ 


window.onload = function(){
	var requestWork = new XMLHttpRequest(); // ajax запрос на получение данных работы
	var requestFilter = new XMLHttpRequest(); // ajax зпрос для получения фильтра
	var requestAbout = new XMLHttpRequest(); // ajax запрос для получения данных обо мне
	var requestContact = new XMLHttpRequest(); // ajax запрос для получения данных контактов

	var countClickAbout = 0; // подсчет на клики
	var countClickWork = 0; // подсчет на клики
	var countClickContact = 0; // подсчет на клики

	var windowScroll = document.documentElement.style; // html
	var menu = document.getElementById('menu'); // Основное меню
	var menuItem = menu.getElementsByTagName('li'); // для активного пункта меню
	var dataContainer = document.getElementById('data-container'); // контейнер для всей информации
	var jsonContainer = document.getElementById("works-container"); // контейнер, куда будут ложиться данные json
	var btnWorkOpen = document.getElementById("work-ajax"); // кнопка для получение json данных работ
	var btnToggle = document.getElementById('toggle-menu'); // кнопка для открытия/закрытия паели с меню
	var home = document.getElementById('home'); // для мобильников
	var btnTop = document.getElementById('btn-top'); //на верх
	var btnMenuClose = document.getElementById('menu-close'); // закрытие меню
	var aside = document.getElementById('aside');
	var navigation = aside.querySelector('.navigation');
	var main = document.getElementById('main');
	var n = 0;  // начальное количетсво выведеных элементов
	var k = 0;  // количество выводим данных при вызове функции (проверка на избытие)

	//mobileDisplay();
	isActiveMenu();
	loadWindow();
	setHeightMenu();

	/* функция создания ajax зфпроса (работы) */
	function getWork(){
		requestWork.open("GET", "./data/works.json", true);
		requestWork.setRequestHeader('Content-Type', 'application/json');
		requestWork.onreadystatechange = function(){
			if (requestWork.readyState == 4 && requestWork.status == 200){
				var returnRequest = JSON.parse(requestWork.response);
				renderWorks(returnRequest);
			}
		}
		requestWork.send();
	};

	/* функция ajax запроса (фильтры) */
	function getFilter(){
		requestFilter.open("GET", "./layout/filters-work.html", true);
		requestFilter.setRequestHeader('Content-Type', 'application/html');
		requestFilter.onreadystatechange = function(){
			if(requestFilter.readyState == 4 && requestFilter.status == 200) {
				var returnRequest = requestFilter.responseText;
				renderFilters(returnRequest);
			}
		}
		requestFilter.send();
	};

	/* функция ajax запроса (обо мне) */
	function getAbout(){
		requestAbout.open('GET', './layout/about.html', true);
		requestAbout.setRequestHeader('Content-Type', 'application/html');
		requestAbout.onreadystatechange = function(){
			if (requestAbout.readyState == 4 && requestAbout.status == 200){
				var returnRequest = requestAbout.responseText;
				if (countClickAbout < 1){
					var containerAbout = document.getElementById('about');
					containerAbout.insertAdjacentHTML('afterBegin', returnRequest);
				}
				countClickAbout++;
			}
		}
		requestAbout.send();
	}

	/* функция ajax запроса (контакты) */
	function getContact(){
		requestContact.open('GET', './layout/contact.html', true);
		requestContact.setRequestHeader('Content-Type', 'application/html');
		requestContact.onreadystatechange = function(){
			if (requestContact.readyState == 4 && requestContact.status == 200){
				var returnRequest = requestContact.responseText;
				if (countClickContact < 1){
					var containerContact = document.getElementById('contact');
					containerContact.insertAdjacentHTML('afterBegin', returnRequest);
				}
				countClickContact++;
			}
		}
		requestContact.send();
	}

	/* после загрузки страницы */
	function loadWindow(){
		menu.firstElementChild.classList.add('active');
		document.getElementById('about').classList.add('active');
		getHeadMenu(menu.firstElementChild);
		setTimeout(function(){
			getAbout();
			document.getElementById('loaders').classList.add('hidden');
		}, 200);
	};

	/* функция активного пункта меню */
	menu.addEventListener('click', function(){
		activeItem(event, menuItem, true);
		closeMobileMenu();
		openActiveConent(event);
		getHeadMenu(event);
	});

	//* функция открытия контента (работ)*//
	function openActiveConent(event){
		document.getElementById('loaders').classList.remove('hidden');
		for(var i = 0; i < dataContainer.children.length; i++){
			dataContainer.children[i].classList.remove('active');
			if (event.target.parentNode.getAttribute('data-link') == dataContainer.children[i].id){
				dataContainer.children[i].classList.add('active');
				if (dataContainer.children[i].id == 'about'){
					getAbout();
				} else if (dataContainer.children[i].id == 'works') {
					if (countClickWork < 1){
						getFilter();
						getWork();
					}
					countClickWork++;
				} else if (dataContainer.children[i].id == 'contact') {
					getContact();
				}
				if (dataContainer.children[i].id == 'works'){
					jsonContainer.querySelector('.work__item').style = "display: flex;";
				}
			}
		}
		setTimeout(function(){
			document.getElementById('loaders').classList.add('hidden');
		}, 200);
	}

	/* универсальная функия активного пункта меню */
	function activeItem(event, _activeItem, parent){
		var thisActiveItem = parent ? event.target.parentNode: event.target;
		event.preventDefault();
		for(var i = 0; i < _activeItem.length; i++){
			_activeItem[i].classList.remove('active');
		}
		thisActiveItem.classList.add('active');
		//console.log(thisActiveItem);
	}

	/* функция вставки фильтра в контейнер */
	function renderFilters(_filters) {
		var containerFilters = document.getElementById('works');
		var workFilter = document.getElementById('work-filters');

		containerFilters.insertAdjacentHTML('afterBegin', _filters);
		filterWorks(workFilter);

		var sorts = document.getElementById('work-sort');
		var sortsItem = sorts.getElementsByTagName('li');

		sorts.addEventListener('click', function(){
			activeItem(event, sortsItem);

			/* сортировка */
			var activeSort = document.querySelector('#work-sort .work__filter.active');
			if (activeSort.dataset.sort == 'list'){
				jsonContainer.classList.add('list');
			} else {
				jsonContainer.classList.remove('list');
			}
		});
	}

	/* функция вставки json-данных в контейнер */
	function renderWorks(dataJson){
		var printWork = "";                  // вывод на html
		var dataLenght = dataJson.length;    // количетсво всех объектов в файле
		var COUNT = 3;                       // константа, вывод записей при нажатии

		k = dataLenght - n < COUNT ? dataLenght - n: COUNT; 
		for (var i = n; i < n + k; i++) {
			var itemWork = jsonContainer.firstChild.nextSibling.cloneNode(true);
			itemWork.classList.add(dataJson[i].type);
			itemWork.querySelector('.work__img img').src = dataJson[i].minImg;
			itemWork.querySelector('.work__img a').setAttribute('href', dataJson[i].img);
			itemWork.querySelector('.work__type').innerHTML = dataJson[i].type;
			itemWork.querySelector('.work__date').innerHTML = dataJson[i].date;
			itemWork.querySelector('.work__head').innerHTML = dataJson[i].head;
			itemWork.querySelector('.work__desc').innerHTML = dataJson[i].desc;
			
			for(var j = 0; j < dataJson[i].tag.length; j++){
				var tags = itemWork.querySelector('.work__tags');
				var tagItem = tags.querySelector('.work__tag');
				tagItem.innerHTML = dataJson[i].tag[j];
				tags.appendChild(tagItem);
			}

			itemWork.querySelector('.work__author-img img').src = dataJson[i].authorImg;
			itemWork.querySelector('.work__author-name').innerHTML = dataJson[i].authorName;
			var wrapItem = document.createElement('div');
			wrapItem.appendChild(itemWork);
			printWork += wrapItem.innerHTML;

			if (i == dataLenght - 1) {
				btnWorkOpen.classList.add('disabled');
			}
		}
		n += COUNT;

		jsonContainer.insertAdjacentHTML('beforeend', printWork);

		/* фильтрация работ после добавления */
		var selectFilter = document.querySelector(".work__filter.active");
		if (selectFilter) {
			for (var i = 0; i < jsonContainer.children.length; i++) {
				jsonContainer.children[i].style = "display: none;";
				if (jsonContainer.children[i].classList.contains(selectFilter.dataset.filter)) {
					jsonContainer.children[i].style = "display: flex;";
				}
			}
		}

	};

	/* функция фильтрации работ */
	function filterWorks(_workFilter){
		var workFilter = _workFilter? _workFilter : document.getElementById('work-filters');
		var filterItem = workFilter.getElementsByTagName('li');

		workFilter.addEventListener('click', function(){
			if (event.target.classList.contains('work__filter-first')){
				workFilter.classList.toggle('open');
				console.log(event.textContent);
			} else {
				workFilter.classList.remove('open');
				activeItem(event, filterItem);
				var selectFilter = event.target;
				if (workFilter != selectFilter) {
					for (var i = 0; i < jsonContainer.children.length; i++) {
						jsonContainer.children[i].style = "display: none;";
						if (jsonContainer.children[i].classList.contains(selectFilter.dataset.filter)) {
							jsonContainer.children[i].style = "display: flex;";
						}
					}
				}
			}
		});
	}

	/* функция открытия или закрытия меню */
	function toogleMenu(){
		this.classList.toggle('active');
		isActiveMenu();
	}

	/* функция проверки меню на активность */
	function isActiveMenu(){
		/* меню для мобильников */ 
		if (home.classList.contains('mobile')){
			main.style = "min-width: 100%; left: -300px;";
			if (btnToggle.classList.contains('active')){
				aside.style = "left: calc(50% - " + (aside.offsetWidth/2 + 10) + "px);";
				windowScroll.cssText = windowScroll.cssText ? '' : 'overflow: hidden; width: ' + window.innerWidth + 'px;height:' + window.innerHeight +'px;';
				btnMenuClose.style = "opacity: 1; transform: scale(1);";
				main.style = "left: 100%; display: none";
			}
			else {
				windowScroll.cssText = "overflow: auto; width: 100%; height: 100%;";
				aside.style = "left: -600px; transform: translateX(0);";
			}
		} 
		/* меню для девайсов */
		else {
			btnMenuClose.style = "opacity: 0; transform: scale(0);";
			if (btnToggle.classList.contains('active')){
				aside.style = "left: 0px;";
				main.style = "min-width: auto; left: 0;";
			}
			else {
				aside.style = "left: -600px;";
				main.style = "min-width: 100%; left: -300px;";
			}
		}
	}

	/* функция на проверку дисплея */
	function mobileDisplay(){
		var mobileW = window.matchMedia( "(max-width: 680px)" );
		if(mobileW.matches) {
			home.classList.add('mobile');
			btnToggle.classList.remove('active');
		}
		else {
			home.classList.remove('mobile');
			btnToggle.classList.add('active');
		}
	}

	/* функция для закрытия мобильного меню */ 
	function closeMobileMenu(){
		if (home.classList.contains('mobile')){
			aside.style = "left: -600px;";
			btnToggle.classList.remove('active');
			btnMenuClose.style = "opacity: 0; transform: scale(0);";
			main.style = "min-width: 100%; left: -300px;";
			windowScroll.cssText = "overflow: auto; width: 100%; height: 100%;";
		}
	}

	/* функция для заголовка панели */
	function getHeadMenu(_this) {
		var thisHeadMenu = _this.target ? _this.target.innerHTML : _this.textContent;
		document.querySelector('.content-header__text span').innerHTML = ' — ' + thisHeadMenu;
	}

	/* функция для высоты меню */
	function setHeightMenu(){
		if (aside.offsetHeight > 400) {
			navigation.style = 'height: 400px;';
		} else {
			navigation.style = 'height: ' + (window.innerHeight - 40) + 'px;';
		}
	}

	/* функция аддаптивности фильтрации */
	function responseFilters(){
		var wFiltersWrap = document.querySelector('.filters-wrap')? document.querySelector('.filters-wrap').offsetWidth: 'undefined';
		var wFilters = document.getElementById('work-filters').offsetWidth;
		var wSort = document.getElementById('work-sort').offsetWidth;

		if (wFiltersWrap != 'undefined'){
			console.log(wFil());
			if(wFiltersWrap - wSort >= wFil() + 100){
				document.getElementById('work-filters').classList.remove('dropdown');
			} else {
				document.getElementById('work-filters').classList.add('dropdown');
			};
		}
	}

	function wFil(){
		return document.getElementById('work-filters').offsetWidth;
	}

	btnToggle.addEventListener('click', toogleMenu);

	btnMenuClose.addEventListener('click', function(){
		closeMobileMenu();
	});

	/* событие получения данных работ */
	btnWorkOpen.addEventListener("click", getWork); 

	/* вызов функции скроллинга на верх */
	btnTop.addEventListener('click', function(e) {
		 e.preventDefault();  // запрет перехода по ссылке, вместо него скрипт
		 scrollTop();
		}, false);

	/* плавный скролл на верх */ 
	function scrollTop(){
		 window.scrollBy(0,-80); // чем меньше значение (цифра -10), тем выше скорость перемещения
		 if (window.pageYOffset > 0) {requestAnimationFrame(scrollTop);}
		}

		/* событие при изменении разришения дисплея */
		window.onresize = function(){
			mobileDisplay();
			isActiveMenu();
			setHeightMenu();
			//responseFilters();
		};

		/* событие получения данных при скролле */
		window.onscroll = function(){

		// function scrollGetWorks(){
		// 	var windowY = window.pageYOffset + window.innerHeight;
		// 	var containerY = jsonContainer.getBoundingClientRect().bottom + jsonContainer.clientHeight; 
		// 	console.log( "Браузер = ", windowY ,"; "," Контент = ", containerY);
		// 	if (windowY > containerY) {
		// 		getWork();
		// 	}
		// };

		/* функция появления кнопки на верх */
		function openTop(){
			if (window.pageYOffset >= 600) {
				btnTop.style = "bottom: -35px; right: -35px;";
			}
			else btnTop.style = "bottom: -100px; right: -100px;";
		};
		openTop();
	};

}