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

function loadEvent() {
    "use strict";
    loadDataAll();
    basicInfo()
}
window.addEventListener("load", loadEvent, false);
$(document).on('click', '#table01 th', function() {
    'use strict';
    var c = this,
        arrow = $('.sort', c),
        col = $('#table01 th').index(c);
    if (!arrow.length) {
        return false
    }
    arrow.html(arrow.html() === '▲' ? '▼' : '▲');
    $('#educationListBody').append($('#educationListBody tr').sort(function(a, b) {
        if (arrow.html() === '▼') {
            return $(a).children('td').eq(col).text() > $(b).children('td').eq(col).text() ? -1 : 1
        } else {
            return $(a).children('td').eq(col).text() < $(b).children('td').eq(col).text() ? -1 : 1
        }
    }))
});