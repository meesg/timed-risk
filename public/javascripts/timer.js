function setTimer(seconds){
    let timeLeft = seconds;
    
    let timeInterval = setInterval(function(){
        timeLeft--;
        
        let minutesLeft = Math.floor(timeLeft/60);
        let secondsLeft = timeLeft%60;
        if(minutesLeft < 10){
            minutesLeft = "0" + String(minutesLeft);
        }
        if(secondsLeft < 10){
            secondsLeft = "0" + String(secondsLeft);
        }

        if(timeLeft === 0){
            clearInterval(timeInterval);
        }

        $('#timer').html(minutesLeft + ":" + secondsLeft);
    }, 1000);
}

setTimer(90);