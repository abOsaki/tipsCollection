function checkAll(a) {
    var b, children = [],
        i;
    b = document.getElementById(a);
    children = b.children;
    for (i = 0; i < children.length; i++) {
        children[i].firstChild.firstChild.checked = true
    }
}

function uncheckAll(a) {
    var b, children = [],
        i;
    b = document.getElementById(a);
    children = b.children;
    for (i = 0; i < children.length; i++) {
        children[i].firstChild.firstChild.checked = false
    }
}