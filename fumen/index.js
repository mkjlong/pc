if(window.location.search){
    fumen = window.location.search.slice(1)
    try {
        decoder.decode(fumen);
    } catch (error) {
        fumen = "v115@vhAAgH"
    }
}else{
    fumen = "v115@vhAAgH"
}

var height = 4
var piece = 8
var page_number = 0;
var lock = true;

var board_states = ["v115@vhAAgH"]
var previous_board_state = "v115@vhAAgH"
var field = decoder.decode(fumen);
var board = field[page_number]._field.field.pieces;

element = document.getElementById("board")

element.src = getDataURL(fumen, height)


var auto_pieces = []

function mode(arr){
    counts = {}
    arr.forEach(function(e) {
        if(counts[e] === undefined) {
            counts[e] = 0
        }
        counts[e] += 1
    })
    return counts;
}


element.onmousemove = element.onmouseover = element.onmousedown = function(event) {
    if(event.buttons == 1){//PLACE
        const x = Math.floor((event.pageX - this.parentElement.offsetLeft + this.width/2)/22);
        const y = (height-1) - Math.floor((event.offsetY - 22/5)/22);
        if(y>=height || x > 9 || x < 0 || y < 0)return;
        const index = y*10 + x;
        if(board[index] == piece) return;
        const coords = [x,y]
        if(auto_pieces.length==4)return;
        temp_pieces = auto_pieces.concat([coords]).map(JSON.stringify).filter((e,i,a) => i === a.indexOf(e)).map(JSON.parse)
        
        if(temp_pieces.length>4){
            
            event.preventDefault();
            return;
        }
        auto_pieces.push(coords);
        auto_pieces = auto_pieces.map(JSON.stringify).filter((e,i,a) => i === a.indexOf(e)).map(JSON.parse)
        if(auto_pieces.length == 4){
            xlist = auto_pieces.map(e=>e[0])
            ylist = auto_pieces.map(e=>e[1])

            let xcount = mode(xlist);
            let ycount = mode(ylist);

            let xmode = Math.max(...Object.values(xcount))
            let ymode = Math.max(...Object.values(ycount))

            let xmax = Number(Object.keys(xcount).reduce(function(a, b){ return xcount[a] > xcount[b] ? a : b }))
            let ymax = Number(Object.keys(ycount).reduce(function(a, b){ return ycount[a] > ycount[b] ? a : b }))
            
            let xmin = Number(Object.keys(xcount).reduce(function(a, b){ return xcount[a] < xcount[b] ? a : b }))
            let ymin = Number(Object.keys(ycount).reduce(function(a, b){ return ycount[a] < ycount[b] ? a : b }))

            var piece_type = 8;
            // determine what color the piece should be
            if(xmode == 1 || ymode == 1){
                piece_type = 1;
            }else if(ymode == 3){
                if(ymax < ymin){
                    if(xmax == Math.min(...xlist)){
                        piece_type=6
                    }else if(xmax == Math.max(...xlist)){
                        piece_type=2
                    }else{
                        piece_type=5
                    }
                }else{
                    if(xmax == Math.min(...xlist)){
                        piece_type=2
                    }else if(xmax == Math.max(...xlist)){
                        piece_type=6
                    }else{
                        piece_type=5
                    }
                }
            }else if(xmode == 3){
                // VERT T J L
                if(xmax > xmin){
                    if(ymax == Math.min(...ylist)){
                        piece_type=6
                    }else if(ymax == Math.max(...ylist)){
                        piece_type=2
                    }else{
                        piece_type=5
                    }
                }else{
                    if(ymax == Math.min(...ylist)){
                        piece_type=2
                    }else if(ymax == Math.max(...ylist)){
                        piece_type=6
                    }else{
                        piece_type=5
                    }
                }
            }else if(Object.keys(xcount).length == 2 && Object.keys(ycount).length == 2){
                //O
                piece_type = 3
            }else if(Object.keys(xcount).length == 3){
                outside_pieces = auto_pieces.filter(e=>e[0]!=xmax).sort((a,b)=>a[0]>b[0]?1:-1)
                if(outside_pieces[0][1] > outside_pieces[1][1]){
                    piece_type=4
                }else{
                    piece_type=7
                }
            }else{
                outside_pieces = auto_pieces.filter(e=>e[1]!=ymax).sort((a,b)=>a[1]>b[1]?1:-1)
                if(outside_pieces[0][0] > outside_pieces[1][0]){
                    piece_type=7
                }else{
                    piece_type=4
                }
            }
            for(coord of auto_pieces){
                board[coord[1]*10 + coord[0]] = piece_type;
                field[page_number]._field.field.pieces = board;
            }
        }else{
            board[index] = piece;
            field[page_number]._field.field.pieces = board;

        }
        fumen = encoder.encode(field);
        
        updateFumen(fumen)


        


    }else if(event.buttons==2){//DESTROY
        const x = Math.floor((event.pageX - this.parentElement.offsetLeft + this.width/2)/22);
        const y = (height-1) - Math.floor((event.offsetY - 22/5)/22);
        if(y>=height || x > 9 || x < 0 || y < 0)return;
        const index = y*10 + x;

        if(board[index] == 0) return;
        const coords = [x,y]
        for(i=0;i<auto_pieces.length;i++){
            if(JSON.stringify(coords) == JSON.stringify(auto_pieces[i])){
                delete auto_pieces[i]
            }
        }
        board[index] = 0;
        field[page_number]._field.field.pieces = board;

        fumen = encoder.encode(field);
        updateFumen(fumen)
    }
}


