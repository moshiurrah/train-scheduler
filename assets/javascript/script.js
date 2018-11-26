//Initialize database 
var config = {
	apiKey: "AIzaSyDIejuxVigUO-TVRicFVlQ9Fc3m6Nt3YoI",
	authDomain: "traindatabase-585a5.firebaseapp.com",
	databaseURL: "https://traindatabase-585a5.firebaseio.com",
	projectId: "traindatabase-585a5",
	storageBucket: "traindatabase-585a5.appspot.com",
	messagingSenderId: "106635423336"
};

firebase.initializeApp(config);

var database = firebase.database();

$("#submit").on("click",function(event){
	event.preventDefault();

	//Capture input value
	var trainName = $("#trainName").val().trim();
	var destination = $("#trainDestination").val().trim();
	var firstTrainTime = $("#trainTime").val().trim();
	var frequency = $("#trainFrequency").val().trim();

	if (
	     (trainName.length > 0)&& 
		 (destination.length > 0) && 
		 (firstTrainTime.length > 0) && 
		 (frequency.length >0)
	   )
	{
	//Push values to the Firebase database
		database.ref().push({
			trainName:trainName,
			destination:destination,
			firstTrainTime:firstTrainTime,
			frequency:frequency,
		});

		$("#trainName").val("");
		$("#trainDestination").val("");
		$("#trainTime").val("");
		$("#trainFrequency").val("");

	} else {
		alert("Please fill out all fields")
	};
});

	//Add event listener for every new child created in Firebase database
database.ref().on("child_added",function(snapshot){
 
	//Assign database values to variables
	var sv = snapshot.val();
	var trainName = sv.trainName;
	var destination = sv.destination;
	var firstTrainTime = sv.firstTrainTime;
	var frequency = sv.frequency;

	//Calculate next arrival time and minutes left
	var firstTrainConverted = moment(firstTrainTime,"hh:mm").subtract (1,"years");
	var mdiff = moment().diff(moment(firstTrainConverted),"minutes");
	var minLeft = frequency-(mdiff%frequency);
	var nextTrain = moment().add(minLeft,"minutes");
	var timeFormated = moment(nextTrain).format("hh:mm a");
	
	console.log("in child_added snapshot is");
	console.log(snapshot);
	console.log("end snapshot");
	//add a new train row 
	$("#train-input > tbody").prepend ("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +  frequency + "</td><td>" + timeFormated + "</td><td>" + minLeft + ' minutes'+ "</td></tr>");
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});
