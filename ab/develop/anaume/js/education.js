var viewPage = [];
var pageList = [];
var pageCount = 0;
var pageLength = 0;
var shuffleFlag = false;
var pageIndex = 0;
var initialiceTextPageList = [];
var initializeImagePageList = [];
var initializeTextStylePageList = [];
var initializeFusenPageList = [];
var initializeAudioPageList = [];
var isInitializePageSetup = false;

function anaClick(a) {
    document.getElementById("textContents").blur();
    if (a.target.classList.contains("anaaki")) {
        a.target.classList.toggle("anaInvisible");
        a.target.classList.toggle("anaVisible")
    }
}
window.addEventListener("click", anaClick, false);

function shuffleList(a) {
    var i, j, tmp, length;
    length = a.length;
    for (i = length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        tmp = a[i];
        a[i] = a[j];
        a[j] = tmp
    }
    return a
}

function setInitializeList(pvPageList) {
    for (var i = 0; i < pvPageList.length; i++) {
        var page = pvPageList[i];
        initialiceTextPageList[i] = page.text;
        initializeImagePageList[i] = page.image;
        initializeTextStylePageList[i] = page.textStyle;
        initializeFusenPageList[i] = page.fusen;
        initializeAudioPageList[i] = page.audioContents
    }
}

function initializePageListContent() {
    for (var i = 0; i < pageList.length; i++) {
        pageList[i].text = initialiceTextPageList[i];
        pageList[i].image = initializeImagePageList[i];
        pageList[i].textStyle = initializeTextStylePageList[i];
        pageList[i].fusen = initializeFusenPageList[i];
        pageList[i].audioContents = initializeAudioPageList[i]
    }
}

function shuffleSwitch() {
    shuffleFlag = true;
    viewPageSet();
    jumpPage(0)
}

function shuffleCancel() {
    shuffleFlag = false;
    viewPageSet();
    jumpPage(0)
}

function jumpPage(a) {
    pageIndex = a;
    var imageContents = document.getElementById("imageContents");
    document.getElementById("textContents").innerHTML = viewPage[pageIndex].text;
    document.getElementById("textContents").className = viewPage[pageIndex].textStyle;
    document.getElementById("questionArea").className = viewPage[pageIndex].textStyle;
    if (viewPage[pageIndex].textStyle) {
        document.getElementById("fusenContents").style.direction = "ltr"
    }
    imageContents.innerHTML = viewPage[pageIndex].image;
    document.getElementById("fusenContents").innerHTML = viewPage[pageIndex].fusen;
    document.getElementById('audioContents').innerHTML = viewPage[pageIndex].audioContents;
    document.getElementById('rubyContents').innerHTML = viewPage[pageIndex].rubyContents;
    document.getElementById("nowPageNum").value = a;
    document.getElementById("textContents").blur();
    invisibleAnaaki();
    loadAudio();
    loadImg(imageContents);
    if (viewPage[pageIndex].textStyle) {
        autoDisplay()
    }
    writeRuby()
}

function writeRuby() {
    rubyObjectOperation.writeRuby()
}

function invisibleAnaaki() {
    var anaakiVisibles = document.getElementsByClassName("anaaki anaVisible");
    for (var i = 0; i < anaakiVisibles.length; i++) {
        var taisho = anaakiVisibles[i];
        taisho.className = "anaaki anaInvisible"
    }
}

function loadAudio() {
    var audioContents = document.getElementById("audioContents");
    var audios = $(audioContents).find("img");
    for (var i = 0; i < audios.length; i++) {
        var audio = audios[i];
        audioOperation.setAudio(audio.id)
    }
}

function loadImg(imageContents) {
    var images = $(imageContents).find("img");
    for (var i = 0; i < images.length; i++) {
        var image = images[i];
        imageLoad(image.id)
    }
}

function autoDisplay() {
    var fixContentWidth = 1920 * 0.97;
    var contentWidth = document.documentElement.clientWidth * 0.97;
    contentWidth = contentWidth < 1360 ? 1360 : contentWidth;
    var holizonalValue = fixContentWidth - contentWidth;
    imgAdjustment(holizonalValue);
    var questionArea = document.getElementById("questionArea");
    questionArea.style.overflow = "hidden"
}

function getPercent() {
    var fixContentWidth = 1920 * 0.97;
    var contentWidth = document.documentElement.clientWidth * 0.97;
    var result = contentWidth / fixContentWidth;
    return result
}

