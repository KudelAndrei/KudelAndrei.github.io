/******************/ 
// переделать код на промисы!!!!
/******************/ 

window.onload = function(){

	var menuItem = document.getElementById('menu'); // Основное меню
	var myReuest = new XMLHttpRequest(); // ajax запрос на получение данных работы
	var jsonContainer = document.getElementById("works"); // контейнер, куда будут ложиться данные json
	var btnAjax = document.getElementById("work-ajax"); // кнопка для получение json данных
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
			else {
				/* придумать как остановить запрос, если нету данных */
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
			var itemWork = jsonContainer.firstChild.nextSibling.cloneNode(true);
			itemWork.querySelector('.work__img').src = dataJson[i].img;
			itemWork.querySelector('.work__type').innerHTML = dataJson[i].type;
			itemWork.querySelector('.work__date').innerHTML = dataJson[i].date;
			itemWork.querySelector('.work__head').innerHTML = dataJson[i].head;
			itemWork.querySelector('.work__desc').innerHTML = dataJson[i].desc;
			for(var j = 0; j < dataJson[i].tag.lenght; j++){
				itemWork.querySelector('.work__tags').appendChild(document.createElement('li'));
			}
			var wrapItem = document.createElement('div');
			wrapItem.id = 'work__item-' + i;
 			wrapItem.appendChild(itemWork);
			//itemWork.getElementsByClassName('work__type').innerHTML;

			// var div = document.createElement("div");
			// var workItem = div.className("work__item");
			// workItem.innerHTML = 'sefsefsef';
			// var image = "<div class='work__img'><img src=" + dataJson[i].img + "></img></div>";
			// var tag = "<h3 class='work__head'>" + dataJson[i].head + "</h2>";
			// var content = document.createElement('div');
			printHTML += wrapItem.innerHTML;

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