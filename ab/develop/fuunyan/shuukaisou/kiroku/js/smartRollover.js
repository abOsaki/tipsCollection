function smartRollover() {
	if(document.getElementsByTagName) {
		var images = document.getElementsByTagName("img");

		for(var i=0; i < images.length; i++) {
            
            //ここでモードに応じてむしする処理を記述
            if(currentMode == shuukaisouMode){
                if(images[i].id == "hidukebetsuButton"){
                    continue;
                }
            }
            
            if(currentMode == shuukeiModeObj){
                if(images[i].id == "shuukeiButton"){
                    continue;
                }
            }
            
            if(currentMode == bunsekiModeObj){
                if(images[i].id == "bunnsekiButton"){
                    continue;
                }
            }
            
            
			if(images[i].getAttribute("src").match("_off."))
			{
				images[i].onmouseover = function() {
					this.setAttribute("src", this.getAttribute("src").replace("_off.", "_on."));
				}
				images[i].onmouseout = function() {
					this.setAttribute("src", this.getAttribute("src").replace("_on.", "_off."));
				}
			}
		}
	}
}

if(window.addEventListener) {
	window.addEventListener("load", smartRollover, false);
}
else if(window.attachEvent) {
	window.attachEvent("onload", smartRollover);
}

