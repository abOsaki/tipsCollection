loginCheck();
var unitType = {
    "E": {
        "1": ["", "Kokugo", "", "Math", ""],
        "2": ["", "Kokugo", "", "Math", ""],
        "3": ["", "Kokugo", "Syakai", "Math", "Rika"],
        "4": ["", "Kokugo", "Syakai", "Math", "Rika"],
        "5": ["", "Kokugo", "Syakai", "Math", "Rika"],
        "6": ["", "Kokugo", "Syakai", "Math", "Rika"]
    },
    "H": {
        "1": ["", "Kokugo", "ShakaiG", "ShakaiH", "ShakaiC", "Math", "Rika", "English"],
        "2": ["", "Kokugo", "ShakaiG", "ShakaiH", "ShakaiC", "Math", "Rika", "English"],
        "3": ["", "Kokugo", "ShakaiG", "ShakaiH", "ShakaiC", "Math", "Rika", "English"],
        "4": ["", "Kokugo", "ShakaiG", "ShakaiH", "ShakaiC", "Math", "Rika", "English"]
    }
};
var SS = sessionStorage;
$(function() {
    "use strict";
    $("#nav2").droppy({
        speed: 100
    })
});

function keyDownFunc(e) {
    if (e.keyCode === 46 && selectedImgId !== null) {
        delImgName = document.getElementById(selectedImgId + "handle01").firstElementChild.firstElementChild.firstElementChild.id;
        SS.removeItem(selectedImgId);
        var a = document.getElementById(selectedImgId + "handle01");
        a.parentElement.removeChild(a);
        selectedImgId = null
    }
}
window.addEventListener("keydown", keyDownFunc, false);

function dragStart(e) {
    "use strict";
    e.preventDefault()
}
window.addEventListener("dragstart", dragStart, false);

function dropItem(e) {
    "use strict";
    e.preventDefault()
}
window.addEventListener("drop", dropItem, false);

function loadEvent(e) {
    "use strict";
    var a;
    loadDataAll();
    if (window.location.search.length > 0) {
        questionOpen()
    } else {
        basicInfo()
    }
    cleanUpLoop()
}
window.addEventListener("load", loadEvent, false);

function cleanUpLoop() {
    cleanUpBlankSpans();
    setTimeout(cleanUpLoop, 15)
}