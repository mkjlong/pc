//When the user presses keys 1-7, it will take them to the desired PC
document.addEventListener("keyup", function(event) {
    const pcNum = event.key;

    //The key pressed is not a number between 1 and 7.
    if(isNaN(pcNum) || Number(pcNum) > 7)return;
    
    console.log(pcNum);
})