function imgAdjustment(holizonalValue) {
    ImgOperation.adjustAllImgForEducation(holizonalValue);
    fusenOperation.adjustAllForEducation(holizonalValue)
}

function imgAdjustmentForPercent(percent) {
    fusenOperation.adjustPercentForEducation(percent)
}

function nextPage() {
    if (pageIndex < viewPage.length - 1) {
        pageIndex++;
        jumpPage(pageIndex)
    }
}

function prevPage() {
    if (pageIndex > 0) {
        pageIndex--;
        jumpPage(pageIndex)
    }
}

function viewPageSet() {
    viewPage = [];
    if (shuffleFlag) {
        viewPage = shuffleList(pageList)
    } else {
        if (!isInitializePageSetup) {
            setInitializeList(pageList);
            isInitializePageSetup = true
        } else {
            initializePageListContent()
        }
        viewPage = pageList
    }
}

function pageSet(d, e) {
    var f, pageItem, xmlhr, response;
    var g, imageContentsEle, imageList;
    xmlhr = new XMLHttpRequest();
    xmlhr.open("POST", "./php/questionOpen.php", true);
    xmlhr.onreadystatechange = function() {
        if (xmlhr.readyState === 4 && xmlhr.status === 200) {
            response = xmlhr.responseText;
            f = JSON.parse(response);
            g = f.textContents;
            textContentsStyle = f.textStyle;
            imageContentsEle = f.imageContents;
            pageItem = {};
            pageItem.text = g;
            pageItem.textStyle = textContentsStyle;
            pageItem.fusen = "";
            if (f.fusen != null) {
                var fusenList = JSON.parse(f.fusen);
                var fusen = fusenOperation.getFusen(fusenList);
                pageItem.fusen = fusen.innerHTML
            }
            pageItem.rubyContents = "";
            if (f.rubyContents) {
                pageItem.rubyContents = f.rubyContents
            }
            if (f.audioContents != null && f.audioContents != "") {
                var audioList = JSON.parse(f.audioContents);
                var audio = audioOperation.getAudio(audioList);
                pageItem.audioContents = audio.innerHTML
            } else {
                pageItem.audioContents = ""
            }
            var loadCallback = function() {
                pageList[d] = pageItem;
                pageCount++;
                viewPageSet();
                jumpPage(0)
            };
            pageItem.image = "";
            imageList = JSON.parse(imageContentsEle);
            var imgPane = ImgOperation.getImgPane(imageList);
            pageItem.image = imgPane.innerHTML;
            loadCallback();
            loadEnd()
        }
    };
    xmlhr.send(e);
    loadStart()
}

function pageSetForPackage(pvPageIndex, pvQuestionID, pvCallback) {
    var xmlhr = new XMLHttpRequest();
    xmlhr.open("POST", "./php/questionOpen.php", true);
    xmlhr.onreadystatechange = function() {
        if (xmlhr.readyState === 4 && xmlhr.status === 200) {
            var response = xmlhr.responseText;
            var jsonObj = JSON.parse(response);
            var pageItem = {};
            pageItem.text = jsonObj.textContents;
            pageItem.textStyle = jsonObj.textStyle;
            pageItem.fusen = "";
            var fusenData = jsonObj.fusen;
            if (fusenData != null) {
                var fusenList = JSON.parse(fusenData);
                var fusen = fusenOperation.getFusen(fusenList);
                pageItem.fusen = fusen.innerHTML
            }
            pageItem.rubyContents = "";
            if (jsonObj.rubyContents) {
                pageItem.rubyContents = jsonObj.rubyContents
            }
            var audioData = jsonObj.audioContents;
            if (audioData != null && audioData != "") {
                var audioList = JSON.parse(audioData);
                var audio = audioOperation.getAudio(audioList);
                pageItem.audioContents = audio.innerHTML
            } else {
                pageItem.audioContents = ""
            }
            var loadCallback = function() {
                pageList[pvPageIndex] = pageItem;
                pageCount++
            };
            pageItem.image = "";
            var imageData = jsonObj.imageContents;
            var imageList = JSON.parse(imageData);
            var imgPane = ImgOperation.getImgPane(imageList);
            pageItem.image = imgPane.innerHTML;
            loadCallback();
            pvCallback.callback();
            loadEnd()
        }
    };
    xmlhr.send(pvQuestionID);
    loadStart()
}

