/******************/ 
// переделать код на промисы!!!!
/******************/ 

window.onload = function(){

	var menu = document.getElementById('menu'); // Основное меню
	var menuItem = menu.getElementsByTagName('li'); // для активного пункта меню
	var myReuest = new XMLHttpRequest(); // ajax запрос на получение данных работы
	var myReuestHTML = new XMLHttpRequest(); // ajax зпрос для получения html
	var filter = document.getElementById('btn-filters'); // добавление табов ****временно
	var filterContainer = document.getElementById('content-info'); // контейнер для табов
	var jsonContainer = document.getElementById("works"); // контейнер, куда будут ложиться данные json
	var btnAjax = document.getElementById("work-ajax"); // кнопка для получение json данных
	var btnToggle = document.getElementById('toggle-menu'); // кнопка для открытия/закрытия паели с меню
	var home = document.getElementById('home'); // для мобильников
	var homeBefore = document.getElementById('home-before');
	var aside = document.getElementById('aside');
	var main = document.getElementById('main');
	var n = 0;  // начальное количетсво выведеных элементов
	var k = 0;  // количество выводим данных при вызове функции (проверка на избытие)
	var URL = "../data/works.json"; 

	/* функция активного пункта меню */
	menu.addEventListener('click', function(){
		closeMobileMenu();
		activeItem(event, menuItem, true);
	});

	/* универсальная функия активного пункта меню */
	function activeItem(event, _activeItem, parent){
		var thisActiveItem = parent ? event.target.parentNode: event.target;
		event.preventDefault();
		for(var i = 0; i < _activeItem.length; i++){
			_activeItem[i].classList.remove('active');
		}
		thisActiveItem.classList.add('active');
		console.log(thisActiveItem);
	}

	/* функция создания ajax зфпроса (работы) */
	function getJson(){
		myReuest.open("GET", URL, true);
		myReuest.setRequestHeader('Content-Type', 'application/json');
		myReuest.onreadystatechange = function(){
			if (myReuest.readyState == 4 && myReuest.status == 200){
				var myDate = JSON.parse(myReuest.response);
				renderWorks(myDate);
			}
		}
		myReuest.send();
	};

	/* функция ajax запроса (фильтры) */
	function getHTML(){
		this.classList.add('disabled');
		myReuestHTML.open("GET", "../layout/tabworks.html", true);
		myReuestHTML.setRequestHeader('Content-Type', 'application/html');
		myReuestHTML.onreadystatechange = function(){
			if(myReuestHTML.readyState == 4 && myReuestHTML.status == 200) {
				var myHTML = myReuestHTML.responseText;
				renderHTML(myHTML);
			}
		}
		myReuestHTML.send();
	};

	/* функция вставки html в контейнер */
	function renderHTML(_filters) {
		filterContainer.insertAdjacentHTML('afterBegin', _filters);
		filterWorks();

		var filters = document.getElementById('work-filters');
		var filterItem = filters.getElementsByTagName('li');
		filters.addEventListener('click', function(){
			activeItem(event, filterItem);
		});
	}

	/* функция вставки json-данных в контейнер */
	function renderWorks(dataJson){
		var printHTML = "";                  // вывод на html
		var dataLenght = dataJson.length;    // количетсво всех объектов в файле
		var COUNT = 2;                       // константа, вывод записей при нажатии

		k = dataLenght - n < COUNT ? dataLenght - n: COUNT; 
		for (var i = n; i < n + k; i++) {
			var itemWork = jsonContainer.firstChild.nextSibling.cloneNode(true);
			itemWork.classList.add(dataJson[i].type);
			itemWork.querySelector('.work__img').src = dataJson[i].img;
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

			itemWork.querySelector('.work__author-img').src = dataJson[i].authorImg;
			itemWork.querySelector('.work__author-name').innerHTML = dataJson[i].authorName;
			var wrapItem = document.createElement('div');
			wrapItem.appendChild(itemWork);
			printHTML += wrapItem.innerHTML;

			if (i == dataLenght - 1) {
				btnAjax.classList.add('disabled');
			}
		}
		n += COUNT;

		jsonContainer.insertAdjacentHTML('beforeend', printHTML);
	};

	/* функция фильтрации работ */
	function filterWorks(){
		var workFilter = document.getElementById('work-filters');

		workFilter.addEventListener('click', function(){
			var selectFilter = event.target;
			if (workFilter != selectFilter) {
				for (var i = 0; i < jsonContainer.children.length; i++) {
					jsonContainer.children[i].style = "display: none";
					if (jsonContainer.children[i].classList.contains(selectFilter.dataset.filter)) {
						jsonContainer.children[i].style = "display: block";
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
				aside.style = "left: 0px;";
				homeBefore.style = "left: 0;";
			}
			else {
				aside.style = "left: -600px;";
			}
		} 
		/* меню для девайсов */
		else {
			homeBefore.style = "left: -100%;";
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
		if(window.innerWidth < 680) {
			home.classList.add('mobile');
		}
		else {
			home.classList.remove('mobile');
		}
	}

	/* функция для закрытия мобильного меню */ 
	function closeMobileMenu(){
		if (home.classList.contains('mobile')){
			aside.style = "left: -600px;";
			homeBefore.style = "left: -100%;";
			btnToggle.classList.remove('active');
			main.style = "min-width: 100%; left: -300px;";
		}
	}

	filter.addEventListener('click', getHTML);

	mobileDisplay();

	btnToggle.addEventListener('click', toogleMenu);

	homeBefore.addEventListener('click', function(){
		closeMobileMenu();
	});

	/* событие получения данных */
	btnAjax.addEventListener("click", getJson); 

	/* событие при изменении разришения дисплея */
	window.onresize = function(){
		mobileDisplay();
		isActiveMenu();
	};

	/* событие получения данных при скролле */
	window.onscroll = function(){

		function scrollGetWorks(){
			var windowY = window.pageYOffset + window.innerHeight;
			var containerY = jsonContainer.getBoundingClientRect().bottom + jsonContainer.clientHeight; 
			console.log( "Браузер = ", windowY ,"; "," Контент = ", containerY);
			if (windowY > containerY) {
				getJson();
			}
		};
		
	};


}