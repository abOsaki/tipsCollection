var svH, svW;

function base64toBlob(a) {
    var b, buffer, blob, i;
    b = atob(a.replace(/^.*,/, ""));
    buffer = new Uint8Array(b.length);
    for (i = 0; i < b.length; i++) {
        buffer[i] = b.charCodeAt(i)
    }
    blob = new Blob([buffer.buffer], {
        type: "image/png"
    });
    return blob
}

function upImg(e) {
    var a, fileUpClickId;
    fileUpClickId = e.id;
    a = document.createElement("input");
    a.id = "fileUp";
    a.type = "file";
    a.accept = "image/*";
    a.style.display = "none";
    a.setAttribute("onchange", "gazou_sounyu(this.files[0], '" + fileUpClickId + "')");
    document.getElementById(fileUpClickId).appendChild(a);
    document.getElementById("fileUp").click();
    document.getElementById(fileUpClickId).removeChild(document.getElementById("fileUp"))
}

function gazou_sounyu(a, b) {
    var c;
    c = new FileReader();
    c.readAsDataURL(a);
    c.onloadend = function() {
        ImgOperation.insert(c.result, a.name, b)
    }
}

function create_image(b, c, d) {
    var e = new Image();
    e.src = b;
    e.onload = function() {
        var a, context, maxSize, rw, rh, blob, imgFileName, handleBox, gazou, gazouBox, handleBox01, handleBox02, handleBox03;
        a = document.createElement("canvas");
        context = a.getContext("2d");
        maxSize = 500;
        rw = e.width;
        rh = e.height;
        if (e.width > e.height) {
            if (e.width > maxSize) {
                rw = maxSize;
                rh = e.height * maxSize / e.width
            }
        }
        if (e.width < e.height) {
            if (e.height > maxSize) {
                rw = e.width * maxSize / e.height;
                rh = maxSize
            }
        }
        context.clearRect(0, 0, 0, 0);
        a.width = rw;
        a.height = rh;
        context.drawImage(e, 0, 0, rw, rh);
        imgFileName = getNowDate() + c;
        SS.setItem(imgFileName, a.toDataURL("image/png"));
        handleBox01 = document.createElement("div");
        handleBox01.id = imgFileName + "handle01";
        handleBox01.style.position = "absolute";
        handleBox01.style.transformOrigin = "left top";
        handleBox01.style.transform = initImgPosition();
        handleBox01.style.width = rw + "px";
        handleBox02 = document.createElement("div");
        handleBox02.id = imgFileName + "handle02";
        handleBox02.style.position = "absolute";
        handleBox02.style.transformOrigin = "top left";
        handleBox02.style.transform = "scale(1.0)";
        handleBox02.style.width = "100%";
        handleBox02.style.height = "100%";
        handleBox03 = document.createElement("div");
        handleBox03.id = imgFileName + "handle03";
        handleBox03.style.position = "absolute";
        handleBox03.style.transformOrigin = "center center";
        handleBox03.style.transform = "rotate(0deg)";
        gazou = document.createElement("img");
        gazou.id = imgFileName;
        gazou.name = "gazou";
        gazou.alt = imgFileName;
        gazou.src = URL.createObjectURL(base64toBlob(SS.getItem(imgFileName)));
        gazou.style.verticalAlign = "top";
        document.getElementById(d).appendChild(handleBox01);
        handleBox01.appendChild(handleBox02);
        handleBox02.appendChild(handleBox03);
        handleBox03.appendChild(gazou)
    }
}

function initImgPosition() {
    var x = 0,
        y = 0,
        wrapperRect = document.getElementById("questionArea").getBoundingClientRect(),
        rect = document.getElementById("textContents").getBoundingClientRect();
    if (document.getElementById("textContents").classList.contains("verticalWriting")) {
        x = wrapperRect.left - rect.right
    } else {
        y = wrapperRect.top - rect.top
    }
    return "translate(" + x + "px," + y + "px)"
}

