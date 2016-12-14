var SS = sessionStorage;

function loadData(a) {
    "use strict";
    var b, response, i;
    b = new XMLHttpRequest();
    b.open("POST", "./php/nameList.php", false);
    b.onreadystatechange = function() {
        loadStart();
        if (b.readyState === 4) {
            if (b.status === 200) {
                response = b.responseText;
                SS.setItem(a, response)
            }
        }
        loadEnd()
    };
    b.send(a)
}

function loadDataAll() {
    "use strict";
    var a, key, loadFlag, i, il;
    a = ["group", "schoolE", "schoolH", "gradeE", "gradeH", "curriculumE", "curriculumH", "share"];
    loadFlag = false;
    for (i = 0, il = a.length; i < il; i += 1) {
        key = a[i];
        
        SS.removeItem(key);
        
        if (!SS.getItem(key)) {
            loadData(key)
        }
    }
}