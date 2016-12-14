function contentsReport(b, c, d) {
    "use strict";
    var e, xmlhr;
    e = {};
    e.materialType = b;
    e.kyouzaiId = c;
    e.kyouzaiCode = d;
    xmlhr = new XMLHttpRequest();
    xmlhr.open("POST", "./php/contentsReport.php", true);
    xmlhr.onreadystatechange = function() {
        if (xmlhr.readyState === 1) {
            loadStart()
        }
        if (xmlhr.readyState === 4) {
            var a, itemData;
            if (xmlhr.status === 200) {
                a = xmlhr.responseText
            }
            loadEnd()
        }
    };
    xmlhr.send(JSON.stringify(e))
}