function fileHozon(a, b, c) {
    var d, imgFileData;
    d = new XMLHttpRequest();
    d.open("POST", "./php/saveImage.php", true);
    d.responseType = "blob";
    imgFileData = new FormData();
    imgFileData.append('filename', a);
    imgFileData.append('filetype', b);
    imgFileData.append('content', c);
    d.send(imgFileData)
}

function imgFileHozon(a) {
    var b, fileType, fileContent, imgFileData, xmlhr;
    b = a;
    fileType = "image/png";
    var test = SS.getItem(b);
    fileContent = base64toBlob(SS.getItem(b));
    xmlhr = new XMLHttpRequest();
    xmlhr.open("POST", "./php/saveImage.php", true);
    imgFileData = new FormData();
    imgFileData.append('filename', b);
    imgFileData.append('content', fileContent);
    xmlhr.send(imgFileData)
}

function imgFileExist(a) {
    var b, res;
    b = new XMLHttpRequest();
    b.open("POST", "./php/imageExist.php", true);
    b.onreadystatechange = function() {
        if (b.readyState === 4) {
            res = b.responseText;
            if (res === "false") {
                imgFileHozon(a)
            }
            loadEnd()
        }
    };
    b.send(a);
    loadStart()
}
var mId = null,
    mIdRect, gazouTargetId, gazouRect, rotateHandleRect;
var gazouY, gazouX, dy, dx, moveY = 0,
    moveX = 0,
    prevY = 0,
    prevX = 0,
    angle = 0,
    rad = 0,
    scaleYV = 1.0,
    scaleXV = 1.0,
    handleRe = 1.0,
    rotateHX = 0,
    rotateHY = 0,
    gazouCX = 0,
    gazouCY = 0,
    baseXV = 0,
    baseYV = 0;
var imgX, imgY, imgR, imgB, imgDY, imgDX;
var selectedImgId = null,
    dragFlag = false,
    scaleFlag = false,
    rotateFlag = false;
var selectedFusenId = null;
var fusenRotateFlag = false;
var fusenRect;

function transSV(a, b) {
    svH = a;
    svW = b
}

function dragS(e) {
    fusenOperation.notifyDragStart(e);
    ImgOperation.notifyDragStart(e);
    audioOperation.notifyDragStart(e);
    rubyObjectOperation.notifyDragStart(e);
}
document.addEventListener("mousedown", dragS, false);

function dragM(e) {
    fusenOperation.notifyDragMove(e);
    ImgOperation.notifyDragMove(e);
    audioOperation.notifyDragMove(e);
    rubyObjectOperation.notifyDragMove(e);
}
document.addEventListener("mousemove", dragM, false);

function dragE(e) {
    fusenOperation.notifyDragEnd(e);
    ImgOperation.notifyDragEnd(e);
    audioOperation.notifyDragEnd(e);
    rubyObjectOperation.notifyDragEnd(e);
}
document.addEventListener("mouseup", dragE, false);

function setHandlePosition(a) {
    var b, rightPx, bottomPx, leftPx, trblPx;
    trblPx = [0, 0, 0, 0];
    if (a === "br") {
        b = "auto";
        rightPx = "-6px";
        bottomPx = "-6px";
        leftPx = "auto"
    }
    if (a === "rotate") {
        b = "-15px";
        rightPx = "0px";
        bottomPx = "auto";
        leftPx = "0px"
    }
    trblPx[0] = b;
    trblPx[1] = rightPx;
    trblPx[2] = bottomPx;
    trblPx[3] = leftPx;
    return trblPx
}

