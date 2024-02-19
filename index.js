const converter = new showdown.Converter();

let pcNum = 1;
let set = JSON.parse(localStorage.getItem("set")) ?? defaultSet;



function setSet(pcNum,setName = set[pcNum-1]){
    set[pcNum-1] = setName;
    try{
        document.getElementsByTagName("iframe")[0].src = sets[pcNum-1][set[pcNum-1]]

    }catch{
        console.log("NO!!");
    }
    localStorage.setItem("set",JSON.stringify(set))
    $("#set").html(setName);
}


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
    setSet(pcNum)
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
})

setPC(pcNum);




//change the set when the user wants to
$("#set").on("click",function(event){
    setSet(pcNum,Object.keys(sets[pcNum-1])[(Object.keys(sets[pcNum-1]).indexOf(set[pcNum-1]) + 1) % Object.keys(sets[pcNum-1]).length])
})



$("#search > input").on("keydown",function(event){
    const key = event.key.toUpperCase();
    if(key == "ENTER" || event.ctrlKey){
        return;
    }
    if(!/[TIJLOSZ]/.test(key)){
        event.preventDefault();
        return;
    }

    if(key == "BACKSPACE"){
        pieces = this.value.toUpperCase().slice(0,-1);
    }else{
        pieces = this.value.toUpperCase() + key;
    }

    setPC([1,3,5,7,2,4,6,1][pieces.length])

    sorted_pieces = pieces.split('').sort((a,b)=>{
        return ["T","I","J","L","O","S","Z"].indexOf(a) < ["T","I","J","L","O","S","Z"].indexOf(b) ? -1 : 1
    }).join('')
    fetch(`./${pcNum}/${sorted_pieces}.md`).then(res=>{
        res.text().then(text=>{
            new_html = converter.makeHtml(text)
            
            new_html = new_html.replace(/(v115@[a-zA-Z0-9\?\/]+)/gi,function(fumen){
                console.log(fumen);
                return `<img class = fumen fumen = ${fumen} src = ${getDataURL(fumen)}>`
            })
            new_html = new_html.replace(/\{([TIJLOSZ])\}/gi,"<span class = 'piece $1'>$1</span>")

            $("#content").html(new_html)
        })
    })

})

$("#search > input").focus();