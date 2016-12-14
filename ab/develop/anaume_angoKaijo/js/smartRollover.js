function smartRollover() {
    var a, i;
    if (document.getElementsByTagName) {
        a = document.getElementsByTagName("img");
        for (i = 0; i < a.length; i++) {
            if (a[i].getAttribute("src").match("_off.")) {
                a[i].onmouseover = function() {
                    this.setAttribute("src", this.getAttribute("src").replace("_off.", "_on."))
                };
                a[i].onmouseout = function() {
                    this.setAttribute("src", this.getAttribute("src").replace("_on.", "_off."))
                }
            }
        }
    }
}
if (window.addEventListener) {
    window.addEventListener("load", smartRollover, false)
} else if (window.attachEvent) {
    window.attachEvent("onload", smartRollover)
}