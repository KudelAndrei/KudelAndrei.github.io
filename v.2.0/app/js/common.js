/* For preloader */
// $(window).on('load', function(){
// 	//$('.preloader').delay(500).fadeOut('slow');
// });

window.onload = function(){
	var myReuest = new XMLHttpRequest();
	var containerjson = document.getElementById("json-work");
	var btn = document.getElementById("btn");
	var n = 0;  // начальное количетсво выведеных элементов
	var k = 0;  // количество выводим данных при вызове функции (проверка на избытие)
	var URL = "https://learnwebcode.github.io/json-example/animals-1.json"; 


	// функция создания ajax зфпроса
	function getJson(){
		myReuest.open("GET", URL, true);
		myReuest.onload = function(){
			if (myReuest.readyState == 4 && myReuest.status == 200){
				var myDate = JSON.parse(myReuest.responseText);
				renderHTML(myDate);
			}
		}
		myReuest.send();
	};

	function renderHTML(dataJson){
		var printHTML = "";                  // вывод на html
		var dataLenght = dataJson.length;    // количетсво всех объектов в файле
		var COUNT = 2;                       // константа, вывод записей при нажатии

		k = dataLenght - n < COUNT ? dataLenght - n: COUNT; 
		for (var i = n; i < n + k; i++) {
			printHTML += "<p> " + dataJson[i].name + ".</p>"; 
		}
		n += COUNT;

		containerjson.insertAdjacentHTML('beforeend', printHTML);
	};

	btn.addEventListener("click", getJson);

}