function updateFumen(data=fumen,update=false,checkdupe = true){
    if(typeof data == "string"){
        fumen = data
        if(fumen != board_states[board_states.length-1]||(!checkdupe)){
            element.src = getDataURL(splitFumen(fumen)[page_number], height, lock)
        }
        if(update){
            board_states.push(fumen)
        }
        previous_board_state = fumen
    }else{
        fumen = encoder.encode(data);
        if(fumen != board_states[board_states.length-1]||(!checkdupe)){
            element.src = getDataURL(splitFumen(fumen)[page_number], height, lock)
        }
        if(update){
            board_states.push(fumen)
        }
        previous_board_state = fumen

    }
}

element.addEventListener("mouseup",function(e){
    if(e.which=="2"){
        const x = Math.floor((event.pageX - this.parentElement.offsetLeft + this.width/2)/22);
        const y = (height-1) - Math.floor((event.offsetY - 22/5)/22);
        if(y>=height)return;
        if(x>9)return;
        if(x<0)return;
        if(y<0)return;
        const index = y*10 + x;
        field = decoder.decode(fumen)
        piece = field[page_number]._field.field.pieces[index];

        if(piece==8||piece==0){
            $(`.mino_select[active="1"]`).click()
            return;
        }

        $("."+["","I","L","O","Z","T","J","S"][piece]).click();
    }
})

element.onmouseup = function(event){
    if(auto_pieces.length==4){
        auto_pieces=[]
    }
    if(fumen != board_states[board_states.length-1]){
        board_states.push(fumen)
    }
}


document.oncontextmenu=function(e){
    e.preventDefault();
}

$("body").on("keydown",function(e){
    if(e.key.toLowerCase() == "z" && e.ctrlKey){
        if(board_states.length>1){
            board_states.pop()
            fumen = board_states[board_states.length-1]
            field = decoder.decode(fumen);
            board = field[page_number]._field.field.pieces;
            updateFumen(fumen,false,false)
        }
    }else if(e.key=="Delete" || e.key.toLowerCase()=="r" || e.key.toLowerCase()=="backspace" ||e.key.toLowerCase()=="escape"){
        fumen = "v115@vhAAgH"
        page_number = 0
        field = decoder.decode(fumen);
        board = field[page_number]._field.field.pieces;
        updateFumen(fumen,true, false)
    }else if(e.key.toLowerCase()=="c"){
        if(e.ctrlKey || e.metaKey){//copy image
            sliceSize = 512
            dataurl = element.src.split(",")[1]
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
    }else if(e.key == "Enter"){//clear skimmed rows
        var numcols = 10;
        var numrows = height;
        var pages = decoder.decode(fumen)
        skim_rows = []
        for (i = 0; i < numrows; i++) {
            if(pages[0]._field.field.pieces.slice(i*numcols,i*numcols+10).every(n=>n)){
                skim_rows.push(i)
            }
        }
        for(var row of skim_rows.reverse()){
            for (i = row; i < numrows; i++) {
                for(j=0;j<numcols;j++){
                    pages[page_number]._field.field.pieces[i*numcols+j] = pages[page_number]._field.field.pieces[(i+1)*numcols+j]
                }
            }
            skim_rows=skim_rows.map(x=>x-1).slice(1)
        }
        fumen = encoder.encode(pages);
        field = decoder.decode(fumen);
        board = field[page_number]._field.field.pieces;
        updateFumen(fumen,true)
        
    }else if(e.key.toLowerCase() == "g"){
        pages = decoder.decode(fumen)
        for(i=0;i<pages[page_number]._field.field.pieces.length;i++){
            if(pages[page_number]._field.field.pieces[i]){
                pages[page_number]._field.field.pieces[i] = 8
            }
        }
        fumen = encoder.encode(pages);
        field = decoder.decode(fumen);
        board = field[page_number]._field.field.pieces;
        updateFumen(fumen,true)
    }else if(e.key.toLowerCase() == "v" && e.ctrlKey){
        (async function(){
            const text = await navigator.clipboard.readText();
            try{
                pages = decoder.decode(text)
                fumen = text;
                page_number = 0;
                field = decoder.decode(fumen);
                board = field[page_number]._field.field.pieces;
                updateFumen(fumen,true)
            }catch{
                console.error(`${text} is not a valid fumen.`)
                return;
            }
        })();
        

    }else if(e.key.toLowerCase() == "arrowleft"){
        page_number -= 1
        if(page_number<0){
            pages = decoder.decode(fumen);
            page_number = pages.length-1
        }
        updateFumen(fumen,true,false)
    }else if(e.key.toLowerCase() == "arrowright"){
        pages = decoder.decode(fumen);
        page_number += 1
        if(page_number>=pages.length){
            page_number = 0;
        }
        updateFumen(fumen,true,false)
    }else if("1234567".includes(e.key)){
        piece = Number(e.key);
        $("."+["","T","I","J","L","O","S","Z"][piece]).click();
    }else if(e.key.toLowerCase()=="l"){
        lock = !lock
        updateFumen(fumen,false,false)
    }else if(e.key.toLowerCase() == "arrowup"){
        height += 1
        if(height>=20){
            height=20
        }
        updateFumen(fumen,true,false)
    }else if(e.key.toLowerCase() == "arrowdown"){
        height -= 1
        if(height<=1){
            height=1
        }
        updateFumen(fumen,true,false)
    }else if(e.key.toLowerCase() == "m"){
        fumen = mirrorFumen(fumen);
        field = decoder.decode(fumen);
        board = field[page_number]._field.field.pieces;
        updateFumen(fumen,true,false)
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
})