const keyMap= {}
copyimage = '';
copyfumen = '';


$(".line > h4 > img").on('click', function(event){
    console.log($($(this).parent().parent().parent()[0].querySelectorAll(".content")).toggleClass("hidden"));
    $(this).toggleClass("rotate")
})


const [threepiece,pieces] = window.location.search.slice(1).split("|");


const sorted_threepiece = threepiece.split('').sort((a,b)=>"TIJLOSZ".indexOf(a) - "TIJLOSZ".indexOf(b)).join('')


if(sorted_threepiece){
    $("body > *").addClass("hidden")
    $(`.${sorted_threepiece}`).removeClass("hidden")
    console.log($(`.${sorted_threepiece}`));
}


$(".setup").on("click",function(){
    if($(this).hasClass("active")){
        $(this).removeClass("active");
        $(`.solutions.${$(this).attr("queue")}`).addClass("hidden")
        return;
    }
    $(".setup").removeClass("active")
    $(this).addClass("active")

    $(".solutions").addClass("hidden")
    $(`.solutions.${$(this).attr("queue")}`).removeClass("hidden")
})



window.addEventListener('click',function(e){
    if(e.target.offsetParent != $("#rightclick")[0]){
        $("#rightclick").addClass('hidden')
        $("#rightclick").css({"left":"","top":""})
    }
})
window.oncontextmenu=function(e){
    e.preventDefault()
}



document.onkeydown = document.onkeyup = function(e){
    if(e.repeat)return;
    keyMap[e.key]=e.type=='keyup'
}


//focus("TJOS")


$("img").on("dragstart",function(){
    return false;
})
$("img").on("contextmenu",function(e){
    thing = $($(this).children()[0]).html()
    $("#rightclick").removeClass("hidden")
    $("#rightclick").css("top", e.clientY + 'px')
    $("#rightclick").css("left", e.clientX + 'px')
    copyimage = $(this).attr('src')
    copyfumen = $(this).attr("fumen")
    e.preventDefault();
})


$("#rightclick > span").on("click",function(e){
    if($(this).html()=="Copy Fumen"){
        console.log(copyfumen);
        navigator.clipboard.writeText(copyfumen)
    }else if($(this).html()=="Copy Image"){
        sliceSize = 512
        dataurl = copyimage.split(',').slice(-1)[0]
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
    }
    
    $("#rightclick").addClass('hidden')
    $("#rightclick").css({"left":"","top":""})
})


