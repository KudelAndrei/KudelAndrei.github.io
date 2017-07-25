/******************/ 
// переделать код на промисы!!!!
// добавить тип ajax запроса на json
/******************/ 

window.onload = function(){

	var menuItem = document.getElementById('menu');
	var myReuest = new XMLHttpRequest();
	var jsonContainer = document.getElementById("json-container");
	var btn = document.getElementById("btn");
	var n = 0;  // начальное количетсво выведеных элементов
	var k = 0;  // количество выводим данных при вызове функции (проверка на избытие)
	var URL = "https://kudelandrei.github.io/v.2.0/app/data/works.json"; 

	menuItem.addEventListener('click', function(event) {
		event.preventDefault();
		console.log('click');
	});

	// функция создания ajax зфпроса
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

	btn.addEventListener("click", getJson); //при нажатии 

	// при скроле
	window.onscroll = function(){
		var windowY = window.pageYOffset + window.innerHeight;
		var containerY = jsonContainer.getBoundingClientRect().bottom + jsonContainer.clientHeight; 
		console.log( "Браузер = ", windowY ,"; "," Контент = ", containerY);
		if (windowY > containerY) {
			getJson();
		}
	};

}