var svH, svW;

function base64toBlob(a) {
    var b, buffer, blob, i;
    b = atob(a.replace(/^.*,/, ""));
    buffer = new Uint8Array(b.length);
    for (i = 0; i < b.length; i++) {
        buffer[i] = b.charCodeAt(i)
    }
    blob = new Blob([buffer.buffer]);
    return blob
}

function upFileHozon(a, b, c) {
    var d, imgFileData;
    d = new XMLHttpRequest();
    d.open("POST", "./php/saveFile.php", true);
    imgFileData = new FormData();
    imgFileData.append('filename', a);
    imgFileData.append('filetype', b);
    imgFileData.append('content', c);
    d.onreadystatechange = function() {
        if (d.readyState === 4) {
            res = d.responseText;
            loadEnd()
        }
    };
    loadStart();
    d.send(imgFileData)
}

function fileExist(a) {
    var b, res;
    b = new XMLHttpRequest();
    b.open("POST", "./php/fileExist.php", true);
    b.onreadystatechange = function() {
        if (b.readyState === 4) {
            res = b.responseText;
            if (res === "false") {
                upFileHozon(a, null, base64toBlob(SS.getItem(a)))
            }
            loadEnd()
        }
    };
    b.send(a);
    loadStart()
}

function fileLoad(b, c) {
    var d, res;
    d = new XMLHttpRequest();
    d.open("POST", "./php/fileLoad.php", true);
    d.responseType = "blob";
    d.onreadystatechange = function() {
        if (d.readyState === 4) {
            res = d.response;
            var a = new FileReader();
            a.onload = function() {
                SS.setItem(b, a.result);
                c(a.result)
            };
            a.readAsDataURL(res);
            loadEnd()
        }
    };
    d.send(b);
    loadStart()
}