function addScaleHandle(a, b) {
    var c, handleSize, handlePx;
    c = document.createElement("div");
    c.id = a.id + b;
    c.className = "scaleHandle";
    handleSize = 10;
    c.style.width = handleSize + "px";
    c.style.height = handleSize + "px";
    c.style.transform = "scale(1.0, 1.0)";
    c.style.border = "1px solid gray";
    c.style.backgroundColor = "white";
    c.style.position = "absolute";
    c.style.margin = "auto";
    handlePx = setHandlePosition(b);
    c.style.top = handlePx[0];
    c.style.right = handlePx[1];
    c.style.bottom = handlePx[2];
    c.style.left = handlePx[3];
    c.style.top = "";
    c.style.right = "";
    c.style.bottom = "";
    c.style.left = "";
    c.style.transformOrigin = "left top";
    c.style.transform = " scale(" + handleRe + ")" + " translate(" + ((a.width + 1.5) / handleRe - 6) + "px, " + ((a.height + 1.5) / handleRe - 6) + "px)";
    a.parentElement.appendChild(c)
}

function addRotateHandle(a) {
    var b, imgHandle;
    imgHandle = document.createElement("img");
    imgHandle.id = a.id + "rotateHandle";
    imgHandle.className = "rotateHandle";
    imgHandle.src = "./images/kaiten.png";
    imgHandle.style.height = "30px";
    imgHandle.style.margin = "auto";
    imgHandle.style.transformOrigin = "center top";
    imgHandle.style.transform = "scale(" + handleRe + ")" + " translate(0px,-26px)";
    b = setHandlePosition("rotate");
    imgHandle.style.right = "0px";
    imgHandle.style.left = "0px";
    imgHandle.style.position = "absolute";
    imgHandle.style.margin = "0 auto";
    a.parentElement.appendChild(imgHandle)
}
var imgHandleTarget;

function addHandle(a) {
    imgHandleTarget = document.getElementById(a);
    imgHandleTarget.style.border = "1px solid gray";
    addRotateHandle(imgHandleTarget);
    addScaleHandle(imgHandleTarget, "br")
}

function delHandle(a) {
    var b, i;
    imgHandleTarget = document.getElementById(a);
    imgHandleTarget.style.border = "";
    b = document.getElementsByClassName("scaleHandle");
    for (i = b.length; i > 0; i--) {
        imgHandleTarget.parentElement.removeChild(b[i - 1])
    }
    imgHandleTarget.parentElement.removeChild(document.getElementById(a + "rotateHandle"))
}

function delHandleForFusen(targetID) {
    fusenOperation.delHandle()
}

function clickItem(e) {
    var a = false;
    if (window.location.pathname.split("/").pop() === "education.html") {
        return false
    }
    var targetName = e.target.name;
    var targetIsGazou = (targetName === "gazou");
    var targetIsFusen = (targetName === "fusen");
    var targetIsAudio = (targetName === "audio");
    var targetIsRuby = (targetName === "rubyObject");
    var id = e.target.id;
    if (targetIsFusen) {
        fusenOperation.selected(id);
        ImgOperation.nonSelected();
        return
    } else {
        fusenOperation.nonSelected()
    }
    if (targetIsGazou) {
        ImgOperation.selected(id)
    } else {
        ImgOperation.nonSelected()
    }
    if (targetIsAudio) {
        audioOperation.selected(id)
    } else {
        audioOperation.nonSelected()
    }
    if(targetIsRuby){
        rubyObjectOperation.selected(id);
    }else{
        rubyObjectOperation.nonSelected();
    }
}
document.addEventListener("click", clickItem, false);

function imageLoad(imageName) {
    var xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open("POST", "./php/imageLoad.php", true);
    xmlHttpRequest.responseType = "blob";
    xmlHttpRequest.send(imageName);
    xmlHttpRequest.onreadystatechange = function() {
        if (xmlHttpRequest.readyState === 4) {
            var response = xmlHttpRequest.response;
            var fileReader = new FileReader();
            fileReader.readAsDataURL(response);
            fileReader.onload = function() {
                SS.setItem(imageName, fileReader.result);
                var src = URL.createObjectURL(base64toBlob(SS.getItem(imageName)));
                document.getElementById(imageName).src = URL.createObjectURL(base64toBlob(SS.getItem(imageName)))
            };
            loadEnd()
        }
    };
    loadStart()
}