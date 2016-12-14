function rubyOperation(selection) {
    /*
    this.selection = selection;
    this.range = selection.getRangeAt(0);
    */
    this.editStart = function() {
        /*
        if (isValidRange(this.range)) {
            modalOpen("rubyModal")
        }
        */
        modalOpen("rubyModal");
    };
    this.registEdit = function() {
        var textContainer = document.getElementById("textContents");
        var contents = this.range.extractContents();
        var startContainer = this.range.startContainer;
        var startinner = startContainer.innerHTML;
        var endContainer = this.range.endContainer;
        refreshRuby();
        var ruby = document.createElement("ruby");
        ruby.textContent = contents.textContent;
        var rt = document.createElement("rt");
        rt.textContent = getRuby();
        ruby.appendChild(rt);
        setRubyStyle(ruby);
        if (contents.firstChild.nodeName.toLowerCase() == "p") {
            var p = document.createElement("p");
            p.appendChild(ruby);
            this.range.insertNode(p)
        } else {
            this.range.insertNode(ruby)
        }
        initializeRuby()
    };
    return this;
    var rubyContent;

    function isValidRange(range) {
        if (range.collapsed) {
            return false
        }
        var textContainer = document.getElementById("textContents");
        var node = range.commonAncestorContainer;
        while (node != null) {
            if (textContainer == node) {
                return true
            }
            node = node.parentNode
        }
        return false
    };

    function getRuby() {
        rubyContent = document.getElementById("rubyContent");
        var ruby = rubyContent.value;
        return ruby
    };

    function initializeRuby() {
        rubyContent.value = ""
    };

    function setRubyStyle(ruby) {
        var leftCbx = document.getElementById("left");
        if (document.getElementById('left').checked) {
            ruby.setAttribute('style', 'ruby-align: left')
        } else if (document.getElementById('center').checked) {
            ruby.setAttribute('style', 'ruby-align: distribute-letter')
        }
    };

    function refreshRuby() {
        var taisho = document.getElementById("textContents").children;
        deleteInvalidRuby(taisho)
    };

    function deleteInvalidRuby(elements) {
        for (var i = 0; i < elements.length; i++) {
            var child = elements[i];
            if (child.nodeName == "RUBY") {
                if (checkRTExist(child)) {
                    removeRuby(child)
                }
            }
        }
    };

    function checkRTExist(Ruby) {
        var children = Ruby.children;
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child.nodeName == "RT") {
                return true
            }
        }
        return false
    };

    function removeRuby(rubyElement) {
        var children = rubyElement.children;
        rubyElement.parentNode.removeChild(rubyElement);
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            rubyElement.parentNode.appendChild(child)
        }
    }
}
var selectedRubyOperation;

function ruby() {
    var selection = getSelection();
    selectedRubyOperation = new rubyOperation(selection);
    selectedRubyOperation.editStart()
}

function editRuby() {
    //selectedRubyOperation.registEdit()
    
    
    var rubyContent = document.getElementById("rubyContent");
    var ruby = rubyContent.value;
    
    rubyObjectOperation.insert(ruby);
    
}