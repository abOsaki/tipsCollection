function anaaki() {
    var textContainer = document.getElementById("textContents");
    var selection = getSelection();
    if (selection.rangeCount > 0) {
        var range = selection.getRangeAt(0);
        if (isValidRange(range)) {
            var contents = range.extractContents();
            var span = document.createElement("span");
            span.textContent = contents.textContent;
            span.className = "anaaki anaInvisible";
            span.onclick = function() {
                window.getSelection().collapse(document.body, 0);
                if (span.className == "anaaki anaInvisible") {
                    span.className = "anaaki anaVisible"
                } else {
                    span.className = "anaaki anaInvisible"
                }
            };
            if (contents.firstChild.nodeName.toLowerCase() == "p") {
                var p = document.createElement("p");
                p.appendChild(span);
                range.insertNode(p)
            } else {
                range.insertNode(span)
            }
        }
    }

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
    }
}

function clearAnaaki() {
    var ana = document.getElementById("textContents").getElementsByClassName("anaaki");
    setNodeStyle(ana, function(nodes) {
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            node.outerHTML = node.innerHTML
        }
    }, true)
}

function btnClick() {}
var isVertical = false;

function verticalWriting(vw) {
    var textContainer = document.getElementById("textContents"),
        questionArea = document.getElementById("questionArea"),
        imageContents = document.getElementById("imageContents");
    isVertical = vw;
    if (vw) {
        textContainer.classList.add("verticalWriting");
        questionArea.classList.add("verticalWriting");
        textContainer.style.maxWidth = "100%";
        textContainer.style.minHeight = "100%"
    } else {
        textContainer.classList.remove("verticalWriting");
        questionArea.classList.remove("verticalWriting");
        textContainer.style.minHeight = "100%"
    }
}

function Undo() {
    undoOperation.undoExecute()
}

function redo() {
    undoOperation.redoExecute()
}

function clearStyle() {
    alertWindow("選択した行の書式をクリアしますがよろしいですか。", function() {
        surroundWithPTag();
        setLineStyle(function(nodes) {
            for (var i = 0; i < nodes.length; i++) {
                var text = nodes[i].textContent;
                nodes[i].style.cssText = "";
                while (nodes[i].hasChildNodes()) {
                    nodes[i].removeChild(nodes[i].firstChild)
                }
                nodes[i].textContent = text
            }
        })
    })
}

function textAlign(align) {
    surroundWithPTag();
    setLineStyle(function(nodes) {
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].style["text-align"] = align
        }
    })
}

function lineHeight(height) {
    surroundWithPTag();
    setLineStyle(function(nodes) {
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].style["line-height"] = height
        }
    })
}

function size(em) {
    surroundWithPTag();
    setLineStyle(function(nodes) {
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].style["font-size"] = em + "em"
        }
    })
}

function changeSize(px) {
    surroundWithPTag();
    setLineStyle(function(nodes) {
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].style["font-size"] = px + "em"
        }
        return false
    })
}

function underline() {
    setTextContentsUndo();
    var spans = document.getElementById("textContents").getElementsByTagName("span");
    var underLineSpans = new Array();
    for (var i = 0; i < spans.length; i++) {
        if (spans[i].textContent != "" && spans[i].style["text-decoration"] == "underline") {
            underLineSpans.push(spans[i])
        }
    }
    setNodeStyle(underLineSpans, function(nodes) {
        if (nodes.length > 0) {
            for (var i = 0; i < nodes.length; i++) {
                nodes[i].style["text-decoration"] = ""
            }
        } else {
            setTextStyle(function(targetNodes) {
                for (var i = 0; i < targetNodes.length; i++) {
                    targetNodes[i].style["text-decoration"] = "underline"
                }
            })
        }
    }, true);
    setTextContentsRedo()
}
var beforeRange;

function saveRange() {
    var selection = document.getSelection()
}

function revertRange() {
    window.getSelection().addRange(beforeRange)
}

function bold() {
    setTextContentsUndo();
    setTextStyle(function(nodes) {
        var fontWeight = "bold";
        if (getStyle(nodes[0], "font-weight") == "bold") {
            fontWeight = "normal"
        }
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].style["font-weight"] = fontWeight
        }
    });
    setTextContentsRedo()
}

function red() {
    setTextContentsUndo();
    setTextStyle(function(nodes) {
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].style["color"] = "#ff0000"
        }
    });
    setTextContentsRedo()
}

function blue() {
    setTextContentsUndo();
    setTextStyle(function(nodes) {
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].style["color"] = "#0000ff"
        }
    });
    setTextContentsRedo()
}

function black() {
    setTextContentsUndo();
    setTextStyle(function(nodes) {
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].style["color"] = "#000000"
        }
    });
    setTextContentsRedo()
}

