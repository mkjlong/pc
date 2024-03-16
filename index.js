const converter = new showdown.Converter();

let pcNum = Number(localStorage.getItem("pcNum")) ?? 1;


function setPC(num){
    num = Number(num);
    if(num <= 0){
        pcNum = 7; // loop back to 7th pc
    }else if(num >= 8){
        pcNum = 1; // loop around to 1st PC. (ignore 8th for now)
    }else{
        pcNum = num;
    }
    $("#title").html(`${['','first','second','third','fourth','fifth','sixth','seventh'][pcNum]} PC`)
    localStorage.setItem("pcNum",pcNum);
    //console.log(`User set pc to ${pcNum}`);
}

//When the user presses keys 1-7, it will take them to the desired PC

document.addEventListener("keyup", function(event) {
    key = event.key;

    //The key pressed is not a number between 1 and 7.
    if(isNaN(key) || !Number(key) || Number(key) > 7)return;
    
    setPC(key);
})

//When the user presses the < and > buttons, it will increase/decrease pc num

$(".changePC").on(`click`,function(event){

    //if the button pressed is ">", increase pcNum. otherwise decrease
    const shift = this.innerHTML == '&lt;'?-1:1;

    setPC(pcNum+shift);
    document.getElementById("ifr").src = `./${pcNum}/index.html`
})

$("#search > input").on("keydown",function(event){
    const key = event.key.toUpperCase();
    if(key == "ENTER" || event.ctrlKey){
        return;
    }
    if(!/[TIJLOSZ\|\-]/.test(key)){
        event.preventDefault();
        return;
    }

    

    if(this.value.toUpperCase().split("|")[this.value.toUpperCase().split(/[\|\-]/).length-1].includes(key)){
        if(window.getSelection && window.getSelection().type === 'Range'){
            if(!window.getSelection().toString().includes(key)){
                event.preventDefault();
            }
        }else{
            event.preventDefault();
        }
        return;
    }

    if((this.value.toUpperCase().includes("|") || this.value.toUpperCase().includes("-")) && (key == "|"||key=="-"))event.preventDefault();
})

$("#search > input").on("input",function(e){
    queue = this.value.toUpperCase().split(/[\|\-]/);
    setPC([1,3,5,7,2,4,6,1][queue[0].length])
    document.getElementById("ifr").src = `./${pcNum}/index.html?${queue.join("|")}`

})

$("#search > input").focus();

setPC(pcNum);
document.getElementById("ifr").src = `./${pcNum}/index.html`