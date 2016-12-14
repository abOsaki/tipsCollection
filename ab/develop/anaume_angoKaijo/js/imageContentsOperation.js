var ImgOperation = (function() {
    'use strict';
    var imgUtil = (function() {
        function getRotatePaneID(imgID) {
            return (imgID + "rotate")
        };

        function getTranslatePaneID(imgID) {
            return (imgID + "transLate")
        };

        function getTranslate(xValue, yValue) {
            var x = xValue + "px";
            var y = yValue + "px";
            var transform = 'translate(' + x + "," + y + ')';
            return transform
        };
        return {
            translatePaneID: function(imgID) {
                return getTranslatePaneID(imgID)
            },
            translatePane: function(imgID) {
                var id = getTranslatePaneID(imgID);
                return document.getElementById(id)
            },
            rotatePaneID: function(imgID) {
                return getRotatePaneID(imgID)
            },
            rotatePane: function(imgID) {
                var id = getRotatePaneID(imgID);
                return document.getElementById(id)
            },
            getTranslate: function(x, y) {
                return getTranslate(x, y)
            }
        }
    })();
    var imgInsertOperation = (function() {
        var insertImg;
        var transLatePane;
        var rotatePane;

        function insertImage(src, name, id) {
            var img = new Image();
            img.src = src;
            img.onload = function() {
                var canvas = document.createElement("canvas");
                var context = canvas.getContext("2d");
                var maxSize = 500;
                var rw = img.width;
                var rh = img.height;
                if (img.width > img.height) {
                    if (img.width > maxSize) {
                        rw = maxSize;
                        rh = img.height * maxSize / img.width
                    }
                }
                if (img.width < img.height) {
                    if (img.height > maxSize) {
                        rw = img.width * maxSize / img.height;
                        rh = maxSize
                    }
                }
                context.clearRect(0, 0, 0, 0);
                canvas.width = rw;
                canvas.height = rh;
                context.drawImage(img, 0, 0, rw, rh);
                var imgFileName = getNowDate() + name;
                SS.setItem(imgFileName, canvas.toDataURL("image/png"));
                insertImg = document.createElement("img");
                insertImg.id = imgFileName;
                insertImg.name = "gazou";
                insertImg.alt = imgFileName;
                insertImg.src = URL.createObjectURL(base64toBlob(SS.getItem(imgFileName)));
                insertImg.style.verticalAlign = "top";
                var imageContents = document.getElementById(id);
                transLatePane = document.createElement("div");
                transLatePane.id = imgUtil.translatePaneID(imgFileName);
                rotatePane = document.createElement("div");
                rotatePane.id = imgUtil.rotatePaneID(imgFileName);
                rotatePane.style.position = "absolute";
                rotatePane.style.transformOrigin = "center center";
                imageContents.appendChild(transLatePane);
                transLatePane.appendChild(rotatePane);
                rotatePane.appendChild(insertImg)
            }
        };

        function loadImage(imgData) {
            var imgPane = getImagePane(imgData);
            var imageContents = document.getElementById('imageContents');
            imageContents.appendChild(imgPane)
        };

        function setTranslateTransform(translatePane) {
            if (translatePane.style.transform == "") {
                var left = parseInt(translatePane.style.left);
                var top = parseInt(translatePane.style.top);
                var transform = imgUtil.getTranslate(left, top);
                translatePane.style.transform = transform
            }
        };

        function getImagePane(imgData) {
            if (imgData.handle01 == undefined) {
                var imgEle = document.createElement("img");
                imgEle.id = imgData.name;
                imgEle.name = "gazou";
                imgEle.alt = imgData.name;
                imgEle.style.width = imgData.width + "px";
                imgEle.style.height = imgData.height + "px";
                imgEle.style.position = "absolute";
                imageLoad(imgData.name);
                transLatePane = document.createElement("div");
                transLatePane.id = imgUtil.translatePaneID(imgData.name);
                transLatePane.setAttribute("style", imgData.translateStyle);
                setTranslateTransform(transLatePane);
                rotatePane = document.createElement("div");
                rotatePane.id = imgUtil.rotatePaneID(imgData.name);
                rotatePane.setAttribute("style", imgData.rotatePaneStyle);
                rotatePane.setAttribute("ondblclick", imgData.dblclickEvent);
                transLatePane.appendChild(rotatePane);
                rotatePane.appendChild(imgEle);
                return transLatePane
            } else {
                return getImagePaneForOld(imgData)
            }
        };

        function getImagePaneForOld(imgData) {
            var handle01 = document.createElement("div");
            handle01.setAttribute("style", imgData.handle01);
            var translateTransForm = handle01.style.transform;
            var handle02 = document.createElement("div");
            handle02.setAttribute("style", imgData.handle02);
            var scaleTransForm = handle02.style.transform;
            var scaleSeed = scaleTransForm.replace(/[^0-9^\.]/g, "");
            var scale = parseFloat(scaleSeed);
            var handle03 = document.createElement("div");
            handle03.setAttribute("style", imgData.handle03);
            var rotateTransForm = handle03.style.transform;
            var rotateSeed = rotateTransForm.replace(/[^0-9^\.]/g, "");
            var rotate = parseFloat(rotateSeed);
            transLatePane = document.createElement("div");
            transLatePane.id = imgUtil.translatePaneID(imgData.imgName);
            transLatePane.setAttribute("style", handle01.style.cssText);
            var imgEle = document.createElement("img");
            imgEle.id = imgData.imgName;
            imgEle.name = "gazou";
            imgEle.alt = imgData.imgName;
            var width = (imgData.width * scale) + "px";
            var height = (imgData.height * scale) + "px";
            imgEle.style.width = width;
            imgEle.style.height = height;
            imgEle.style.position = "relative";
            imageLoad(imgData.imgName);
            rotatePane = document.createElement("div");
            rotatePane.id = imgUtil.rotatePaneID(imgData.imgName);
            rotatePane.setAttribute("style", imgData.rotatePaneStyle);
            rotatePane.setAttribute("ondblclick", imgData.dblclickEvent);
            if (imgData.dblclickEvent != undefined && imgData.dblclickEvent != null && imgData.dblclickEvent != "") {
                rotatePane.style.border = "1px solid blue"
            }
            transLatePane.appendChild(rotatePane);
            rotatePane.appendChild(imgEle);
            return transLatePane
        };

        function getImagePaneForEtsuran(imgData) {
            var imgEle = document.createElement("img");
            imgEle.id = imgData.name;
            imgEle.name = "gazou";
            imgEle.alt = imgData.imgName;
            imgEle.style.width = imgData.width + "px";
            imgEle.style.height = imgData.height + "px";
            imgEle.style.position = "relative";
            transLatePane = document.createElement("div");
            transLatePane.id = imgUtil.translatePaneID(imgData.name);
            transLatePane.setAttribute("style", imgData.translateStyle);
            setTranslateTransform(transLatePane);
            rotatePane = document.createElement("div");
            rotatePane.id = imgUtil.rotatePaneID(imgData.name);
            rotatePane.setAttribute("style", imgData.rotatePaneStyle);
            rotatePane.setAttribute("ondblclick", imgData.dblclickEvent);
            transLatePane.appendChild(rotatePane);
            rotatePane.appendChild(imgEle);
            return transLatePane
        };
        return {
            insert: function(src, name, id) {
                insertImage(src, name, id)
            },
            load: function(imgData) {
                loadImage(imgData)
            },
            get: function(imgData) {
                return getImagePaneForEtsuran(imgData)
            }
        }
    })();
    var translateOperation = (function() {
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
                translatePane.style.transform = imgUtil.getTranslate(moveX, moveY)
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
                        translatePane.style.transform = imgUtil.getTranslate(initialLeftForUndo, initialTopForUndo)
                    };
                    undoOperation.setUndoAction(undoAction);
                    var redoAction = function() {
                        translatePane.style.left = endLeftForUndo;
                        translatePane.style.top = endTopForUndo;
                        translatePane.style.transform = imgUtil.getTranslate(endLeftForUndo, endTopForUndo)
                    };
                    undoOperation.setRedoAction(redoAction)
                }
            }
        }
    })();
    var rotateOperation = (function() {
        var initializeTransformOrigionForUndo;
        var initializeTransformForUndo;
        return {
            notifyDragstart: function(e, targetPane) {
                initializeTransformOrigionForUndo = targetPane.style.transformOrigin;
                initializeTransformForUndo = targetPane.style.transform
            },
            notifyDragMove: function(e, targetPane) {
                var rotateHandleRect = imgPane.getBoundingClientRect();
                var gazouCX = (rotateHandleRect.left + rotateHandleRect.right) * 0.5;
                var gazouCY = (rotateHandleRect.top + rotateHandleRect.bottom) * 0.5;
                var rotateHX = e.clientX;
                var rotateHY = e.clientY;
                var rad = Math.atan2(rotateHY - gazouCY, rotateHX - gazouCX);
                var angle = (rad * 180) / Math.PI + 90;
                var xOrigin = (imgPane.width / 2) + "px";
                var yOrigin = (imgPane.height / 2) + "px";
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
    var scaleOperation = (function() {
        var initialX;
        var initialY;
        var initialBottomLeftX;
        var initialBottomLeftY;
        var initialTopRightX;
        var initialTopRightY;
        var initialTopLeftX;
        var initialTopLeftY;
        var initialDistanceFromBottomLeft;
        var initialDistanceFromTopRight;
        var initialDistanceFromTopLeft;
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
                fusenRect = imgPane.getBoundingClientRect();
                initialX = e.clientX;
                initialY = e.clientY;
                startWidth = imgPane.width;
                startHeight = imgPane.height;
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
                var topLeftRect = scaleTopLeftHandle.getBoundingClientRect();
                initialTopLeftX = topLeftRect.left;
                initialTopLeftY = topLeftRect.top;
                var dx3 = (initialX - initialTopLeftX);
                var dy3 = (initialY - initialTopLeftY);
                initialDistanceFromTopLeft = Math.sqrt(dx3 * dx3 + dy3 * dy3);
                initialWidthForUndo = imgPane.style.width;
                initialHeightForUndo = imgPane.style.height
            },
            notifyDragMove: function(e, targetPane) {
                var dx3 = (e.clientX - initialTopLeftX);
                var dy3 = (e.clientY - initialTopLeftY);
                var currentDistanceFromTopLeft = Math.sqrt(dx3 * dx3 + dy3 * dy3);
                var resultScale = currentDistanceFromTopLeft / initialDistanceFromTopLeft;
                var width = startWidth * resultScale;
                var height = startHeight * resultScale;
                imgPane.style.width = width + "px";
                imgPane.style.height = height + "px"
            },
            notifyDragEnd: function(e, targetPane) {
                removeScaleHandle();
                addOperateHandle();
                var undoAction = function() {
                    targetPane.style.width = initialWidthForUndo;
                    targetPane.style.height = initialHeightForUndo
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
    var targetDragOperation;
    var targetDragPane;
    var imgRect;

    function dragStart(e) {
        if (isSet) {
            if (e.target.className === "rotateHandle") {
                targetDragOperation = rotateOperation;
                targetDragPane = rotatePane
            } else if (e.target.className === "scaleHandle") {
                targetDragOperation = scaleOperation;
                targetDragPane = imgPane
            } else if (e.target.name === "gazou") {
                targetDragOperation = translateOperation;
                targetDragPane = transLatePane
            } else {
                return
            }
            targetDragOperation.notifyDragstart(e, targetDragPane)
        }
    };

    function dragMove(e) {
        if (targetDragOperation != null) {
            targetDragOperation.notifyDragMove(e, targetDragPane)
        }
    };

    function dragEnd(e) {
        if (targetDragOperation != null) {
            targetDragOperation.notifyDragEnd(e, targetDragPane);
            targetDragOperation = null;
            targetDragPane = null
        }
    };
    var selectedID;
    var isSet = false;
    var imgPane;
    var transLatePane;
    var rotatePane;
    var rotateHandle;
    var scaleHandle;
    var scaleBottomLeftHandle;
    var scaleTopRightHandle;
    var scaleTopLeftHandle;

    function addHandle(targetID) {
        if (selectedID != targetID) {
            delHandle();
            setSelectedPaneInfo(targetID);
            addRotateHandle();
            addScaleHandle();
            imgPane.style.border = "solid 1px black"
        }
    };

    function delHandle() {
        if (isSet) {
            removeOperateHandle();
            imgPane.style.border = "";
            initializeFusenPaneInfo()
        }
    };

    function hiddenScaleVisibility() {
        scaleHandle.style.border = "";
        scaleHandle.style.backgroundColor = "transparent"
    };

    function removeOperateHandle() {
        removeRotateHandle();
        removeScaleHandle()
    };

    function removeRotateHandle() {
        var rotatePaneChildren = rotatePane.children;
        for (var i = 0; i < rotatePaneChildren.length; i++) {
            var taisho = rotatePaneChildren[i];
            if (rotateHandle === taisho) {
                rotatePane.removeChild(rotateHandle)
            }
        }
    };

    function removeScaleHandle() {
        var rotatePaneChildren = rotatePane.children;
        for (var i = 0; i < rotatePaneChildren.length; i++) {
            var taisho = rotatePaneChildren[i];
            if (scaleHandle === taisho) {
                rotatePane.removeChild(scaleHandle)
            }
            if (scaleBottomLeftHandle === taisho) {
                rotatePane.removeChild(scaleBottomLeftHandle)
            }
            if (scaleTopRightHandle === taisho) {
                rotatePane.removeChild(scaleTopRightHandle)
            }
            if (scaleTopLeftHandle === taisho) {
                rotatePane.removeChild(scaleTopLeftHandle)
            }
        }
    };

    function initializeFusenPaneInfo() {
        selectedID = null;
        imgPane = null;
        transLatePane = null;
        rotatePane = null;
        rotateHandle = null;
        isSet = false
    };

    function setSelectedPaneInfo(targetID) {
        selectedID = targetID;
        imgPane = document.getElementById(selectedID);
        transLatePane = imgUtil.translatePane(selectedID);
        rotatePane = imgUtil.rotatePane(selectedID);
        isSet = true
    };

    function addOperateHandle() {
        addRotateHandle();
        addScaleHandle()
    };

    function addRotateHandle() {
        rotateHandle = document.createElement("img");
        rotateHandle.id = selectedID + "rotateHandle";
        rotateHandle.className = "rotateHandle";
        rotateHandle.src = "./images/kaiten.png";
        rotateHandle.style.height = "30px";
        rotateHandle.style.transformOrigin = "center top";
        var transLateY = -26;
        rotateHandle.style.transform = " translate(0px, " + transLateY + "px)";
        rotateHandle.style.right = "0px";
        var left = (imgPane.width / 2) + "px";
        rotateHandle.style.left = left;
        if (isVertical) {
            rotateHandle.style.left = 0 + "px";
            var right = (imgPane.width / 2) + "px";
            rotateHandle.style.right = right
        }
        rotateHandle.style.position = "absolute";
        rotatePane.appendChild(rotateHandle)
    };

    function addScaleHandle() {
        scaleHandle = document.createElement("div");
        scaleHandle.id = selectedID + "scaleHandle";
        scaleHandle.className = "scaleHandle";
        var handleSize = 10;
        scaleHandle.style.width = handleSize + "px";
        scaleHandle.style.height = handleSize + "px";
        scaleHandle.style.transform = "scale(1.0, 1.0)";
        scaleHandle.style.border = "1px solid gray";
        scaleHandle.style.backgroundColor = "white";
        scaleHandle.style.position = "absolute";
        scaleHandle.style.margin = "auto";
        var left = imgPane.width + "px";
        var top = imgPane.height + "px";
        scaleHandle.style.left = left;
        scaleHandle.style.top = top;
        rotatePane.appendChild(scaleHandle);
        scaleBottomLeftHandle = document.createElement("div");
        scaleBottomLeftHandle.id = selectedID + "scaleBottomLeftHandle";
        scaleBottomLeftHandle.className = "scaleBottomLeftHandle";
        scaleBottomLeftHandle.style.width = "1px";
        scaleBottomLeftHandle.style.height = "1px";
        scaleBottomLeftHandle.style.position = "absolute";
        scaleBottomLeftHandle.style.margin = "auto";
        var leftBottomLeft = 0 + "px";
        var topBottomLeft = imgPane.height + "px";
        scaleBottomLeftHandle.style.left = leftBottomLeft;
        scaleBottomLeftHandle.style.top = topBottomLeft;
        rotatePane.appendChild(scaleBottomLeftHandle);
        scaleTopRightHandle = document.createElement("div");
        scaleTopRightHandle.id = selectedID + "scaleTopRightHandleHandle";
        scaleTopRightHandle.className = "scaleTopRightHandleHandle";
        scaleTopRightHandle.style.width = "1px";
        scaleTopRightHandle.style.height = "1px";
        scaleTopRightHandle.style.position = "absolute";
        scaleTopRightHandle.style.margin = "auto";
        var leftTopRight = imgPane.width + "px";
        var topTopRight = 0 + "px";
        scaleTopRightHandle.style.left = leftTopRight;
        scaleTopRightHandle.style.top = topTopRight;
        rotatePane.appendChild(scaleTopRightHandle);
        scaleTopLeftHandle = document.createElement("div");
        scaleTopLeftHandle.id = selectedID + "scaleTopLeftHandleHandle";
        scaleTopLeftHandle.className = "scaleTopLeftHandleHandle";
        scaleTopLeftHandle.style.width = "1px";
        scaleTopLeftHandle.style.height = "1px";
        scaleTopLeftHandle.style.position = "absolute";
        scaleTopLeftHandle.style.margin = "auto";
        var leftTopRight = 0 + "px";
        var topTopRight = 0 + "px";
        scaleTopLeftHandle.style.left = leftTopRight;
        scaleTopLeftHandle.style.top = topTopRight;
        rotatePane.appendChild(scaleTopLeftHandle)
    };

    function keyDowned(e) {
        if (isSet && (e.keyCode === 46)) {
            removeOperateHandle();
            imgPane.style.border = "";
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

    function saveData() {
        var items = document.getElementById('imageContents').children;
        var dataList = [];
        for (var i = 0; i < items.length; i += 1) {
            var translatePane = items[i];
            var transLatePaneStyle = translatePane.getAttribute("style");
            var rotatePane = translatePane.firstElementChild;
            var rotatePaneStyle = rotatePane.getAttribute("style");
            var dbClick = rotatePane.getAttribute("ondblclick");
            var gazou = rotatePane.firstElementChild;
            var gazouWidth = gazou.width;
            var gazouHeight = gazou.height;
            var gazouName = gazou.id;
            var data = {
                "dblclickEvent": dbClick,
                "translateStyle": transLatePaneStyle,
                "rotatePaneStyle": rotatePaneStyle,
                "width": gazouWidth,
                "height": gazouHeight,
                "name": gazouName
            };
            dataList.push(JSON.stringify(data))
        }
        return JSON.stringify(dataList)
    };

    function loadImgContents(imgList) {
        for (var i = 0; i < imgList.length; i += 1) {
            var imgData = JSON.parse(imgList[i]);
            imgInsertOperation.load(imgData)
        }
    };

    function getImgContents(imgList, loadCallback) {
        var imgParent = document.createElement("div");
        for (var i = 0; i < imgList.length; i += 1) {
            var imgData = JSON.parse(imgList[i]);
            var contents = imgInsertOperation.get(imgData);
            $(imgParent).append($(contents))
        }
        return imgParent
    };

    function adjustAllImgForEducation(holizonalValue) {
        var imageContents = document.getElementById("imageContents");
        var imageTranslatePanes = imageContents.children;
        for (var i = 0; i < imageTranslatePanes.length; i++) {
            var taisho = imageTranslatePanes[i];
            adjustTranslatePaneForEducation(taisho, holizonalValue)
        }
    };

    function adjustTranslatePaneForEducation(translatePane, holizonalValue) {
        var left = 0;
        var top = 0;
        var transform;
        var newLeft;
        if (translatePane.style) {
            if (translatePane.style.left != "") {
                left = parseInt(translatePane.style.left)
            }
            if (translatePane.style.top != "") {
                top = parseInt(translatePane.style.top)
            }
            newLeft = left - holizonalValue;
            translatePane.style.left = newLeft + "px";
            transform = imgUtil.getTranslate(newLeft, top);
            translatePane.style.transform = transform
        } else {
            newLeft = -holizonalValue;
            translatePane.style.left = newLeft + "px";
            transform = imgUtil.getTranslate(newLeft, top);
            translatePane.style.transform = transform
        }
    };
    return {
        insert: function(src, name, id) {
            imgInsertOperation.insert(src, name, id)
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
        getSaveData: function() {
            return saveData()
        },
        loadImg: function(imgList) {
            loadImgContents(imgList)
        },
        getImgPane: function(imgList) {
            return getImgContents(imgList)
        },
        isSelected: function() {
            return isSet
        },
        getSelectedID: function() {
            return selectedID
        },
        getSelectedImg: function() {
            return imgPane
        },
        adjustAllImgForEducation: function(holizonalValue) {
            adjustAllImgForEducation(holizonalValue)
        }
    }
}());