function setLineStyle(callback) {
    var textContainer = document.getElementById("textContents");
    setNodeStyle(textContainer.getElementsByTagName("p"), callback, false)
}

function setNodeStyle(candidateNodes, callback, extractsTextRange) {
    var selection = getSelection();
    if (selection.rangeCount > 0) {
        var range = selection.getRangeAt(0);
        var targetNodes = new Array();
        for (var i = 0; i < candidateNodes.length; i++) {
            var currentRange = document.createRange();
            currentRange.selectNodeContents(candidateNodes[i]);
            if (extractsTextRange) {
                currentRange = getTextRange(currentRange)
            }
            if (currentRange.compareBoundaryPoints(Range.START_TO_END, range) > 0 && currentRange.compareBoundaryPoints(Range.END_TO_START, range) < 0) {
                targetNodes.push(candidateNodes[i])
            }
            if (currentRange.compareBoundaryPoints(Range.END_TO_START, range) >= 0) {
                break
            }
        }
        callback(targetNodes)
    }
}

function setTextStyle(callback) {
    var textContainer = document.getElementById("textContents");
    var selection = getSelection();
    if (selection.rangeCount > 0) {
        var range = selection.getRangeAt(0);
        if (range.startContainer.nodeType == Node.TEXT_NODE) {
            range.startContainer.splitText(range.startOffset);
            range.setStartAfter(range.startContainer)
        }
        if (range.endContainer.nodeType == Node.TEXT_NODE) {
            range.endContainer.splitText(range.endOffset);
            range.setEndAfter(range.endContainer)
        }
        var currentNode = textContainer;
        var currentRange = document.createRange();
        currentRange.selectNode(currentNode);
        var targetNodes = new Array();
        while (currentNode = nextTextNode(currentNode, textContainer)) {
            currentRange.selectNode(currentNode);
            if (currentRange.compareBoundaryPoints(Range.END_TO_START, range) >= 0) {
                break
            }
            if (currentRange.compareBoundaryPoints(Range.START_TO_START, range) >= 0 && currentRange.compareBoundaryPoints(Range.END_TO_END, range) <= 0) {
                addTarget(targetNodes, currentNode)
            }
        }
        callback(targetNodes);
        window.getSelection().collapse(document.body, 0)
    }

    function addTarget(targetNodes, node) {
        var range = document.createRange();
        range.selectNode(node);
        node = document.createElement("span");
        range.surroundContents(node);
        targetNodes.push(node)
    }
}

function surroundWithPTag() {
    var textContainer = document.getElementById("textContents");
    if (textContainer.firstChild.nodeType == Node.TEXT_NODE) {
        var range = document.createRange();
        range.selectNode(textContainer.firstChild);
        var p = document.createElement("p");
        range.surroundContents(p);
        var sel = getSelection();
        sel.removeAllRanges();
        sel.addRange(range)
    }
}

function getStyle(node, styleName) {
    var textContainer = document.getElementById("textContents");
    while (node && node != textContainer) {
        if (node.style && node.style[styleName]) {
            return node.style[styleName]
        }
        node = node.parentNode
    }
    return null
}

function getTextRange(range) {
    var textRange = range.cloneRange();
    if (textRange.collapsed) {
        return textRange
    }
    if (range.startContainer.nodeType != Node.TEXT_NODE) {
        var node = range.startContainer;
        node = node.firstChild;
        for (var i = 0; i < range.startOffset; i++) {
            node = node.nextSibling;
            if (!node) {
                node = nextNode(range.startContainer.lastChild, false, null);
                break
            }
        }
        if (!isTextNode(node)) {
            node = nextTextNode(node, null)
        }
        textRange.setStart(node, 0)
    } else if (range.startOffset == range.startContainer.length) {
        var node = range.startContainer;
        node = nextTextNode(node, null);
        textRange.setStart(node, 0)
    }
    if (range.endContainer.nodeType != Node.TEXT_NODE) {
        var node = range.endContainer;
        node = node.firstChild;
        if (range.endOffset == 0) {
            node = previousTextNode(range.endContainer, null)
        } else {
            for (var i = 0; i < range.endOffset - 1; i++) {
                node = node.nextSibling
            }
            node = lastNode(node)
        }
        if (!isTextNode(node)) {
            node = previousTextNode(node, null)
        }
        textRange.setEnd(node, node.length)
    } else if (range.endOffset == 0) {
        var node = range.endContainer;
        node = previousTextNode(node, null);
        textRange.setEnd(node, node.length)
    }
    return textRange
}

