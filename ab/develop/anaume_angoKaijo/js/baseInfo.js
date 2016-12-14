function basicInfo() {
    "use strict";
    var a, schoolCode, selectName, selectNum, selEle, xmlhr, response, i, il;
    xmlhr = new XMLHttpRequest();
    xmlhr.open("POST", "./php/loginCheck.php", true);
    xmlhr.onreadystatechange = function() {
        if (xmlhr.readyState === 4) {
            response = xmlhr.responseText;
            a = JSON.parse(response);
            schoolCode = null;
            if (a.group === "1") {
                schoolCode = "E"
            } else if (a.group === "2") {
                schoolCode = "H"
            }
            if (document.getElementById("author")) {
                document.getElementById("author").textContent = a.displayName
            }
            selectName = "group";
            selectNum = a.group;
            selEle = document.getElementById(selectName);
            optionEleEdit(selEle, selectName, selectNum);
            selEle.addEventListener("change", groupSelecter, "false");
            selectName = "school";
            selectNum = a.school;
            selEle = document.getElementById(selectName);
            optionEleEdit(selEle, selectName + schoolCode, selectNum);
            selectName = "grade";
            selectNum = a.grade;
            selEle = document.getElementById(selectName);
            optionEleEdit(selEle, selectName + schoolCode, selectNum);
            selEle.addEventListener("change", unitSelecter, "false");
            selectName = "curriculum";
            selectNum = a.curriculum;
            selEle = document.getElementById(selectName);
            optionEleEdit(selEle, selectName + schoolCode, selectNum);
            selEle.addEventListener("change", unitSelecter, "false");
            selectName = "unit";
            selectNum = 0;
            selEle = document.getElementById(selectName);
            optionEleEdit(selEle, selectName, selectNum);
            selectName = "share";
            selectNum = 1;
            selEle = document.getElementById(selectName);
            optionEleEdit(selEle, selectName, selectNum);
            if (settingBaseInfoCallBack) {
                settingBaseInfoCallBack()
            }
        }
    };
    xmlhr.send(null)
}
var settingBaseInfoCallBack;