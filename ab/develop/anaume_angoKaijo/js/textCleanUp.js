function cleanUpBlankSpans() {
    var a = document.getElementsByTagName("span");
    for (var i = 0; i < a.length; i++) {
        if (a[i].textContent.length == 0) {
            var b = document.createRange();
            b.selectNode(a[i]);
            b.extractContents()
        }
    }
}