function nextNode(node, child, endNode) {
    if (child && node.firstChild) {
        return node.firstChild
    }
    if (!endNode) {
        endNode = document.body
    }
    while (node != endNode) {
        if (node.nextSibling) {
            return node.nextSibling
        }
        node = node.parentNode
    }
    return null
}

function previousNode(node, startNode) {
    if (!startNode) {
        startNode = document.body
    }
    if (!node.previousSibling) {
        if (node.parentElement == startNode) {
            return null
        }
        return node.parentNode
    }
    return lastNode(node.previousSibling)
}

function lastNode(node) {
    while (node.lastChild) {
        node = node.lastChild
    }
    return node
}

function isTextNode(node) {
    if (node.nodeType == Node.TEXT_NODE && node.textContent.trim() != "") {
        return true
    }
    return false
}

function nextTextNode(node, endNode) {
    do {
        node = nextNode(node, true, endNode)
    } while (node != null && !isTextNode(node));
    return node
}

function previousTextNode(node, startNode) {
    do {
        node = previousNode(node, startNode)
    } while (node != null && !isTextNode(node));
    return node
}
window.addEventListener("load", function() {
    var textContainer = document.getElementById("textContents");
    textContainer.appendChild(document.createElement("p"))
}, false);

function showGuideline(size) {
    var $that = $(this);
    var func = (function() {
        var width, height, top, left, opacity;
        var rate = 0.646;
        if (size == 'a4_portrait') {
            width = 2100 * rate;
            height = 2970 * rate;
            opacity = 0.5
        } else if (size == 'b5_portrait') {
            width = 1820 * rate;
            height = 2570 * rate;
            opacity = 0.5
        } else if (size == 'a4_landscape') {
            height = 2100 * rate;
            width = 2970 * rate;
            opacity = 0.5
        } else if (size == 'b5_landscape') {
            height = 1820 * rate;
            width = 2570 * rate;
            opacity = 0.5
        } else {
            height = 0;
            width = 0;
            opacity = 0;
            size = ""
        }
        var left;
        if ($('#questionArea').hasClass('verticalWriting')) {
            left = $('#questionArea').outerWidth() - width
        } else {
            left = 0
        }
        $('#print_guideline').attr('data', size);
        $('#print_guideline').animate({
            'width': (width),
            'height': (height),
            'opacity': opacity,
            'left': left
        }, 400, 'swing')
    });
    func()
}
var commonfn = (function() {
    'use strict';
    return {
        getNowDate: function() {
            var date, year, month, day, hours, minutes, seconds, nowDate;
            date = new Date();
            year = date.getFullYear();
            month = date.getMonth() + 1;
            day = date.getDate();
            hours = date.getHours();
            minutes = date.getMinutes();
            seconds = date.getSeconds();
            nowDate = year + ("0" + month).slice(-2) + ("0" + day).slice(-2) + ("0" + hours).slice(-2) + ("0" + minutes).slice(-2) + ("0" + seconds).slice(-2);
            return nowDate
        },
        loadImage: function(fileName, callback) {
            var xmlhr;
            callback = callback || function() {};
            xmlhr = new XMLHttpRequest();
            xmlhr.open('POST', './../common/php/imageLoad.php', true);
            xmlhr.responseType = 'blob';
            xmlhr.onreadystatechange = function() {
                var obj, reader;
                if (xmlhr.readyState === 4) {
                    callback(xmlhr.response, fileName)
                }
            };
            xmlhr.send(fileName)
        }
    }
}());
var rate = "";
$(function() {
    $(document).on('click', '#fusenInsert', function() {
        fusenOperation.fusenInsert()
    });
    $(document).on('click', '#ruby', function() {
        ruby()
    });
    $(document).on('click', '#voice', function() {
        audioOperation.audioUp()
    });
    $(document).on('click', '#saveButton', function() {
        saveData()
    });
    $(window).keydown(function(e) {
        fusenOperation.notifyKeyDown(e);
        ImgOperation.notifyKeyDown(e);
        audioOperation.notifyKeyDown(e);
        if (e.keyCode == 8) {
            var obj = event.target;
            if (obj.id == "textContents" || obj.id == "title" || obj.id == "rubyContent") {
                return true
            }
            return false
        }
    });
    $(document).on('dblclick', '#fusenContents', function() {
        fusenOperation.changeFusenGazou()
    });
    $(document).on('mousedown', ".sizeChangeUL", function(e) {
        e.stopPropagation();
        return false
    });
    $(window).load(function() {
        console.log("window.innerWidth : " + window.innerWidth);
        console.log("window.innerHeight : " + window.innerHeight);
        var scaleX = window.innerWidth / 1920;
        var scaleY = window.innerHeight / 994;
        console.log("scaleX : " + scaleX);
        console.log("scaleY : " + scaleY)
    });
    var test = SS;
});