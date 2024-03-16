[twopiece,pieces] = window.location.search.slice(1).split("|");


update(twopiece,pieces)
function update(twopiece,pieces){
    hasinfo = false
    hasSetup = false
    $("#fumendiv").empty();
    var setups = collection[twopiece]

    if(setups==undefined)return;

    for(const i of Object.keys(setups)){
        if(pieces.startsWith(i)){
            hasinfo=true
            fumenlist = setups[i]
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
}