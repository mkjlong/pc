queue = window.location.search.slice(1).split("|")[0];
$("#fumen")[0].src = getDataURL(lookup[queue].fumen)