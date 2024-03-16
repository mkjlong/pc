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