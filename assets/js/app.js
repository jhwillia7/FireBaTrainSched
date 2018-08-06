$(document).ready(function () {
    
    // Initialize Firebase - db for trainschedule
    var config = {
        apiKey: "AIzaSyA2pV5Humqrh61u3tBtq504n9TLYYac5Mw",
        authDomain: "jhwillia7-fireb-trainshedule.firebaseapp.com",
        databaseURL: "https://jhwillia7-fireb-trainshedule.firebaseio.com",
        projectId: "jhwillia7-fireb-trainshedule",
        storageBucket: "jhwillia7-fireb-trainshedule.appspot.com",
        messagingSenderId: "78149783740"
    };
    firebase.initializeApp(config);

//Initial Values Global
var trainName;
var destination;
var frequency;
var first;
var calcNext = 0;
var calcMinutesAway = 0;
//These three variables were needed to capture edit functionality to the page
var change = $("#submit").text();
var key;
var i = 1;
var countDown = 61;
var intervalId;
// Create a variable to reference the database
var database = firebase.database();

// The add data functionality is here.
$("#submit").on("click", function () {
    event.preventDefault();
    // Get the inputed values
    trainName = $("#formTrain").val().trim();
    destination = $("#formDestination").val().trim();
    first = $("#formFirst").val().trim();
    frequency = parseInt($("#formFrequency").val().trim());
    if (change === "Submit") {
        // Save the new data in Firebase
        database.ref().push({
            trainName: trainName,
            destination: destination,
            first: first,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });//End push    
    }
    if (change === "Edit") {
        // Update existing node in Firebase
        database.ref(key).update({
            trainName: trainName,
            destination: destination,
            first: first,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });//End update     
        //Refresh the page
        location.reload();
    }

    //Clear the values from the form
    clearForm();
});//End submit

// Project listener to when new data is added to DB is here.
database.ref().on("child_added", function (childSnapshot) {
    trainName = childSnapshot.val().trainName;
    destination = childSnapshot.val().destination;
    first = childSnapshot.val().first;
    frequency = childSnapshot.val().frequency;
    dateAdded = childSnapshot.val().dateAdded;
    var key = childSnapshot.key;
    var tBody = $("tbody");
    var tRow = $("<tr>");

    //Call the function to calculate minutes until next train and next train times
    timeCalc();

    // Methods run on jQuery selectors return the selector they were run on
    // This is why we can create and save a reference to a td in the same statement we update its text
    var trainTd = $("<td>").text(trainName).attr("id", "trainName" + i);
    var destinationTd = $("<td>").text(destination).attr("id", "destination" + i);
    var freqencyTd = $("<td>").text(frequency).attr("id", "frequency" + i);
    var nextArrival = $("<td>").text(calcNext).attr("id", "first" + i).attr("val", first);
    var minutesAway = $("<td>").text(calcMinutesAway);
    var updateBtn = $("<button>").text("Edit").attr("id", i).addClass("editBtn").attr("dataKey", key).addClass("btn-primary");
    var deleteBtn = $("<button>").text("Delete").attr("id", key).addClass("deleteBtn").addClass("btn-primary");
    // Append the newly created table data to the table row
    tRow.append(trainTd, destinationTd, freqencyTd, nextArrival, minutesAway, updateBtn, deleteBtn);
    // Append the table row to the table body
    tBody.append(tRow);
    i++;
});//End ChildAdded 


function timeCalc() {
    // Taken directly from in class assignment
    // First Time (did not use the pushed back 1 year, when I experimented with this my times were not what was expected)
    var firstTimeConverted = moment(first, "HH:mm");
    // Current Time
    var currentTime = moment();
    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    // Minute Until Train
    calcMinutesAway = frequency - tRemainder;
    // Next Train
    calcNext = moment().add(calcMinutesAway, "minutes");
    calcNext = moment(calcNext).format('LT');
}

function clearForm() {
    $("#formTrain").val("");
    $("#formDestination").val("");
    $("#formFirst").val("");
    $("#formFrequency").val("");
};

$("body").on("click", ".editBtn", function () {
    event.preventDefault();
    var myRow = this.id;
    key = $(this).attr("dataKey");
    change = "Edit";
    $("#panelTrain").text("Edit Existing Train");
    $("#submit").text(change);
    $("#submit").val(key);
    trainName = $("#trainName" + myRow).text();
    destination = $("#destination" + myRow).text();
    first = $("#first" + myRow).text();
    console.log(first);
    frequency = $("#frequency" + myRow).text();
    
    console.log(trainName);
    console.log(destination);
    console.log(frequency);
    console.log(first);

    $("#formTrain").val(trainName);
    $("#formDestination").val(destination);
    $("#formFirst").val(first);
    $("#formFrequency").val(frequency);

});

$("body").on("click", ".deleteBtn", function () {
    event.preventDefault();
    database.ref().child(this.id).remove();
    location.reload();
});

$("body").on("click", "#clear", function () {
    event.preventDefault();
    clearForm();
    change = "Submit";
    $("#submit").text(change);
    $("#panelTrain").text("Add New Train");
    $("#formFirst").attr("type", "time");
});

//Add timer countdown logic
run();

function run() {
    if (intervalId) {
        clearInterval(intervalId);
    }
    intervalId = setInterval(decrement, 1000);
}

function decrement() {
    countDown--;
    $("#timer").html("<p> Page will refresh in " + countDown + " seconds</p>");
    if (countDown === 0) {
        location.reload();
    }
}


}); //End document ready