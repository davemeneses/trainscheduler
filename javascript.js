// document.ready is absolutely necessary for this page to work.
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
  // setting my database variable to always call back to firebase.
  var database = firebase.database();
  // this is a bank of variables I created that I assign value to depending on what the user submits in the form.
  var trainName;
  var trainDestination;
  var firstTrain;
  var trainFrequency;
  var currentTime;

  console.log("CURRENT TIME: " + currentTime);

  // getting value on submit being clicked. I added .trim() just in case the user accidentally added spaces that were not supposed to be there. This was more important for moment than anything else.
  $("#submit").on("click", function() {
    // preventDefault stops the page from continuously being refreshed every time submit is clicked.
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

    // clear out inputs after the user clicks submit and the information has been stored.
    $(".form-control").val("");
    // this pushes all the information I've grabbed from the page to firebase. I also create data classes for firebase to recognize and properly store the information I grabbed from the page and assigned to my variables.
    database.ref().push({
      // first part is the data class in firebase and second part is the variable that is being stored in firebase.
      trainName: trainName,
      trainDestination: trainDestination,
      firstTrain: firstTrain,
      trainFrequency: trainFrequency
    });
  });
  // this is where I grab information from firebase and start to prep to append it back on the page.
  database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
    // this is where I tell firebase to grab values from firebase and reassign the variables I created value.
    trainName = childSnapshot.val().trainName;
    destination = childSnapshot.val().destination;
    firstTrain = childSnapshot.val().firstTrain;
    trainFrequency = childSnapshot.val().trainFrequency;
    // this is where the math comes in when determining the train schedule and frequency.
    // I subract one year from the first train time just to make sure that train comes before the current time the user is  setting. It also sets first train time to military time.
    var firstTrainConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
    // this calculates the difference between current time and firstTrainConverted. The remainder of the equation is the total minutes.
    var difference = moment().diff(moment(firstTrainConverted), "minutes");
    // timeLeft looks takes the total number of minutes and divides it by how often the train runs.
    var timeLeft = difference % trainFrequency;
    // we take how often the train runs, and subtract the timeLeft
    var timeTilNextTrain = trainFrequency - timeLeft;
    // and these last 2 actually give you the amount of time until the next train arrives.
    var nextTrainMeasure = moment().add(timeTilNextTrain, "minutes");
    var nextTrainTime = moment(nextTrainMeasure).format("hh:mm");
    // This just appends all the information we stored in firebase to the page in my #tableBody section.
    $("#tableBody").append(
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
