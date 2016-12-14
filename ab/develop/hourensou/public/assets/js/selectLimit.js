function selectLimit() {
    var tBodyEle, trEles, nextEle, i;

    tBodyEle = document.getElementById("reportBody");
    trEles = tBodyEle.children;

    for (i = 0; i < trEles.length; i++) {
        nextEle = trEles[i].children[3];
        selectValue = nextEle.firstElementChild.selectedIndex;
//console.log(selectValue);
        nextEle = nextEle.nextElementSibling;
        /*
        while (nextEle) {
            if (filterItem) {
                limitFlag = true;
            }
        }
        */
    }

    tBodyEle = document.getElementById("ictBody");
    tBodyEle = document.getElementById("demandBody");
}