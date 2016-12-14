function questionSearchReset() {
    "use strict";
    var a, itemEle, i, il;
    itemEle = document.getElementById("questionListBody");
    removeElement(itemEle);
    itemEle = document.getElementById("title");
    itemEle.value = null;
    a = ["group", "school", "grade", "curriculum", "unit"];
    for (i = 0, il = a.length; i < il; i += 1) {
        document.getElementById(a[i]).selectedIndex = 0
    }
}

function questionRemove() {
    var a, pages = [],
        i, j, trEle, tdEle, inputEle;
    a = document.getElementById("workbookBody");
    pages = a.children;
    for (i = 0; i < pages.length; i++) {
        if (pages[i].childNodes[0].firstChild.checked) {
            a.removeChild(pages[i]);
            i--
        }
    }
    pages = a.children;
    for (i = 0; i < pages.length; i++) {
        pages[i].childNodes[1].textContent = i + 1
    }
    workbookPageCount()
}

function questionRemoveAll() {
    var a, alertItem;
    alertItem = confirm("問題集の内容をリセットしてもよろしいですか。");
    if (alertItem === true) {
        a = document.getElementById("workbookBody");
        while (a.firstChild) {
            a.removeChild(a.firstChild)
        }
        workbookPageCount()
    }
}