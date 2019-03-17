$(document).ready(function() {
  // Initialize Firebase this is what links all my stuff to my firebase database and ensures that all the train information is stored there and not cleared every time the user refreshes
  var config = {
    apiKey: "AIzaSyC7IjADcGnaZLYVaUe1oWHNYqU_sc5peRg",
    authDomain: "trainschedule-c727a.firebaseapp.com",
    databaseURL: "https://trainschedule-c727a.firebaseio.com",
    projectId: "trainschedule-c727a",
    storageBucket: "trainschedule-c727a.appspot.com",
    messagingSenderId: "987543113432"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  var trainName;
  var trainDestination;
  var firstTrain;
  var trainFrequency;
  var currentTime;

  console.log("CURRENT TIME: " + currentTime);

  // getting value on submit being clicked. I added .trim() just in case the user accidentally added spaces that were not supposed to be there. This was more important for moment than anything else.
  $("#submit").on("click", function() {
    event.preventDefault();
    trainName = $("#inputName")
      .val()
      .trim();
    trainDestination = $("#inputDestination")
      .val()
      .trim();
    firstTrain = $("#inputTime")
      .val()
      .trim();
    trainFrequency = $("#inputFrequency")
      .val()
      .trim();
    currentTime = moment()
      .format("hh:mm")
      .trim();

    console.log(trainName, trainDestination, firstTrain, trainFrequency);

    // calculate when next train will arrive, relative to current time

    // clear out inputs
    $(".form-control").val("");

    database.ref().push({
      trainName: trainName,
      trainDestination: trainDestination,
      firstTrain: firstTrain,
      trainFrequency: trainFrequency
    });
  });

  database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());

    trainName = childSnapshot.val().trainName;
    destination = childSnapshot.val().destination;
    firstTrain = childSnapshot.val().firstTrain;
    trainFrequency = childSnapshot.val().trainFrequency;

    var firstTrainConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
    // difference between current time and firstTrainConverted
    var difference = moment().diff(moment(firstTrainConverted), "minutes");
    var timeLeft = difference % trainFrequency;
    var timeTilNextTrain = trainFrequency - timeLeft;
    var nextTrainMeasure = moment().add(timeTilNextTrain, "minutes");
    var nextTrainTime = moment(nextTrainMeasure).format("hh:mm");

    $("#table-body").append(
      "<tr>" +
        "<td>" +
        trainName +
        "</td>" +
        "<td>" +
        trainDestination +
        "</td>" +
        "<td>" +
        trainFrequency +
        "</td>" +
        "<td>" +
        nextTrainTime +
        "</td>" +
        "<td>" +
        timeTilNextTrain +
        "</td>" +
        "</tr>"
    );
  });
});
