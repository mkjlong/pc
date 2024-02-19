var rawFile = new XMLHttpRequest();
rawFile.open("GET", "T.md", true);
console.log(rawFile);

rawFile.onreadystatechange = function(){
    if(rawFile.readyState === 4){
        var alltext = rawFile.responseText;
        console.log(alltext);
    }
    rawFile.send();
}

