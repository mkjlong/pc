$("input").on("keydown",function(event){
    
    const key = event.key.toUpperCase();
    if(key == "ENTER" || event.ctrlKey){
        return;
    }
    if(!/[TIJLOSZ]/.test(key)){
        event.preventDefault();
        return;
    }

    if(this.value.toUpperCase().includes(key)){
        event.preventDefault();
        return;
    }

    if(key == "BACKSPACE"){
        pieces = this.value.toUpperCase().slice(0,-1);
    }else{
        pieces = this.value.toUpperCase() + key;
    }
    
    hasinfo = false
    hasSetup = false
    $("#fumendiv").empty();
    for(const i of Object.keys(collection)){
        
        if(pieces.startsWith(i)){
            hasinfo=true
            console.log(i)
            fumenlist = collection[i]
            console.log(fumenlist)
            if(fumenlist.length>0){
                hasSetup=true
                for(fumen of fumenlist){
                    const container = document.createElement('div');

                    const header = document.createElement('span');
                    const image = document.createElement("img");
                    if(i.length>=6){
                        header.style.color="#FF0000"
                    }
                    header.innerHTML=i
                    image.src = getDataURL(fumen);

                    container.append(header,image)
                    $("#fumendiv").append(container);
                }
            }
            break
        }

    }
    if(!hasSetup & hasinfo){
        $("#fumendiv").html("D:")
    }
})

