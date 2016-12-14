loginCheck();
var SS = sessionStorage;

function loadEvent() {
    "use strict";
    if (window.location.search.length > 0) {
        educationOpen()
    } else {
        location.href = "./educationSelect.html"
    }
}
window.addEventListener("load", loadEvent, false);