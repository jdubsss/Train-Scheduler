/*this is an app for users to add train schedules to a table

user enters in:
	train name
	train destination
	the first train of the day
	frequency of train

this data will get stored in a variable 

data will be stored into the firebase database

a new row will be made each time a user enters new train data

*/

// ------Initialize Firebase. code from Firebase
  var config = {
    apiKey: "AIzaSyD_s0VrolzpjgddSR8PdFpQ3Y1nS3PARZw",
    authDomain: "train-schedule-8352c.firebaseapp.com",
    databaseURL: "https://train-schedule-8352c.firebaseio.com",
    projectId: "train-schedule-8352c",
    storageBucket: "train-schedule-8352c.appspot.com",
    messagingSenderId: "484690024687"
  };
  firebase.initializeApp(config);

var database = firebase.database();

// -----Button for adding trains
$("#add-train-btn").on("click", function (event) {
	event.preventDefault(); 

	// Grabs user input
	var trainName = $("#train-name-input").val().trim();
	var trainDestination = $("#destination-input").val().trim();
	var trainTime = moment($("#first-train-input").val(), "HH:mm").format("HH:mm"); //.trim() wasnt working for me. i got errors in console
	var trainFrequency = $("#frequency-input").val().trim();

	// Create object to hold train data this links to firebase as the data in firebase is in object format
	var newTrain = {
		name: trainName,
		destination: trainDestination,
		time: trainTime,
		frequency: trainFrequency
	};

	// Uploads train data to the database. pushes train data into the object above
	database.ref().push(newTrain);

	// test to make sure it works
	console.log("Train Name: " + newTrain.name);
	console.log("Destination: " + newTrain.destination);
	console.log("First Train: " + newTrain.time);
	console.log("Frequency: " + newTrain.frequency);



	// Clears all of the input boxes
	$("#train-name-input").val("");
	$("#destination-input").val("");
	$("#first-train-input").val("");
	$("#frequency-input").val("");


});

// -------Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (snapshot) {

	console.log(snapshot.val());

	// Store train data into a variable. This is for firebase.
	var trainName = snapshot.val().name;
	var trainDestination = snapshot.val().destination;
	var trainTime = snapshot.val().time;
	var trainFrequency = snapshot.val().frequency;

	// test to make sure it works
	console.log(trainName);
	console.log(trainDestination);
	console.log(trainTime);
	console.log(trainFrequency);

	//take user entered time and convert from unix to reg time format
	var firstTrainTimeConverted = moment(trainTime, "HH:mm");

	//convert onto minutes to calcualte time remaining

	//moment() takes curent time and find difference from next time train comes
	var timeDifference = moment().diff(moment(firstTrainTimeConverted), "minutes");
	var timeRemaining = timeDifference % trainFrequency;

	//calculate the minutes to the next train arrival
	var minToNextTrain = trainFrequency - timeRemaining;
	var nextTrain = moment().add(minToNextTrain, "minutes").format("hh:mm A");

	//HH is for  military time? hh is for standard time format
	// A is for am and pm



	// Add each trains's data into the table as a new row inside  train-table
	$("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" +
		trainFrequency + "</td><td>" + nextTrain + "</td><td>" + minToNextTrain + "</td></tr>");
});