function eduImgLoad(c, d, e, f) {
    var g, res;
    g = new XMLHttpRequest();
    g.open("POST", "./php/imageLoad.php", true);
    g.responseType = "blob";
    g.onreadystatechange = function() {
        if (g.readyState === 4) {
            res = g.response;
            var b = new FileReader();
            b.readAsDataURL(res);
            b.onload = function() {
                var src = URL.createObjectURL(base64toBlob(b.result));
                e.firstElementChild.firstElementChild.firstElementChild.src = src;
                d.image += e.outerHTML;
                pageList[c] = d;
                pageCount++;
                loadEnd();
                var a, counter = 0;
                a = setInterval(function() {
                    if (counter >= 1 && loadingFlagCount <= 0) {
                        clearInterval(a);
                        viewPageSet();
                        jumpPage(0)
                    }
                    counter += 1
                }, 100)
            }
        }
    };
    g.send(f);
    loadStart()
}

function educationOpen() {
    console.log("window.innerWidth : " + window.innerWidth);
    console.log("window.innerHeight : " + window.innerHeight);
    var scaleX = window.innerWidth / 1621;
    var scaleY = window.innerHeight / 709;
    console.log("scaleX : " + scaleX);
    console.log("scaleY : " + scaleY);
    window.innerWidth = 1621;
    window.innerHeight = 789;
    console.log("after window.innerWidth : " + window.innerWidth);
    console.log("after window.innerHeight : " + window.innerHeight);
    var contents = document.getElementById("contents");
    var c, packageType, educationItem, contentsList, optionEle, xmlhr, response, i;
    var d = {};
    if (window.location.search) {
        if (1 < window.location.search.length) {
            var e = window.location.search.substring(1);
            var f = e.split('&');
            for (i = 0; i < f.length; i++) {
                var g = f[i].split('=');
                var h = decodeURIComponent(g[0]);
                var j = decodeURIComponent(g[1]);
                d[h] = j
            }
        }
    } else {
        window.location.href = "./educationSelect.html"
    }
    c = d.eduId;
    packageType = d.eduType;
    if (packageType === "question") {
        contentsReport(1, c, 1)
    } else if (packageType === "package") {
        contentsReport(1, c, 2)
    }
    if (packageType === "question") {
        pageLength = 1;
        document.getElementById("pageLength").textContent = pageLength;
        var k = document.getElementById("nowPageNum");
        var l = k.firstElementChild;
        while (l) {
            k.removeChild(l);
            l = k.firstElementChild
        }
        for (i = 0; i < pageLength; i++) {
            optionEle = document.createElement("option");
            optionEle.value = i;
            optionEle.textContent = i + 1;
            k.appendChild(optionEle)
        }
        pageSet(0, c);
        return false
    }
    xmlhr = new XMLHttpRequest();
    xmlhr.open("POST", "./php/educationOpen.php", true);
    xmlhr.onreadystatechange = function() {
        if (xmlhr.readyState === 4 && xmlhr.status === 200) {
            response = xmlhr.responseText;
            educationItem = JSON.parse(response);
            contentsList = educationItem.contents.split(",");
            pageLength = contentsList.length;
            document.getElementById("pageLength").textContent = pageLength;
            var a = document.getElementById("nowPageNum");
            a.addEventListener("change", function() {
                jumpPage(a.value)
            }, false);
            var b = a.firstElementChild;
            while (b) {
                a.removeChild(b);
                b = a.firstElementChild
            }
            for (i = 0; i < pageLength; i++) {
                optionEle = document.createElement("option");
                optionEle.value = i;
                optionEle.textContent = i + 1;
                a.appendChild(optionEle)
            }
            var callback = new PackageLoadCallback(contentsList.length);
            for (i = 0; i < contentsList.length; i++) {
                var educationID = contentsList[i];
                pageSetForPackage(i, educationID, callback)
            }
            loadEnd()
        }
    };
    xmlhr.send(c);
    loadStart()
}

function PackageLoadCallback(pvPackageCount) {
    this.count = pvPackageCount;
    var currentCount = 0;
    this.callback = function() {
        currentCount++;
        if (this.count == currentCount) {
            console.log(pageList.length);
            for (var i = 0; i < pageList.length; i++) {
                var page = pageList[i];
                console.log(page.image);
                var bufu = document.createElement("div");
                bufu.innerHTML = page.image
            }
            viewPageSet();
            jumpPage(0)
        }
    }
}
$(function() {
    $(document).on('click', 'img', function() {
        if (this.name == "fusen") {
            fusenOperation.changeFusenGazouFoeEtsuran(this.id)
        }
    })
});