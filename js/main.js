		var gridSizeX = 8;
		var gridSizeY = 8;
		var totalBombs = 0;
		var timer = false;
		var timerTimeout;

		function drawPage() {
			var boxContainer = $('#boxContainer');

			//Generate grid.
			for (var y = 0; y < gridSizeY; y++)
				for (var x = 0; x < gridSizeX; x++) {
					var rand = Math.floor(Math.random() * 100);
					//20% chance could generate a bomb on generated square.
					if (rand <= 1) {
						$(boxContainer).append("<div class='box bomb' id='" + x + "," + y + "'></div>");
						totalBombs++;
					} else {
						$(boxContainer).append("<div class='box' id='" + x + "," + y + "'></div>");
					}
				}
			console.log("Total bombs: " + totalBombs);
		}

		function updateBombCounter(){
			let bombCounter = $('#bombCounter');
			let flags = $('.flag').length;
			bombCounter.text("Bombs remaining: " + (totalBombs - flags));
		}

		function updateTimer(){
			timerTimeout = setTimeout(updateTimer, 1000);
			let time = parseInt($('#timer').text());
			$('#timer').text(++time);
		}

		function checkWin() {
			var flags = document.getElementsByClassName("bomb flag");
			var checked = document.getElementsByClassName("box alive");

			console.log("Total flags: " + flags.length);
			console.log("Total checked: " + checked.length);
			console.log("Boxs to check: " + (gridSizeX * gridSizeY - totalBombs));
			if (flags.length == totalBombs && (gridSizeX * gridSizeY - totalBombs) == checked.length){
				alert("You win!");

				reset();
				checkAction();
			}
		}


		function checkBombs(xStart, yStart, box) {
			if (!$(box).hasClass("alive") && !$(box).hasClass("bomb")) {
				var bombCount = 0; //Keep track of bombs around clicked square.

				var xCoord = xStart - 1;
				var yCoord = yStart - 1;

				//Return if checking outside bounds
				if (xStart + 1 > gridSizeX || yStart + 1 > gridSizeY)
					return;

				//Depnding on square clicked, set begining search square 
				if (xStart == 0)
					xCoord++;
				if (yStart == 0)
					yCoord++;

				//Count bombs in three by three square around the clicked square
				for (var x = xCoord; x <= xStart + 1; x++){
					for (var y = yCoord; y <= yStart + 1; y++) {
						var boxElement = document.getElementById(x + "," + y);
						if ($(boxElement).hasClass("bomb"))
							bombCount++;

					}
				}

				$(box).addClass("alive");

				//Add bomb number to box
				$(box).append("<p class='bombCount" + bombCount + "'>" + bombCount + "</p>");

				//If no bombs found in surrounding clicked square, go round each again, and call this function on it.
				if (bombCount == 0) {
					//Set background to green for entirley safe squares
					$(box).css("background-color", "darkgreen");
					for (var x = xCoord; x <= xStart + 1; x++)
						for (var y = yCoord; y <= yStart + 1; y++) {
							var boxElement = document.getElementById(x + "," + y);
							if (!$(boxElement).hasClass("alive"))
								checkBombs(x, y, boxElement);
						}
				}
			}
		}

		function reset(){
			//Clear existing boxContainer
			$("#boxContainer").empty();

			//Timer reset
			clearTimeout(timerTimeout);
			timer = false;
			$('#timer').text("0");

			//Reset bomb count
			totalBombs = 0;

			//Redraw page
			drawPage();
			updateBombCounter();
		}

		function checkAction(){
			//If normal box clicked.
			$(".box").click(function(e) {
				//Start timer if it hasnt been on.
				if (!timer){
					timer = true;
					updateTimer();
				}
				//Shift-click for flag placement
				if (e.shiftKey) {
					if (!$(this).hasClass("alive")) {
						$(this).toggleClass("flag");
						updateBombCounter();
						checkWin();
					}
					return;
				} 
				//if bomb, alert and reset afterward
				if ($(this).hasClass("bomb")){
					$(this).addClass("die");
					alert("You lose!");
					reset();
					checkAction();
				} else {
					//Get coords of square number that was clicked.
					var checkSquare = this.id.split(",");
					
					//Count bombs around clicked square
					checkBombs(parseInt(checkSquare[0]), parseInt(checkSquare[1]), this);
					checkWin();
				}
			});
		}

		//Initial page load
		$(document).ready(function() {
			reset();
			checkAction();
		});