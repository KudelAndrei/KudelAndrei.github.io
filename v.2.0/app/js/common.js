/******************/ 
// переделать код на промисы!!!!
/******************/ 

window.onload = function(){

	var menuItem = document.getElementById('menu'); // Основное меню
	var myReuest = new XMLHttpRequest(); // ajax запрос на получение данных работы
	var jsonContainer = document.getElementById("works"); // контейнер, куда будут ложиться данные json
	var btnAjax = document.getElementById("work-ajax"); // кнопка для получение json данных
	var toggleMenu = document.getElementById('toggle-menu');
	var n = 0;  // начальное количетсво выведеных элементов
	var k = 0;  // количество выводим данных при вызове функции (проверка на избытие)
	var URL = "../data/works.json"; 

	/* функция активного пункта меню */
	menuItem.addEventListener('click', function(event) {
		var menu = document.getElementById('menu').getElementsByTagName('li');
		var thisMenuItem = event.target.parentNode;
		event.preventDefault();
		for(var i = 0; i < menu.length; i++){
			menu[i].classList.remove('active');
		}
		thisMenuItem.classList.add('active');
		//getMenuLine(event.target);
	});

	/* функция для плавающей линии */
	// function getMenuLine(event){
	// 	var line = document.getElementById('menu-line');
	// 	var menuItemPos = event.getBoundingClientRect().top - 163.5;
	// 	line.style.top = menuItemPos + 'px';
	// 	console.log(menuItemPos);
	// }

	/* функция создания ajax зфпроса */
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

	/* функция открытия или скрытия меню */ 

	/* функция открытия или закрытия меню */
	function toogleMenu(){
		var aside = document.getElementById('aside');
		var main = document.getElementById('main');
		this.classList.toggle('active');

		if (this.classList.contains('active')){
			aside.style.left = "-700px";
			main.style = "min-width: 100%; left: -300px;";
		} else {
			aside.style.left = "0px";
			main.style = "min-width: auto; left: 0;";
		}

	}

	toggleMenu.addEventListener('click', toogleMenu);

	/* событие получения данных */
	btnAjax.addEventListener("click", getJson); //при нажатии 

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