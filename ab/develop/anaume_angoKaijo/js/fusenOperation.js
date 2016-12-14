var fusenOperation = (function() {
    'use strict';
    var fusenUtil = (function() {
        function getRotatePaneID(fusenID) {
            return (fusenID + "rotate")
        };

        function getTranslatePaneID(fusenID) {
            return (fusenID + "transLate")
        };

        function getTranslate(xValue, yValue) {
            var x = xValue + "px";
            var y = yValue + "px";
            var transform = 'translate(' + x + "," + y + ')';
            return transform
        };
        return {
            translatePaneID: function(fusenID) {
                return getTranslatePaneID(fusenID)
            },
            translatePane: function(fusenID) {
                var id = getTranslatePaneID(fusenID);
                return document.getElementById(id)
            },
            rotatePaneID: function(fusenID) {
                return getRotatePaneID(fusenID)
            },
            rotatePane: function(fusenID) {
                var id = getRotatePaneID(fusenID);
                return document.getElementById(id)
            },
            getTranslate: function(x, y) {
                return getTranslate(x, y)
            }
        }
    })();
    
    
    var fusenInsertOperation = (function() {
        var insertFusenID;
        var insertFusen;
        var transLatePane;
        var scalePane;
        var rotatePane;
        var insertDraggablePane;
        var insertWrapperPane;
        
        function getInsertFusenIdUnique(){
            var koho = 'fusen' + commonfn.getNowDate();
            for(;;){
                if(!isExistID(koho)){
                    return koho;
                }
                koho += "0";
            }
        };
        
        function isExistID(id){
            return document.getElementById(id);
        };

        function insertImage() {
            insertFusenID = getInsertFusenIdUnique();
            insertFusen = ($("<img/>", {
                "id": insertFusenID,
                "class": "ui-widget-content fusen_on",
                "name": "fusen",
                "src": "./images/fusen_on.png"
            }).css({
                "box-sizing": "reset",
                "cursor": "pointer"
            }).attr('double', 2))[0];
            transLatePane = document.createElement("div");
            transLatePane.id = fusenUtil.translatePaneID(insertFusenID);
            rotatePane = document.createElement("div");
            rotatePane.id = fusenUtil.rotatePaneID(insertFusenID);
            rotatePane.style.position = "absolute";
            rotatePane.style.transformOrigin = "center center";
            var fusenContents = document.getElementById('fusenContents');
            fusenContents.appendChild(transLatePane);
            transLatePane.appendChild(rotatePane);
            rotatePane.appendChild(insertFusen)
        };

        function loadImage(fusenData) {
            insertFusenID = fusenData.fusenName;
            insertFusen = ($("<img/>", {
                "id": insertFusenID,
                "class": "ui-widget-content fusen_on",
                "name": "fusen",
                "src": "./images/fusen_on.png",
            }).css({
                "box-sizing": "reset",
                "cursor": "pointer",
                "position": "absolute"
            }).attr('double', 2))[0];
            insertFusen.width = fusenData.width;
            insertFusen.height = fusenData.height;
            transLatePane = document.createElement("div");
            transLatePane.id = fusenUtil.translatePaneID(insertFusenID);
            transLatePane.setAttribute("style", fusenData.translateStyle);
            setTranslateTransform(transLatePane);
            rotatePane = document.createElement("div");
            rotatePane.id = fusenUtil.rotatePaneID(insertFusenID);
            rotatePane.setAttribute("style", fusenData.rotatePaneStyle);
            var fusenContents = document.getElementById('fusenContents');
            fusenContents.appendChild(transLatePane);
            transLatePane.appendChild(rotatePane);
            rotatePane.appendChild(insertFusen)
        };

        function setTranslateTransform(translatePane) {
            if (translatePane.style.transform == "") {
                var left = parseInt(translatePane.style.left);
                var top = parseInt(translatePane.style.top);
                var transform = fusenUtil.getTranslate(left, top);
                translatePane.style.transform = transform
            }
        };

        function GetLoadImage(fusenData) {
            insertFusenID = fusenData.fusenName;
            insertFusen = ($("<img/>", {
                "id": insertFusenID,
                "class": "ui-widget-content fusen_on",
                "name": "fusen",
                "src": "./images/fusen_on.png",
            }).css({
                "box-sizing": "reset",
                "cursor": "pointer",
                "position": "absolute"
            }).attr('double', 2))[0];
            insertFusen.width = fusenData.width;
            insertFusen.height = fusenData.height;
            transLatePane = document.createElement("div");
            transLatePane.id = fusenUtil.translatePaneID(insertFusenID);
            transLatePane.setAttribute("style", fusenData.translateStyle);
            transLatePane.style.transform = "";
            rotatePane = document.createElement("div");
            rotatePane.id = fusenUtil.rotatePaneID(insertFusenID);
            rotatePane.setAttribute("style", fusenData.rotatePaneStyle);
            transLatePane.appendChild(rotatePane);
            rotatePane.appendChild(insertFusen);
            return transLatePane
        };
        return {
            insert: function() {
                insertImage()
            },
            load: function(fusenData) {
                loadImage(fusenData)
            },
            get: function(fusenData) {
                return GetLoadImage(fusenData)
            }
        }
    })();

    function insert() {
        fusenInsertOperation.insert()
    };
    var fusenTranslateOperation = (function() {
        var initialX;
        var initialY;
        var startX;
        var startY;
        var initialLeftForUndo;
        var initialTopForUndo;

        function keepCurrentPoint(e, translatePane) {
            initialX = e.clientX;
            initialY = e.clientY;
            if (translatePane.style.left != "") {
                startX = parseInt(translatePane.style.left)
            } else {
                startX = 0
            }
            if (translatePane.style.top != "") {
                startY = parseInt(translatePane.style.top)
            } else {
                startY = 0
            }
            initialLeftForUndo = translatePane.style.left;
            initialTopForUndo = translatePane.style.top
        };
        return {
            notifyDragstart: function(e, translatePane) {
                keepCurrentPoint(e, translatePane)
            },
            notifyDragMove: function(e, translatePane) {
                var moveX = e.clientX - initialX + startX;
                var moveY = e.clientY - initialY + startY;
                translatePane.style.left = moveX + "px";
                translatePane.style.top = moveY + "px";
                translatePane.style.transform = fusenUtil.getTranslate(moveX, moveY)
            },
            notifyDragEnd: function(e, translatePane) {
                var endLeftForUndo = translatePane.style.left;
                var endTopForUndo = translatePane.style.top;
                initialLeftForUndo = initialLeftForUndo == "" ? "0px" : initialLeftForUndo;
                initialTopForUndo = initialTopForUndo == "" ? "0px" : initialTopForUndo;
                var moveX = Math.abs(parseInt(initialLeftForUndo) - parseInt(endLeftForUndo));
                var moveY = Math.abs(parseInt(initialTopForUndo) - parseInt(endTopForUndo));
                if (moveX > 1 || moveY > 1) {
                    var undoAction = function() {
                        translatePane.style.left = initialLeftForUndo;
                        translatePane.style.top = initialTopForUndo;
                        translatePane.style.transform = fusenUtil.getTranslate(initialLeftForUndo, initialTopForUndo)
                    };
                    undoOperation.setUndoAction(undoAction);
                    var redoAction = function() {
                        translatePane.style.left = endLeftForUndo;
                        translatePane.style.top = endTopForUndo;
                        translatePane.style.transform = fusenUtil.getTranslate(endLeftForUndo, endTopForUndo)
                    };
                    undoOperation.setRedoAction(redoAction)
                }
            }
        }
    })();
    
    var fusenRotateOperation = (function() {
        var initializeTransformOrigionForUndo;
        var initializeTransformForUndo;
        return {
            notifyDragstart: function(e, targetPane) {
                initializeTransformOrigionForUndo = targetPane.style.transformOrigin;
                initializeTransformForUndo = targetPane.style.transform
            },
            notifyDragMove: function(e, targetPane) {
                var rotateHandleRect = fusenPane.getBoundingClientRect();
                var gazouCX = (rotateHandleRect.left + rotateHandleRect.right) * 0.5;
                var gazouCY = (rotateHandleRect.top + rotateHandleRect.bottom) * 0.5;
                var rotateHX = e.clientX;
                var rotateHY = e.clientY;
                var rad = Math.atan2(rotateHY - gazouCY, rotateHX - gazouCX);
                var angle = (rad * 180) / Math.PI + 90;
                var xOrigin = (fusenPane.width / 2) + "px";
                var yOrigin = (fusenPane.height / 2) + "px";
                targetPane.style.transformOrigin = xOrigin + " " + yOrigin;
                targetPane.style.transform = "rotate(" + angle + "deg)"
            },
            notifyDragEnd: function(e, targetPane) {
                var undoAction = function() {
                    targetPane.style.transformOrigin = initializeTransformOrigionForUndo;
                    targetPane.style.transform = initializeTransformForUndo
                };
                undoOperation.setUndoAction(undoAction);
                var endTransformOrigionForUndo = targetPane.style.transformOrigin;
                var endTransformForUndo = targetPane.style.transform;
                var redoAction = function() {
                    targetPane.style.transformOrigin = endTransformOrigionForUndo;
                    targetPane.style.transform = endTransformForUndo
                };
                undoOperation.setRedoAction(redoAction)
            }
        }
    })();
    
    var fusenScaleOperation = (function() {
        var initialX;
        var initialY;
        var initialBottomLeftX;
        var initialBottomLeftY;
        var initialTopRightX;
        var initialTopRightY;
        var initialDistanceFromBottomLeft;
        var initialDistanceFromTopRight;
        var fusenRect;
        var startWidth;
        var startHeight;
        var resultScale;
        var angle;
        var initialWidthForUndo;
        var initialHeightForUndo;
        return {
            notifyDragstart: function(e, targetPane) {
                removeRotateHandle();
                fusenRect = fusenPane.getBoundingClientRect();
                initialX = e.clientX;
                initialY = e.clientY;
                startWidth = fusenPane.width;
                startHeight = fusenPane.height;
                hiddenScaleVisibility();
                var angleKoho = rotatePane.style.transform.match(/rotate\((.*?)\)/);
                if ((angleKoho != null) && (angleKoho.length > 1)) {
                    var angleText = angleKoho[1];
                    angle = parseFloat(angleText)
                } else {
                    angle = 0
                }
                var bottomLeftRect = scaleBottomLeftHandle.getBoundingClientRect();
                initialBottomLeftX = bottomLeftRect.left;
                initialBottomLeftY = bottomLeftRect.top;
                var dx1 = (initialX - initialBottomLeftX);
                var dy1 = (initialY - initialBottomLeftY);
                initialDistanceFromBottomLeft = Math.sqrt(dx1 * dx1 + dy1 * dy1);
                var topRightRect = scaleTopRightHandle.getBoundingClientRect();
                initialTopRightX = topRightRect.left;
                initialTopRightY = topRightRect.top;
                var dx2 = (initialX - initialTopRightX);
                var dy2 = (initialY - initialTopRightY);
                initialDistanceFromTopRight = Math.sqrt(dx2 * dx2 + dy2 * dy2);
                initialWidthForUndo = fusenPane.width;
                initialHeightForUndo = fusenPane.height
            },
            notifyDragMove: function(e, targetPane) {
                var dx1 = (e.clientX - initialBottomLeftX);
                var dy1 = (e.clientY - initialBottomLeftY);
                var currentDistanceFromBottomLeft = Math.sqrt(dx1 * dx1 + dy1 * dy1);
                var dx2 = (e.clientX - initialTopRightX);
                var dy2 = (e.clientY - initialTopRightY);
                var currentDistanceFromTopRight = Math.sqrt(dx2 * dx2 + dy2 * dy2);
                var scaleX = currentDistanceFromBottomLeft / initialDistanceFromBottomLeft;
                var scaleY = currentDistanceFromTopRight / initialDistanceFromTopRight;
                if (scaleX < 0) {
                    scaleX = -1.0 * scaleX
                }
                if (scaleY < 0) {
                    scaleY = -1.0 * scaleY
                }
                if (scaleX < scaleY) {
                    resultScale = scaleX
                } else {
                    resultScale = scaleY
                }
                var width = startWidth * resultScale;
                var height = startHeight * resultScale;
                if (2 < scaleY) {
                    var test = scaleX
                }
                fusenPane.width = width;
                fusenPane.height = height
            },
            notifyDragEnd: function(e, targetPane) {
                removeScaleHandle();
                addOperateHandle();
                var undoAction = function() {
                    targetPane.width = initialWidthForUndo;
                    targetPane.height = initialHeightForUndo
                };
                undoOperation.setUndoAction(undoAction);
                var endWidthForUndo = targetPane.style.width;
                var endHeightForUndo = targetPane.style.height;
                var redoAction = function() {
                    targetPane.style.width = endWidthForUndo;
                    targetPane.style.height = endHeightForUndo
                };
                undoOperation.setRedoAction(redoAction)
            }
        }
    })();
    var fusenWidthScaleOperation = (function() {
        var initialX;
        var initialY;
        var startWidth;
        var startHeight;
        var initialTopLeftX;
        var initialTopLeftY;
        var initialDistanceFromTopLeft;
        var initialWidthForUndo;
        var initialHeightForUndo;
        return {
            notifyDragstart: function(e, targetPane) {
                removeRotateHandle();
                fusenRect = fusenPane.getBoundingClientRect();
                initialX = e.clientX;
                initialY = e.clientY;
                startWidth = fusenPane.width;
                startHeight = fusenPane.height;
                hiddenScaleVisibility();
                var topLeftRect = scaleTopLeftHandle.getBoundingClientRect();
                initialTopLeftX = topLeftRect.left;
                initialTopLeftY = topLeftRect.top;
                var dx3 = (initialX - initialTopLeftX);
                var dy3 = (initialY - initialTopLeftY);
                initialDistanceFromTopLeft = Math.sqrt(dx3 * dx3 + dy3 * dy3);
                initialWidthForUndo = fusenPane.width;
                initialHeightForUndo = fusenPane.height
            },
            notifyDragMove: function(e, targetPane) {
                var dx3 = (e.clientX - initialTopLeftX);
                var dy3 = (e.clientY - initialTopLeftY);
                var currentDistanceFromTopLeft = Math.sqrt(dx3 * dx3 + dy3 * dy3);
                var resultScale = currentDistanceFromTopLeft / initialDistanceFromTopLeft;
                var width = startWidth * resultScale;
                var height = startHeight * resultScale;
                fusenPane.width = width;
                fusenPane.height = startHeight
            },
            notifyDragEnd: function(e, targetPane) {
                removeScaleHandle();
                addOperateHandle()
            }
        }
    })();
    var fusenHeightScaleOperation = (function() {
        var initialX;
        var initialY;
        var startWidth;
        var startHeight;
        var initialTopLeftX;
        var initialTopLeftY;
        var initialDistanceFromTopLeft;
        var initialWidthForUndo;
        var initialHeightForUndo;
        return {
            notifyDragstart: function(e, targetPane) {
                removeRotateHandle();
                fusenRect = fusenPane.getBoundingClientRect();
                initialX = e.clientX;
                initialY = e.clientY;
                startWidth = fusenPane.width;
                startHeight = fusenPane.height;
                hiddenScaleVisibility();
                var topLeftRect = scaleTopLeftHandle.getBoundingClientRect();
                initialTopLeftX = topLeftRect.left;
                initialTopLeftY = topLeftRect.top;
                var dx3 = (initialX - initialTopLeftX);
                var dy3 = (initialY - initialTopLeftY);
                initialDistanceFromTopLeft = Math.sqrt(dx3 * dx3 + dy3 * dy3);
                initialWidthForUndo = fusenPane.width;
                initialHeightForUndo = fusenPane.height
            },
            notifyDragMove: function(e, targetPane) {
                var dx3 = (e.clientX - initialTopLeftX);
                var dy3 = (e.clientY - initialTopLeftY);
                var currentDistanceFromTopLeft = Math.sqrt(dx3 * dx3 + dy3 * dy3);
                var resultScale = currentDistanceFromTopLeft / initialDistanceFromTopLeft;
                var width = startWidth * resultScale;
                var height = startHeight * resultScale;
                fusenPane.width = startWidth;
                fusenPane.height = height
            },
            notifyDragEnd: function(e, targetPane) {
                removeScaleHandle();
                addOperateHandle()
            }
        }
    })();

    function dragStart(e) {
        if (isSet) {
            if (e.target.className === "rotateHandle") {
                targetOperation = fusenRotateOperation;
                targetPane = rotatePane
            } else if (e.target.className === "scaleHandle") {
                targetOperation = fusenScaleOperation;
                targetPane = fusenPane
            } else if (e.target.className === "scaleBottomLeftHandle") {
                targetOperation = fusenHeightScaleOperation;
                targetPane = fusenPane
            } else if (e.target.className === "scaleTopRightHandle") {
                targetOperation = fusenWidthScaleOperation;
                targetPane = fusenPane
            } else if (e.target.name === "fusen") {
                targetOperation = fusenTranslateOperation;
                targetPane = transLatePane
            } else {
                return
            }
            targetOperation.notifyDragstart(e, targetPane)
        }
    };

    function dragMove(e) {
        if (targetOperation != null) {
            targetOperation.notifyDragMove(e, targetPane)
        }
    };

    function dragEnd(e) {
        if (targetOperation != null) {
            targetOperation.notifyDragEnd(e, targetPane);
            targetOperation = null;
            targetPane = null
        }
    };
    var selectedFusenID;
    var fusenPane;
    var transLatePane;
    var rotatePane;
    var rotateHandle;
    var scaleHandle;
    var scaleBottomLeftHandle;
    var scaleTopRightHandle;
    var scaleTopLeftHandle;
    var isSet = false;

    function setSelectedFusenPaneInfo(targetID) {
        selectedFusenID = targetID;
        fusenPane = document.getElementById(selectedFusenID);
        transLatePane = fusenUtil.translatePane(selectedFusenID);
        rotatePane = fusenUtil.rotatePane(selectedFusenID);
        isSet = true
    };

    function initializeFusenPaneInfo() {
        selectedFusenID = null;
        fusenPane = null;
        transLatePane = null;
        rotatePane = null;
        rotateHandle = null;
        isSet = false
    };

    function addHandle(targetID) {
        if (selectedFusenID != targetID) {
            delHandle();
            setSelectedFusenPaneInfo(targetID);
            addRotateHandle();
            addScaleHandle();
            fusenPane.style.border = "solid 1px black"
        }
    };

    function addOperateHandle() {
        addRotateHandle();
        addScaleHandle()
    };

    function addRotateHandle() {
        rotateHandle = document.createElement("img");
        rotateHandle.id = selectedFusenId + "rotateHandle";
        rotateHandle.className = "rotateHandle";
        rotateHandle.src = "./images/kaiten.png";
        rotateHandle.style.height = "30px";
        rotateHandle.style.transformOrigin = "center top";
        var transLateY = -26;
        rotateHandle.style.transform = " translate(0px, " + transLateY + "px)";
        rotateHandle.style.right = "0px";
        var left = (fusenPane.width / 2) + "px";
        rotateHandle.style.left = left;
        if (isVertical) {
            rotateHandle.style.left = 0 + "px";
            var right = (fusenPane.width / 2) + "px";
            rotateHandle.style.right = right
        }
        rotateHandle.style.position = "absolute";
        rotatePane.appendChild(rotateHandle)
    };

    function addScaleHandle() {
        scaleHandle = document.createElement("div");
        scaleHandle.id = selectedFusenID + "scaleHandle";
        scaleHandle.className = "scaleHandle";
        var handleSize = 10;
        scaleHandle.style.width = handleSize + "px";
        scaleHandle.style.height = handleSize + "px";
        scaleHandle.style.transform = "scale(1.0, 1.0)";
        scaleHandle.style.border = "1px solid gray";
        scaleHandle.style.backgroundColor = "white";
        scaleHandle.style.position = "absolute";
        scaleHandle.style.margin = "auto";
        var left = fusenPane.width + "px";
        var top = fusenPane.height + "px";
        scaleHandle.style.left = left;
        scaleHandle.style.top = top;
        rotatePane.appendChild(scaleHandle);
        scaleBottomLeftHandle = document.createElement("div");
        scaleBottomLeftHandle.id = selectedFusenID + "scaleBottomLeftHandle";
        scaleBottomLeftHandle.className = "scaleBottomLeftHandle";
        scaleBottomLeftHandle.style.width = "10px";
        scaleBottomLeftHandle.style.height = "10px";
        scaleBottomLeftHandle.style.border = "1px solid gray";
        scaleBottomLeftHandle.style.backgroundColor = "white";
        scaleBottomLeftHandle.style.position = "absolute";
        scaleBottomLeftHandle.style.margin = "auto";
        var leftBottomLeft = -10 + "px";
        var topBottomLeft = fusenPane.height + "px";
        scaleBottomLeftHandle.style.left = leftBottomLeft;
        scaleBottomLeftHandle.style.top = topBottomLeft;
        rotatePane.appendChild(scaleBottomLeftHandle);
        scaleTopRightHandle = document.createElement("div");
        scaleTopRightHandle.id = selectedFusenID + "scaleTopRightHandle";
        scaleTopRightHandle.className = "scaleTopRightHandle";
        scaleTopRightHandle.style.width = "10px";
        scaleTopRightHandle.style.height = "10px";
        scaleTopRightHandle.style.border = "1px solid gray";
        scaleTopRightHandle.style.backgroundColor = "white";
        scaleTopRightHandle.style.position = "absolute";
        scaleTopRightHandle.style.margin = "auto";
        var leftTopRight = fusenPane.width + "px";
        var topTopRight = -10 + "px";
        scaleTopRightHandle.style.left = leftTopRight;
        scaleTopRightHandle.style.top = topTopRight;
        rotatePane.appendChild(scaleTopRightHandle);
        scaleTopLeftHandle = document.createElement("div");
        scaleTopLeftHandle.id = selectedFusenID + "scaleTopLeftHandle";
        scaleTopLeftHandle.className = "scaleTopLeftHandle";
        scaleTopLeftHandle.style.width = "1px";
        scaleTopLeftHandle.style.height = "1px";
        scaleTopLeftHandle.style.position = "absolute";
        scaleTopLeftHandle.style.margin = "auto";
        var leftTopLeft = 0 + "px";
        var topTopLeft = 0 + "px";
        scaleTopLeftHandle.style.left = leftTopLeft;
        scaleTopLeftHandle.style.top = topTopLeft;
        rotatePane.appendChild(scaleTopLeftHandle)
    };

    function hiddenScaleVisibility() {
        scaleHandle.style.border = "";
        scaleHandle.style.backgroundColor = "transparent";
        scaleTopRightHandle.style.border = "";
        scaleTopRightHandle.style.backgroundColor = "transparent";
        scaleBottomLeftHandle.style.border = "";
        scaleBottomLeftHandle.style.background = "transparent"
    };

    function removeRotateHandle() {
        
        var rotatePaneChildren = rotatePane.children;
        for (var i = 0; i < rotatePaneChildren.length; i++) {
            var taisho = rotatePaneChildren[i];
            if (rotateHandle === taisho) {
                rotatePane.removeChild(rotateHandle)
            }
        }
        
        //rotatePane.removeChild(rotateHandle)
    };

    function removeScaleHandle() {
        
        var rotatePaneChildren = rotatePane.children;
        var removeElements = [];
        for (var i = 0; i < rotatePaneChildren.length; i++) {
            var taisho = rotatePaneChildren[i];
            if (taisho.className == "scaleHandle") {
                removeElements.push(taisho);
            }
            else if (taisho.className == "scaleBottomLeftHandle") {
                removeElements.push(taisho);
            }
            else if (taisho.className == "scaleTopRightHandle") {
                removeElements.push(taisho);
            }
            else if (taisho.className == "scaleTopLeftHandle") {
                removeElements.push(taisho);
            }
            
            /*
            if (scaleTopLeftHandle === taisho) {
                rotatePane.removeChild(scaleTopLeftHandle)
            }
            */
        }
        
        for(var i = 0; i < removeElements.length; i++){
            var removeElement = removeElements[i];
            rotatePane.removeChild(removeElement);
        }
        
        /*
        rotatePane.removeChild(scaleHandle);
        rotatePane.removeChild(scaleBottomLeftHandle);
        rotatePane.removeChild(scaleTopRightHandle)
        */
    };

    function removeOperateHandle() {
        removeRotateHandle();
        removeScaleHandle()
    };

    function delHandle() {
        if (isSet) {
            removeOperateHandle();
            fusenPane.style.border = "1px solid #ddd";
            initializeFusenPaneInfo()
        }
    };
    var fusenRotateFlag = false;
    var rotateHandleRect;
    var fusenRect;
    var targetOperation;
    var targetPane;

    function changeFusenGazou() {
        var bufu = fusenPane.src.split("/");
        var imgFileName = bufu[bufu.length - 1];
        if (imgFileName == "fusen_on.png") {
            fusenPane.src = "./images/fusen_off.png"
        } else {
            fusenPane.src = "./images/fusen_on.png"
        }
    };

    function changeFusenGazouForEtsuran(fusenID) {
        fusenPane = document.getElementById(fusenID);
        changeFusenGazou()
    };

    function keyDowned(e) {
        if (isSet && (e.keyCode === 46)) {
            removeOperateHandle();
            fusenPane.style.border = "1px solid #ddd";
            var removePane = transLatePane;
            var parentPane = removePane.parentElement;
            var undoAction = function() {
                parentPane.appendChild(removePane)
            };
            undoOperation.setUndoAction(undoAction);
            var redoAction = function() {
                $(removePane).remove()
            };
            undoOperation.setRedoAction(redoAction);
            $(removePane).remove();
            initializeFusenPaneInfo()
        }
    };

    function fusenSaveData() {
        var fusenItems = document.getElementById('fusenContents').children;
        var fusenDataList = [];
        for (var i = 0; i < fusenItems.length; i += 1) {
            var fusenTranslatePane = fusenItems[i];
            var fusenTransLatePaneStyle = fusenTranslatePane.getAttribute("style");
            var fusenRotatePane = fusenTranslatePane.firstElementChild;
            var fusenRotatePaneStyle = fusenRotatePane.getAttribute("style");
            var fusen = fusenRotatePane.firstElementChild;
            var fusenWidth = fusen.getAttribute("width");
            var fusenHeight = fusen.getAttribute("height");
            if (fusenWidth == null) {
                fusenWidth = fusen.width
            }
            if (fusenHeight == null) {
                fusenHeight = fusen.height
            }
            console.log("fusenWidth" + fusenWidth);
            console.log("fusenHeight" + fusenHeight);
            var fusenName = fusen.id;
            var fusenData = {
                "translateStyle": fusenTransLatePaneStyle,
                "rotatePaneStyle": fusenRotatePaneStyle,
                "width": fusenWidth,
                "height": fusenHeight,
                "fusenName": fusenName
            };
            fusenDataList.push(JSON.stringify(fusenData))
        }
        return JSON.stringify(fusenDataList)
    };

    function loadFuenContents(fusenList) {
        for (var i = 0; i < fusenList.length; i += 1) {
            var fusenData = JSON.parse(fusenList[i]);
            fusenInsertOperation.load(fusenData)
        }
    };

    function getFusenContents(fusenList) {
        var fusenParent = document.createElement("div");
        for (var i = 0; i < fusenList.length; i += 1) {
            var fusenData = JSON.parse(fusenList[i]);
            var contents = fusenInsertOperation.get(fusenData);
            $(fusenParent).append($(contents))
        }
        return fusenParent
    };

    function adjustAllForEducation(holizonalValue) {
        var contents = document.getElementById("fusenContents");
        var translatePanes = contents.children;
        for (var i = 0; i < translatePanes.length; i++) {
            var taisho = translatePanes[i];
            adjustTranslatePaneForEducation(taisho, holizonalValue)
        }
    };

    function adjustTranslatePaneForEducation(translatePane, holizonalValue) {
        var left = 0;
        var newLeft;
        if (translatePane.style) {
            if (translatePane.style.left != "") {
                left = parseInt(translatePane.style.left)
            }
            newLeft = left - holizonalValue
        } else {
            newLeft = -holizonalValue
        }
        translatePane.style.left = newLeft + "px"
    };

    function adjustPercentForEducation(percent) {
        var contents = document.getElementById("fusenContents");
        var translatePanes = contents.children;
        for (var i = 0; i < translatePanes.length; i++) {
            var taisho = translatePanes[i];
            adjustTranslatePanePercent(taisho, percent)
        }
    };

    function adjustTranslatePanePercent(translatePane, percent) {
        if (translatePane.style) {
            if (translatePane.style.left != "") {
                var left = parseInt(translatePane.style.left);
                var newLeft = left * percent;
                translatePane.style.left = newLeft + "px"
            }
        }
    };
    return {
        fusenInsert: function() {
            insert()
        },
        selected: function(targetID) {
            addHandle(targetID)
        },
        nonSelected: function() {
            delHandle()
        },
        notifyDragStart: function(e) {
            dragStart(e)
        },
        notifyDragMove: function(e) {
            dragMove(e)
        },
        notifyDragEnd: function(e) {
            dragEnd(e)
        },
        notifyKeyDown: function(e) {
            keyDowned(e)
        },
        changeFusenGazou: function() {
            changeFusenGazou()
        },
        changeFusenGazouFoeEtsuran: function(targetID) {
            changeFusenGazouForEtsuran(targetID)
        },
        getFusenSaveData: function() {
            return fusenSaveData()
        },
        loadFusen: function(fusenList) {
            loadFuenContents(fusenList)
        },
        getFusen: function(fusenList) {
            return getFusenContents(fusenList)
        },
        adjustAllForEducation: function(holizonalValue) {
            adjustAllForEducation(holizonalValue)
        },
        adjustPercentForEducation: function(widthPercent) {
            adjustPercentForEducation(widthPercent)
        }
    }
})();