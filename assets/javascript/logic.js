var config = {
    apiKey: "AIzaSyC6JFpFqezsOQtOZm6hw0kUz3eGsht89vc",
    authDomain: "rps-multiplayer-2f628.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-2f628.firebaseio.com",
    projectId: "rps-multiplayer-2f628",
    storageBucket: "rps-multiplayer-2f628.appspot.com",
    messagingSenderId: "340951436611"
};
	firebase.initializeApp(config);

var database = firebase.database();

var inputsValid;

database.ref().on("child_added", function(snapshot) {

	var trainNameCol = snapshot.val().name;
	var destinationCol = snapshot.val().dest;
	var frequencyCol = snapshot.val().freq;
	var nextArrivalCol;
	var minutesAwayCol;

	var firstTimeConverted = moment(snapshot.val().firstTime, "hh:mm").subtract(1, "years");

	var currentTime = moment();

	var difference = moment().diff(moment(firstTimeConverted), "minutes");

	var remainder = difference % snapshot.val().freq;

	minutesAwayCol = snapshot.val().freq - remainder;

	nextArrivalCol = currentTime.add(minutesAwayCol, "minutes");

	$("tbody").append("<tr><td>" + trainNameCol + "</td><td>" + destinationCol + "</td><td>" + frequencyCol + "</td><td>" + moment(nextArrivalCol).format("hh:mm") + "</td><td>" + minutesAwayCol + "</td></tr>");


});

function validateInputs() {

	var timeArray = ($("#firstTrainTimeInput").val().trim()).split();
	console.log(timeArray);

	if (parseInt($("#frequencyInput").val().trim()) === NaN) {
		console.log("Not a number");
	}

	if ($("#trainNameInput").val().trim() !== "" && $("#destinationInput").val().trim()!== "" && $("#firstTrainTimeInput").val().trim() !== "" && $("#frequencyInput").val().trim() !== 0) {

		if ($("#frequencyInput").val().trim() === NaN || $("#frequencyInput").val().trim() < 1 || $("#frequencyInput").val().trim() > 59) {

			$("#inputsCommentary").addClass("shown");
			$("#inputsCommentary").text("Please enter a valid frequency (number of minutes between 0 and 60)");

		}

		//else if (timeArray.length !== 5 || {



		//}
		
		else {

			$("#inputsCommentary").removeClass("shown");
			$("#inputsCommentary").addClass("hidden");
			inputsValid = true;

		}

	}
	
	else {

		$("#inputsCommentary").addClass("shown");
		$("#inputsCommentary").text("Please fill in all fields");
		$("input").each(function() {
			if ($(this).val() === "") {
				$(this).addClass("empty");
			}
		});

	}

}

$(document).ready(function() {

	$("#addBtn").on("click", function(e) {

		e.preventDefault();

		validateInputs();

		if (inputsValid === true) {

			var trainName = $("#trainNameInput").val().trim();
			var destination = $("#destinationInput").val().trim();
			var firstTrainTime = $("#firstTrainTimeInput").val().trim();
			var frequency = $("#frequencyInput").val().trim();

			var newTrain = {
				name: trainName,
				dest: destination,
				firstTime: firstTrainTime,
				freq: frequency
			};

			database.ref().push(newTrain);

			$("#trainNameInput").val("");
			$("#destinationInput").val("");
			$("#firstTrainTimeInput").val("");
			$("#frequencyInput").val("");

		}

		inputsValid = false;

	});

}); 