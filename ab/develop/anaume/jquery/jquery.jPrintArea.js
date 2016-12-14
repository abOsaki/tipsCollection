$.jPrintArea = function (el) {
    var iframe, doc, links, i;
    links = [];
    
    console.log($(el).html());
    
    iframe = document.createElement('IFRAME');
    doc = null;
    $(iframe).attr('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;');
        $(iframe).attr('id', 'printstyle');
    
    document.body.appendChild(iframe);
    doc = iframe.contentWindow.document;
    links = window.document.getElementsByTagName('link');
    for (i = 0; i < links.length; i += 1) {
        if (links[i].rel.toLowerCase() === 'stylesheet') {
            doc.write('<link type="text/css" rel="stylesheet" href="' + links[i].href + '"></link>');
        }
    }
    doc.write('<div class="' + $(el).attr("class") + '">' + $(el).html() + '</div>');
    doc.close();
    

	setTimeout(function(){
        document.getElementById("printstyle").contentWindow.focus();
        document.getElementById("printstyle").contentWindow.print();
        document.body.removeChild(iframe);
	},2000);

    
};



