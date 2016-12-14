var rubyObjectOperation = (function(){
    'use strict';
    
    var rubyUtil = (function(){
        
        function getTranslatePaneID(rubyID){
            return (rubyID + "translate");
        }
        
        function getTranslate(xValue,yValue){
            var x = xValue + "px";
            var y = yValue + "px";
            var transform = 'translate(' + x + "," + y + ')';
            return transform
        }
        
        return {
            translatePaneID: function(rubyID){
                return getTranslatePaneID(rubyID);
            },
            translatePane : function(rubyID){
                var id = getTranslatePaneID(rubyID);
                return document.getElementById(id);
            },
            getTranslate: function(x, y) {
                return getTranslate(x, y)
            }
        }
    })();
    
    var rubyInsertOperation = (function(){
        function getRubyID(pvText){
            var result = 'ruby' + commonfn.getNowDate() + "%" + pvText;
            return result;
        }
        
        function insertRuby(rubyText){
            var id = getRubyID(rubyText);
            var rubyObject = document.createElement("input");
            rubyObject.setAttribute("type","text");
            rubyObject.setAttribute("readonly","readonly");
            rubyObject.style.cursor = "pointer";
            
            rubyObject.id = id;
            rubyObject.name = "rubyObject";
            rubyObject.value = rubyText;
            rubyObject.style.border = "none";
            rubyObject.style.transformOrigin = "top left";
            
            /*
            if(isLeft){
                rubyObject.style["text-align"] = "left";
            }else{
                rubyObject.style["text-align"] = "center";
            }
            */
            
            //文字数の取得
            var textLength = rubyText.length;
            //長さ
            var length = textLength + 0.2 + "em";
            
            if(isVertical){
                //縦書きの場合
                rubyObject.style.height = length;
                rubyObject.className = "verticalRuby";
                rubyObject.style.fontFamily = "HG教科書体";
                /*
                rubyObject.setAttribute("height",length);
                rubyObject.setAttribute("direction","ltr");
                rubyObject.setAttribute("writing-mode","tb-rl");
                */
            }else{
                //横書きの場合
                
                if(textLength > 4){
                    var hosei = textLength / 7;
                    length = textLength - hosei + "em";
                }else{
                    length = textLength + "em";
                }
                
                //length = textLength - hosei + "em";
                rubyObject.style.width = length;
                rubyObject.className = "holizonalRuby";
            }
            
            var translatePane = document.createElement("div");
            translatePane.id = rubyUtil.translatePaneID(id);
            
            /*
            if(isVertical){
                translatePane.style.left = -100 + "px";
                translatePane.style.top = 100 + "px";
                translatePane.style.transform = rubyUtil.getTranslate(-100, 100);
            }else{
                translatePane.style.left = 100 + "px";
                translatePane.style.top = 100 + "px";
                translatePane.style.transform = rubyUtil.getTranslate(100, 100);
            }
            */
            
            
            translatePane.style.position = "absolute";
            var rubyContents = document.getElementById("rubyContents");
            rubyContents.appendChild(translatePane);
            translatePane.appendChild(rubyObject);
        }
        
        function loadRuby(rubyData){
            
        }
        
        function getRuby(rubyData){
            
        }
        
        return {
            insert: function(rubyText,isLeft) {
                insertRuby(rubyText,isLeft)
            },
            load: function(rubyData){
                loadRuby(rubyData);
            },
            get: function(rubyData){
                return getRuby(rubyData);
            }
        }
        
        
    })();
    
    function insert(rubyText){
        rubyInsertOperation.insert(rubyText);
    }
    
    var selectedID;
    var rubyPane;
    var translatePane;
    var translateHandle;
    var scaleHandle;
    var isSet = false;
    
    function addHandle(targetID){
        if(selectedID != targetID){
            delHandle();
            setSelectedRubyPaneInfo(targetID);
            setScaleHandle();
            setRubyBorder();
        }
    }
    
    function delHandle() {
        if (isSet) {
            removeOperateHandle();
            removeRubyBorder();
            initializeRubyPaneInfo()
        }
    }
    
    function removeOperateHandle(){
        removeScaleHandle();
    }
    
    function removeRubyBorder(){
        rubyPane.style.border = "none";
    }
    
    function removeScaleHandle(){
        var children = translatePane.children;
        for(var i = 0; i < children.length; i++){
            var taisho = children[i];
            if(taisho === scaleHandle){
                translatePane.removeChild(scaleHandle);
            }
        }
    }
    
    function initializeRubyPaneInfo(){
        selectedID = null;
        rubyPane = null;
        translatePane = null;
        translateHandle = null;
        isSet = false;
    }
    
    function setSelectedRubyPaneInfo(targetID){
        selectedID = targetID;
        rubyPane = document.getElementById(selectedID);
        translatePane = rubyUtil.translatePane(selectedID);
        
        isSet = true;
    }
    
    function setScaleHandle(){
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
        
        var left;
        var top;
        if(isVertical){
            left = -rubyPane.clientWidth + handleSize + "px";
            top = rubyPane.clientHeight + "px";
            //重み付け
            var transScale = rubyPane.style.transform.match(/scale\((.*?)\)/);
            if(transScale){
                var scale = transScale[1];
                left = (-rubyPane.clientWidth * scale) + handleSize + "px";
                top = (rubyPane.clientHeight * scale) + "px";
            }
        }else{
            left = rubyPane.clientWidth + "px";
            top = rubyPane.clientHeight + "px";
            //重み付け
            var transScale = rubyPane.style.transform.match(/scale\((.*?)\)/);
            if(transScale){
                var scale = transScale[1];
                left = (rubyPane.clientWidth * scale) + "px";
                top = (rubyPane.clientHeight * scale) + "px";
            }
        }
        
        scaleHandle.style.left = left;
        scaleHandle.style.top = top;
        translatePane.appendChild(scaleHandle);
    }
    
    function setRubyBorder(){
        rubyPane.style.border = "1px solid blue";
    }
    
    var translateOperation = (function(){
        var initialX;
        var initialY;
        var startX;
        var startY;
        
        function keepCurrentPoint(e,pvTranslatePane){
            initialX = e.clientX;
            initialY = e.clientY;
            if (pvTranslatePane.style.left != "") {
                startX = parseInt(pvTranslatePane.style.left)
            } else {
                startX = 0
            }
            if (pvTranslatePane.style.top != "") {
                startY = parseInt(pvTranslatePane.style.top)
            } else {
                startY = 0
            }
        }
        
        return {
            notifyDragstart: function(e, pvTranslatePane) {
                keepCurrentPoint(e, pvTranslatePane)
            },
            notifyDragMove: function(e, pvTranslatePane) {
                var moveX = e.clientX - initialX + startX;
                var moveY = e.clientY - initialY + startY;
                pvTranslatePane.style.left = moveX + "px";
                pvTranslatePane.style.top = moveY + "px";
                //pvTranslatePane.style.transform = rubyUtil.getTranslate(moveX, moveY)
            },
            notifyDragEnd: function(e, translatePane) {
                /*
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
                */
            }
        }
        
        
    })();
    
    var scaleOperation = (function(){
        var rubyRect;
        var initialX;
        var initialY;
        var initialTopLeftX;
        var initialTopLeftY;
        var startDistance;
        var startScale;
        
        return {
            notifyDragstart: function(e,targetPan){
                rubyRect = targetPan.getBoundingClientRect();
                initialX = e.clientX;
                initialY = e.clientY;
                
                var scale = targetPan.style.transform.match(/scale\((.*?)\)/);
                
                if(scale){
                    startScale = scale[1];
                }else{
                    startScale = 1;
                }
                
                initialTopLeftX = rubyRect.left;
                initialTopLeftY = rubyRect.top;
                
                var dx = initialX - initialTopLeftX;
                var dy = initialY - initialTopLeftY;
                
                startDistance = Math.sqrt(dx * dx + dy * dy);
                removeScaleHandle();
            },
            notifyDragMove: function(e, targetPane) {
                var dx = e.clientX - initialTopLeftX;
                var dy = e.clientY - initialTopLeftY;
                var currentDistance = Math.sqrt(dx * dx + dy * dy);
                var currentScale = (currentDistance / startDistance) * startScale;
                var scaleText = 'scale(' + currentScale + ')';
                targetPane.style.transform = scaleText;
                
                
                
            },
            notifyDragEnd: function(e, targetPane) {
                
            }
        }
        
    })();
    
    var targetOperation;
    var targetPane
    function dragStart(e){
        if(isSet){
            if(e.target.className == "holizonalRuby" || e.target.className == "verticalRuby"){
                targetOperation = translateOperation;
                targetPane = translatePane;
            }else if(e.target.className === "scaleHandle"){
                targetOperation = scaleOperation;
                targetPane = rubyPane;
            }else{
                return;
            }
            targetOperation.notifyDragstart(e, targetPane);
        }
    }
    
    function dragMove(e){
        if (targetOperation != null) {
            targetOperation.notifyDragMove(e, targetPane)
        }
    }
    
    function dragEnd(e){
        if (targetOperation != null) {
            targetOperation.notifyDragEnd(e, targetPane);
            targetOperation = null;
            targetPane = null
        }
    }
    
    function notifyKeyDown(e){
        
    }
    
    /*
    function loadRubyContents(rubyList){
        for (var i = 0; i < rubyList.length; i += 1) {
            var rubyData = JSON.parse(rubyList[i]);
            rubyInsertOperation.load(rubyData);
        }
    }
    */
    
    function getRubyContents(rubyList){
        var rubyParent = document.createElement("div");
        for (var i = 0; i < rubyList.length; i += 1) {
            var rubyData = JSON.parse(rubyList[i]);
            var contents = rubyInsertOperation.get(rubyData);
            $(rubyParent).append($(contents))
        }
        return rubyParent
    }
    
    function getSaveData(){
        /*
        var rubys = document.getElementById('rubyContents').children;
        var rubyDataList = [];
        for(var i = 0; i < rubys.length; i++){
            var taisho = rubys[i];
            
            var saveData = {
                "outerHTML" : taisho.outerHTML
            };
            
            rubyDataList.push(JSON.stringify(saveData));
            
        }
        return JSON.stringify(rubyDataList);
        */
        delHandle();
        
        return document.getElementById('rubyContents').innerHTML;
        
    }
    
    function loadRuby(rubyList){
        /*
        for(var i = 0; i < rubyList.length; i++){
            var taisho = rubyList[i];
            var data = JSON.parse(taisho);
            var div = document.createElement("div");
            div.outerHTML = data.outerHTML;
            var rubyContents = document.getElementById('rubyContents');
            rubyContents.appendChild(div);
        }
        */
        
        document.getElementById('rubyContents').innerHTML = rubyList;
        writeRubyContents();
    }
    
    function writeRubyContents(){
        var rubys = document.getElementsByName("rubyObject");
        for(var i = 0; i < rubys.length; i++){
            var taisho = rubys[i];
            var text = taisho.id.split("%")[1];
            taisho.value = text;
        }
    }
    
    return {
        insert : function(rubyText){
            insert(rubyText);
        },
        selected : function(targetID){
            addHandle(targetID);
        },
        nonSelected : function(){
            delHandle();
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
        loadRuby: function(rubyList){
            loadRuby(rubyList);
        },
        getRuby : function(rubyList){
            return getRubyContents(rubyList);
        },
        getSaveData : function(){
            return getSaveData();
        },
        writeRuby : function(){
            writeRubyContents();
        }
    }
})();