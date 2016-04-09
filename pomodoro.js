angular.module('pomoApp', [])
.filter('timeFilter', function() {
  return function(secondsLeft) {
    var hours = Math.floor(secondsLeft / 3600);
    var minutes = ("0" + Math.floor((secondsLeft - hours * 3600) / 60)).slice(-2);
    var seconds = ("0" +(secondsLeft - (minutes * 60))).slice(-2);
    if (hours == 0) {
      return minutes + ':' + seconds;
    } else {
      return hours + ':' + minutes + ':' + seconds;
    };
  };
})
.controller('PomodoroController', ['$scope', '$interval', function($scope, $interval) {
  
  $scope.modifyTime = function(timeSet, workOrBreak, timeDiff) {
    var time = timeSet;
    if (angular.isDefined(timer)) {
      return;
    } else if (time + timeDiff < 0) {
      time = 0;
    } else {
      time += timeDiff;
    };
    if (workOrBreak === "work") {
      $scope.timerParts.workTime = time;
      $scope.timerParts.workTimeLeft = time * 60;      
    } else {
      $scope.timerParts.breakTime = time;
      $scope.timerParts.breakTimeLeft = time * 60;
    };
    if ($scope.timerParts.workTimeLeft > 0) {
      $scope.timerParts.timeLeft = $scope.timerParts.workTimeLeft;
      $scope.updateStyle("work", $scope.timerParts.workTime, $scope.timerParts.workTimeLeft);
    } else {
      $scope.timerParts.timeLeft = $scope.timerParts.breakTimeLeft;
      $scope.updateStyle("break", $scope.timerParts.breakTime, $scope.timerParts.breakTimeLeft);
    }
  };
  
  var timer;
  $scope.startTimer = function(){
    if (angular.isDefined(timer)) {
      return;
    } else {
      timer = $interval(function() {
        if ($scope.timerParts.workTimeLeft <= 0 && $scope.timerParts.breakTimeLeft == $scope.timerParts.breakTime * 60) {
          $scope.timerParts.breakTimeLeft--;
          $scope.timerParts.timeLeft = $scope.timerParts.breakTimeLeft;
        } else if ($scope.timerParts.workTimeLeft <= 0 && $scope.timerParts.breakTimeLeft > 0) {
          $scope.timerParts.breakTimeLeft--;
          $scope.timerParts.timeLeft = $scope.timerParts.breakTimeLeft;
          $scope.updateStyle("break", $scope.timerParts.breakTime, $scope.timerParts.breakTimeLeft);
        } else if ($scope.timerParts.workTimeLeft == 0 && $scope.timerParts.breakTimeLeft == 0) {
          $scope.timerParts.breakTimeLeft = $scope.timerParts.breakTime * 60;
          $scope.timerParts.workTimeLeft = $scope.timerParts.workTime * 60;
        } else {
          $scope.timerParts.workTimeLeft--;
          $scope.timerParts.timeLeft = $scope.timerParts.workTimeLeft;
          $scope.updateStyle("work", $scope.timerParts.workTime, $scope.timerParts.workTimeLeft);
      };
      }, 1000);
    };
  };
  
  $scope.updateStyle = function(style, total, remaining) {
    var percentage = (100 - Math.floor((remaining / (total*60))*100)) + "%";
    var color1;
    var color2;
    if (style == "work") {
      color1 = "black ";
      color2 = "white ";
    } else {
      color1 = "white ";
      color2 = "black ";
    };
    var css = {"background" : "linear-gradient(0deg, " + color1 + percentage + ", " + color2 + percentage + ")"};
    $scope.timerParts.style = css;
  };
  
  $scope.pause = function() {
    $interval.cancel(timer);
    timer = undefined;
  };
  
  $scope.reset = function() {
    $scope.pause();
    $scope.modifyTime($scope.timerParts.breakTime, "break", 0);
    $scope.modifyTime($scope.timerParts.workTime, "work", 0);
  };
  
  $scope.timerParts = {
    "workTime" : 25,
    "breakTime" : 5,
    "workTimeLeft" : 25 * 60,
    "breakTimeLeft" : 5 * 60,
    "timeLeft" : 25 * 60,
    "style" : {
      "background" : "linear-gradient(0deg, black, 0deg, white)"
    }
  };
  
}]);