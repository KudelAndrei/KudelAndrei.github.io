/******************/ 
// переделать код на промисы!!!!
// добавить тип ajax запроса на json
/******************/ 

window.onload = function(){

	var menuItem = document.getElementById('menu'); // Основное меню
	var myReuest = new XMLHttpRequest(); // ajax запрос на получение данных работы
	var jsonContainer = document.getElementById("json-container"); // контейнер, куда будут ложиться данные json
	var btnAjax = document.getElementById("btn"); // кнопка для получение json данных
	var n = 0;  // начальное количетсво выведеных элементов
	var k = 0;  // количество выводим данных при вызове функции (проверка на избытие)
	var URL = "https://kudelandrei.github.io/v.2.0/app/data/works.json"; 

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
		myReuest.onload = function(){
			if (myReuest.readyState == 4 && myReuest.status == 200){
				var myDate = JSON.parse(myReuest.responseText);
				renderWorks(myDate);
				console.log(_url);
			}
			else {
				console.log(myReuest.readyState, myReuest.status);
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
			printHTML += "<p> " + dataJson[i].name + ".</p>"; 
		}
		n += COUNT;

		jsonContainer.insertAdjacentHTML('beforeend', printHTML);
	};

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