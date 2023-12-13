var fumen = "v115@vhAAgH"
var height = 4
var piece = 8


board_states = ["v115@vhAAgH"]

element = document.getElementById("board")

element.src = getDataURL(fumen, height)


board.onmousemove = board.onmousedown = function(event) {
    if(event.buttons == 1){//PLACE
        const x = Math.floor((event.pageX - this.parentElement.offsetLeft + this.width/2)/22);
        const y = (height-1) - Math.floor((event.offsetY - 22/5)/22);
        if(y>=height)return;
        if(x>9)return;
        if(x<0)return;
        if(y<0)return;
        const index = y*10 + x;

        field = decoder.decode(fumen)
        console.log(`(${x},${y})`)
        field[0]._field.field.pieces[index] = piece
        console.log(field[0]._field.field);
        fumen = encoder.encode(field);
        element.src = getDataURL(fumen, height)
    }else if(event.buttons==2){//DESTROY
        const x = Math.floor((event.pageX - this.parentElement.offsetLeft + this.width/2)/22);
        const y = (height-1) - Math.floor((event.offsetY - 22/5)/22);
        if(y>=height)return;
        if(x>9)return;
        if(x<0)return;
        if(y<0)return;
        const index = y*10 + x;
        field = decoder.decode(fumen)
        field[0]._field.field.pieces[index] = 0
        fumen = encoder.encode(field);
        if(fumen != board_states[board_states.length-1]){
            element.src = getDataURL(fumen, height)
        }

    }
}

board.onmouseup = function(event){
    if(fumen != board_states[board_states.length-1]){
        board_states.push(fumen)
    }
}


board.oncontextmenu=function(e){
    e.preventDefault();
}

$("body").on("keydown",function(e){
    if(e.key.toLowerCase() == "z" && e.ctrlKey){
        if(board_states.length>1){
            board_states.pop()
            fumen = board_states[board_states.length-1]
            element.src = getDataURL(fumen, height)
        }
    }else if(e.key=="Delete"){
        fumen = "v115@vhAAgH"
        board_states.push(fumen)
        element.src = getDataURL(fumen, height)   
    }else if(e.key.toLowerCase()=="c"){
        if(e.ctrlKey || e.metaKey){//copy image
            sliceSize = 512
            dataurl = board.src.split(",")[1]
            console.log(board.src)
            let byteCharacters = atob(dataurl)
            let byteArrays = []
            for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                let slice = byteCharacters.slice(offset, offset + sliceSize)
                let byteNumbers = new Array(slice.length);
                for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i)
                }
                var byteArray = new Uint8Array(byteNumbers)
                byteArrays.push(byteArray)
            }
            blob = new Blob(byteArrays, {type: 'image/png'})
            navigator.clipboard.write([new ClipboardItem({'image/png': blob})])
        }else{//copy fumen
            navigator.clipboard.writeText(fumen)
        }
    }
})


$(".mino_select").on("click",function(e){
    const element = this;
    $(".mino_select").each(function(){
        if(this != element){
            this.setAttribute("active",0)
        }
    })

    if(this.getAttribute("active") == 0){
        this.setAttribute("active",1)
        piece = Number(this.getAttribute("pieceid"))
    }else{
        this.setAttribute("active",0)
        piece = 8
    }
    console.log(this);
})