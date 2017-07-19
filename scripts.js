
/* Global Variables */
var totalTime;
var timeRemaining;
var myCounter;
var count = 0;
var isCounting = false;
var isSession = true;
var color = "#5cb85c";
var alarm = new Audio("http://soundbible.com/mp3/Fire_pager-jason-1283464858.mp3");
var sessionMessages = [
  "Get Working!",
  "Back to Work",
  "Keep Hustling",
  "Don't Stop Now!"
];
var breakMessages = [
  "Have a Break",
  "Grab a Coffee",
  "Treat Yo'self!",
  "Rest Up!"
];


/* Main function */
$(document).ready(function() {

  // Initialise
  reset();
  $("#stop").css("opacity", 0.1);

  // Increment or decrement times
  $(".btn").on('click', function() {
    var parent = $(this).parent();
    var child = parent.children(".value");
    var num = child.html();
    if ($(this).hasClass("minus") && num > 1) {
      num--;
      child.html(num);
    } else if ($(this).hasClass("plus") && num < 120) {
      num++;
      child.html(num);
    }
    stop();
  });

  // Start or pause the timer
  $("#start").on('click', function() {
    if(!isCounting) {
      start();
    } else {
      pause();
    }
  });

  // Stop the timer
  $("#stop").on('click', function() {
    stop();
  });

});


/* Helper Functions */
// Resets timer display for next session/break
function reset() {
  clearInterval(myCounter);
  $(".label").html(getMessage());
  if (isSession) {
    color = "#5cb85c";
    totalTime = $("#session").children(".value").html() * 60;
  } else {
    color = "red";
    totalTime = $("#break").children(".value").html() * 60;
  }
  $(".timer").css({
    "background-color": color,
    "border": "1px solid " + color
  });
  count = totalTime;
  timeRemaining = totalTime;
  updateTimer(totalTime);
  updatePie(0);
}

// Stop timer
function stop() {
  if (isCounting) {
    togglePause();
  }
  $("#stop").css({
    "opacity": 0.1,
    "cursor": "default"
  });
  isCounting = false;
  isSession = true;
  reset();
}

// Start timer
function start() {
  if (!isCounting) {
    togglePause();
  }
  $("#stop").css({
    "opacity": 1,
    "cursor": "pointer"
  });
  isCounting = true;
  var startTime = new Date();
  myCounter = setInterval(function () {
    count = Math.round((timeRemaining - ((new Date() - startTime) / 1000)), 0);
    updateTimer(count);
    updatePie(totalTime - count);
    if (count == 0) {
      if (isSession) {
        isSession = false;
      } else {
        isSession = true;
      }
      alarm.play();
      reset();
      start();
      return;
    }
  }, 1000);
}

// Pause timer
function pause() {
  timeRemaining = count;
  clearInterval(myCounter);
  isCounting = false;
  togglePause();
}

// Update circular progress bar
function updatePie (time) {
  var deg;
  if (time < (totalTime / 2)) {
    deg = 90 + (360 * time / totalTime);
    $('.timer').css('background-image', 'linear-gradient('+deg+'deg, transparent 50%, #111 50%),linear-gradient(90deg, #111 50%, transparent 50%)');
  } else if (time >= (totalTime / 2)) {
    deg = -90 + (360 * time / totalTime);
    $('.timer').css('background-image', 'linear-gradient('+deg+'deg, transparent 50%, ' + color + ' 50%),linear-gradient(90deg, #111 50%, transparent 50%)');
  }
}

// Update timer display
function updateTimer (time) {
  var min = 0;
  var sec = 0;
  while (time > 59) {
    min++;
    time -= 60;
  }
  sec = time;
  if (min < 10) {
    min = String("0" + min);
  }
  if (sec < 10) {
    sec = String("0" + sec);
  }
  $("#time").html(min + ":" + sec);
}

// Toggle start/pause icon
function togglePause() {
  if ($("#start").hasClass("fa-pause")) {
    $("#start").removeClass("fa-pause");
    $("#start").addClass("fa-play");
  } else {
    $("#start").removeClass("fa-play");
    $("#start").addClass("fa-pause");
  }
}

// Generate random message
function getMessage() {
  var index = Math.floor((Math.random() * 4) + 1) - 1;
  if (isSession) {
    return sessionMessages[index];
  } else {
    return breakMessages[index];
  }
}
