var audioOperation = (function() {
    var audioUtil = (function() {
        function getTranslatePaneID(audioID) {
            return (audioID + 'translate')
        };

        function getTranslatePane(audioID) {
            var id = getTranslatePaneID(audioID);
            return document.getElementById(id)
        };
        
        function getTranslate(xValue,yValue){
            var x = xValue + "px";
            var y = yValue + "px";
            var transform = 'translate(' + x + "," + y + ')';
            return transform
        }

        function getAudioContents() {
            return document.getElementById('audioContents')
        };

        function getAudioHandleID(audioID) {
            return (audioID + 'audio')
        };

        function getAudioHandle(id) {
            var handleID = getAudioHandleID(id);
            return document.getElementById(handleID)
        };
        return {
            translatePaneID: function(id) {
                return getTranslatePaneID(id)
            },
            translatePane: function(id) {
                return getTranslatePane(id)
            },
            audioContents: function() {
                return getAudioContents()
            },
            audioHandleID: function(id) {
                return getAudioHandleID(id)
            },
            audioHandle: function(id) {
                return getAudioHandle(id)
            },
            getTranslate: function(x, y) {
                return getTranslate(x, y)
            }
        }
    })();
    var audioInsertOperation = (function() {
        function getAudioImage(id) {
            var result = ($("<img/>", {
                "id": id,
                "class": "audio",
                "name": "audio",
                "src": "./images/speaker01.png"
            }).css({
                "box-sizing": "reset",
                "cursor": "pointer"
            }).attr('double', 2))[0];
            result.style.width = "50px";
            result.style.height = "50px";
            return result
        };

        function insetAudio(audioSrc) {
            var id = 'audio' + commonfn.getNowDate();
            var audioImg = getAudioImage(id);
            var transparentPane = document.createElement("div");
            transparentPane.id = audioUtil.translatePaneID(id);
            transparentPane.style.transform = audioUtil.getTranslate(0,0);
            var audioContents = audioUtil.audioContents();
            audioContents.appendChild(transparentPane);
            transparentPane.appendChild(audioImg);
            loadAudioHandlePane(transparentPane, id, audioSrc);
            setDbclick(audioImg)
        };

        function loadAudioHandlePane(transparentPane, audioID, audioSrc) {
            var audio = document.createElement("audio");
            audio.src = audioSrc;
            audio.controls = false;
            audio.id = audioUtil.audioHandleID(audioID);
            transparentPane.appendChild(audio)
        };

        function setDbclick(audioImg) {
            audioImg.addEventListener("dblclick", function(e) {
                var audio = audioUtil.audioHandle(this.id);
                audio.play()
            })
        };

        function get(audioData) {
            var id = audioData.audioID;
            var audioImg = getAudioImage(id);
            var transparentPane = document.createElement("div");
            transparentPane.id = audioUtil.translatePaneID(id);
            var audioContents = audioUtil.audioContents();
            audioContents.appendChild(transparentPane);
            transparentPane.appendChild(audioImg);
            transparentPane.setAttribute("style", audioData.translateStyle);
            transparentPane.style.transform = "";
            audioLoad(id, transparentPane, audioImg);
            return transparentPane
        };

        function load(audioData) {
            var id = audioData.audioID;
            var audioImg = getAudioImage(id);
            var transparentPane = document.createElement("div");
            transparentPane.id = audioUtil.translatePaneID(id);
            var audioContents = audioUtil.audioContents();
            audioContents.appendChild(transparentPane);
            transparentPane.appendChild(audioImg);
            transparentPane.setAttribute("style", audioData.translateStyle);
            audioLoad(id, transparentPane, audioImg)
        };

        function audioLoad(audioID, translatePane, audioImg) {
            var xmlHttpRequest = new XMLHttpRequest();
            xmlHttpRequest.open("POST", "./php/audioLoad.php", true);
            xmlHttpRequest.responseType = "blob";
            xmlHttpRequest.onreadystatechange = function() {
                if (xmlHttpRequest.readyState === 4) {
                    var response = xmlHttpRequest.response;
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL(response);
                    fileReader.onload = function() {
                        SS.setItem(audioID, fileReader.result);
                        var src = URL.createObjectURL(base64toBlob(SS.getItem(audioID)));
                        loadAudioHandlePane(translatePane, audioID, src);
                        setDbclick(audioImg)
                    }
                }
            };
            xmlHttpRequest.send(audioID)
        };

        function setAudio(id) {
            var translatePane = audioUtil.translatePane(id);
            var audioImg = document.getElementById(id);
            audioLoad(id, translatePane, audioImg)
        };
        return {
            insert: function(audioSrc) {
                insetAudio(audioSrc)
            },
            load: function(audioData) {
                load(audioData)
            },
            get: function(audioData) {
                return get(audioData)
            },
            setAudio: function(id) {
                setAudio(id)
            }
        }
    })();

    function insert(audioURL) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(audioURL);
        fileReader.onload = function() {
            audioInsertOperation.insert(fileReader.result)
        }
    };

    function audioUp() {
        var audioContentsID = 'audioContents';
        var input = document.createElement("input");
        input.id = "fileUp";
        input.type = "file";
        input.accept = "audio/*";
        input.style.display = "none";
        input.setAttribute("onchange", "audioOperation.audioInsert(this.files[0])");
        document.getElementById(audioContentsID).appendChild(input);
        document.getElementById("fileUp").click();
        document.getElementById(audioContentsID).removeChild(document.getElementById("fileUp"))
    };
    var audioTranslateOperation = (function() {
        var initialX;
        var initialY;
        var startX;
        var startY;

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
                translatePane.style.transform = audioUtil.getTranslate(moveX,moveY);
            },
            notifyDragEnd: function(e, translatePane) {}
        }
    })();
    var targetOperation;
    var targetPane;

    function dragStart(e) {
        if (isSet) {
            if (e.target.name === 'audio') {
                targetOperation = audioTranslateOperation;
                targetPane = translatePane;
                targetOperation.notifyDragstart(e, targetPane)
            }
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
    var selectedID;
    var audioHandle;
    var audioImg;
    var translatePane;
    var isSet;

    function addHandle(targetID) {
        delHandle();
        setInfo(targetID);
        isSet = true
    };

    function setInfo(targetID) {
        selectedID = targetID;
        audioImg = document.getElementById(targetID);
        audioHandle = audioUtil.audioHandle(targetID);
        translatePane = audioUtil.translatePane(targetID)
    };

    function delHandle() {
        if (isSet) {
            initialize()
        }
    };

    function initialize() {
        audioHandle = null;
        translatePane = null;
        audioImg = null;
        selectedID = null;
        isSet = false
    };
    
    function keyDowned(e) {
        if (isSet && (e.keyCode === 46)) {
            var removePane = translatePane;
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
            initialize();
        }
    };

    function saveData() {
        var items = document.getElementById('audioContents').children;
        var dataList = [];
        for (var i = 0; i < items.length; i += 1) {
            var translatePane = items[i];
            var transLatePaneStyle = translatePane.getAttribute("style");
            var audio = translatePane.firstElementChild;
            var audioID = audio.id;
            var data = {
                "translateStyle": transLatePaneStyle,
                "audioID": audioID
            };
            dataList.push(JSON.stringify(data))
        }
        return JSON.stringify(dataList)
    };

    function getAudioSrc(id) {
        return audioUtil.audioHandle(id).src
    };

    function loadAudio(audioList) {
        for (var i = 0; i < audioList.length; i += 1) {
            var audioData = JSON.parse(audioList[i]);
            audioInsertOperation.load(audioData)
        }
    };

    function getAudioContents(audioList) {
        var audioParent = document.createElement("div");
        for (var i = 0; i < audioList.length; i += 1) {
            var audioData = JSON.parse(audioList[i]);
            var contents = audioInsertOperation.get(audioData);
            $(audioParent).append($(contents))
        }
        return audioParent
    };

    function setAudio(id) {
        audioInsertOperation.setAudio(id)
    };
    return {
        audioUp: function() {
            audioUp()
        },
        audioInsert: function(audioURL) {
            insert(audioURL)
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
        getAudioSrc: function(id) {
            return getAudioSrc(id)
        },
        loadAudio: function(audioList) {
            loadAudio(audioList)
        },
        getAudio: function(audioList) {
            return getAudioContents(audioList)
        },
        setAudio: function(id) {
            setAudio(id)
        }
    }
})();

function checkAndInsertAudioFile(id) {
    var xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open("POST", "./php/audioExist.php", true);
    xmlHttpRequest.onreadystatechange = function() {
        if (xmlHttpRequest.readyState === 4) {
            var res = xmlHttpRequest.responseText;
            if (res === "false") {
                audioFileHozon(id)
            }
        }
    };
    xmlHttpRequest.send(id)
}

function audioFileHozon(id) {
    var fileType = "audio/mpeg";
    var item = audioOperation.getAudioSrc(id);
    var fileContent = base64toBlobForAudio(item);
    var xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open("POST", "./php/saveAudio.php", true);
    var formData = new FormData();
    formData.append('filename', id);
    formData.append('content', fileContent);
    xmlHttpRequest.send(formData)
}

function base64toBlobForAudio(base64) {
    var replaced = base64.replace(/^.*,/, "");
    var decodeData = atob(replaced);
    var buffer = new Uint8Array(decodeData.length);
    for (var i = 0; i < decodeData.length; i++) {
        buffer[i] = decodeData.charCodeAt(i)
    }
    var result = new Blob([buffer.buffer], {
        type: "audio/mpeg"
    });
    return result
}

function audioInsert() {
    var selection = getSelection();
    var focusNode = selection.focusNode;
    var audio = document.createElement("audio");
    audio.src = "audio/first_battle_field.mp3";
    audio.controls = true;
    var div = document.createElement("div");
    div.appendChild(audio);
    var parent = focusNode.parentNode;
    parent.appendChild(div)
}