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
loginCheck();

function loadEvent(e) {
    "use strict";
    var a;
    loadDataAll();
    if (window.location.search.length > 0) {
        basicInfo();
        packageOpen()
    } else {
        basicInfo()
    }
    workbookSaveInfo()
}
window.addEventListener("load", loadEvent, false);