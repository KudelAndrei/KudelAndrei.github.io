/******************/ 
// переделать код на промисы!!!!
/******************/ 

window.onload = function(){

	var menuItem = document.getElementById('menu'); // Основное меню
	var myReuest = new XMLHttpRequest(); // ajax запрос на получение данных работы
	var jsonContainer = document.getElementById("works"); // контейнер, куда будут ложиться данные json
	var btnAjax = document.getElementById("work-ajax"); // кнопка для получение json данных
	var btnToggle = document.getElementById('toggle-menu'); // кнопка для открытия/закрытия паели с меню
	var home = document.getElementById('home'); // для мобильников
	var homeBefore = document.getElementById('home-before');
	var aside = document.getElementById('aside');
	var main = document.getElementById('main');
	var n = 0;  // начальное количетсво выведеных элементов
	var k = 0;  // количество выводим данных при вызове функции (проверка на избытие)
	var URL = "https://github.com/KudelAndrei/kudelandrei.github.io/blob/master/v.2.0/dist/data/works.json"; 

	/* функция активного пункта меню */
	menuItem.addEventListener('click', function(event) {
		var menu = document.getElementById('menu').getElementsByTagName('li');
		var thisMenuItem = event.target.parentNode;
		event.preventDefault();
		closeMobileMenu();
		for(var i = 0; i < menu.length; i++){
			menu[i].classList.remove('active');
		}
		thisMenuItem.classList.add('active');
	});

	/* функция создания ajax зфпроса */
	function getJson(){
		myReuest.open("GET", "https://github.com/KudelAndrei/kudelandrei.github.io/blob/master/v.2.0/dist/data/works.json", true);
		myReuest.setRequestHeader('Content-Type', 'application/json');
		myReuest.onreadystatechange = function(){
			if (myReuest.readyState == 4 && myReuest.status == 200){
				var myDate = JSON.parse(myReuest.response);
				renderWorks(myDate);
			}
		}
		myReuest.send();
	};

	/* функция вставки json-данных в контейнер */
	function renderWorks(dataJson){
		var printHTML = "";                  // вывод на html
		var dataLenght = dataJson.length;    // количетсво всех объектов в файле
		var COUNT = 2;                       // константа, вывод записей при нажатии

		k = dataLenght - n < COUNT ? dataLenght - n: COUNT; 
		for (var i = n; i < n + k; i++) {
			var itemWork = jsonContainer.firstChild.nextSibling.cloneNode(true);
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