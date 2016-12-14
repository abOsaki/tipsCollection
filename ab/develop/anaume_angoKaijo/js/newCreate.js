function newCreate() {
    "use strict";
    var a, code, alertItem;
    alertItem = confirm("編集内容は保存されません。\n内容をリセットしてもよろしいですか。");
    if (alertItem === true) {
        loadStart();
        a = document.getElementById("group");
        if (a.value === "1") {
            code = "E"
        } else if (a.value === "2") {
            code = "H"
        } else {
            code = ""
        }
        a.selectedIndex = 0;
        optionEleEdit(document.getElementById("grade"), "grade", 0);
        optionEleEdit(document.getElementById("curriculum"), "curriculum", 0);
        optionEleEdit(document.getElementById("unit"), "unit", 0);
        optionEleEdit(document.getElementById("share"), "share", 1);
        document.getElementById("title").value = "";
        document.getElementById("textContents").innerHTML = "<p></p>";
        document.getElementById("imageContents").innerHTML = "";
        document.getElementById("fusenContents").innerHTML = "";
        document.getElementById("audioContents").innerHTML = "";
        document.getElementById('rubyContents').innerHTML = "";
        SS.clear();
        loadDataAll();
        loadEnd()
    }
}