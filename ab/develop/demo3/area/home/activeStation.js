/*global $, console, alert*/

//メニュー項目切り替え
function showAreaImg(contentsName) {
    "use strict";
    var itemEle, imgEle;
    itemEle = document.getElementById("area1");
    imgEle = document.getElementById("area1Img");

    switch (contentsName) {
    case "mekurin":
        itemEle.href = "./mekurin/";
        imgEle.src = "./images/01mekurin.png";
        imgEle.alt = "めくりん";
        imgEle.title = "めくりんへ";
        break;
    case "anaume":
        itemEle.href = "./anaume/";
        imgEle.src = "./images/02anaumekun.png";
        imgEle.alt = "あなうめ君";
        imgEle.title = "あなうめ君へ";
        break;
    case "tamatebako":
        itemEle.href = "#";
        imgEle.src = "./images/03tamatebako.png";
        imgEle.alt = "玉手箱";
        imgEle.title = "玉手箱へ";
        break;
    case "funyan":
        itemEle.href = "#";
        imgEle.src = "./images/04funyan.png";
        imgEle.alt = "ふーにゃん";
        imgEle.title = "ふーにゃんへ";
        break;
    case "hourensou":
        itemEle.href = "./hourensou/";
        imgEle.src = "./images/05hourensou.png";
        imgEle.alt = "ほうれんそう名人";
        imgEle.title = "ほうれんそう名人へ";
        break;
    case "chemistry":
        itemEle.href = "#";
        imgEle.src = "./images/06chemistry.png";
        imgEle.alt = "Dr.ケミストリーへ";
        imgEle.title = "Dr.ケミストリーへ";
        break;
    default:
        console.log(contentsName + ":を取得できません。");
    }
}


var startBekkCount = 0,
    sebesseg = 50,
    rublikszama = 28;

function szinez(mettol, pluszbavagyminuszba) {
    "use strict";

    var itemEle, i, il;

    if (pluszbavagyminuszba === "pluszba") {
        for (i = 1, il = 5; i <= il; i += 1) {
            itemEle = document.getElementById("MetaMorfozisDotHu_" + mettol);
            if (itemEle) {
                itemEle.className = "pici_" + i;
            }
            mettol += 1;
        }
    } else if (pluszbavagyminuszba === "minuszba") {
        for (i = 1, il = 5; i <= il; i += 1) {
            itemEle = document.getElementById("MetaMorfozisDotHu_" + mettol);
            if (itemEle) {
                itemEle.className = "pici_" + i;
            }
            mettol -= 1;
        }
    } else {
        console.log(mettol, pluszbavagyminuszba, "=szinez:Error");
    }
}

function start(honnan) {
    "use strict";
    if (startBekkCount >= 3) {
        return false;
    }
    if (honnan <= rublikszama + 4) {
        szinez(honnan, 'pluszba');
        honnan = honnan + 1;
        setTimeout("start(" + honnan + ");", sebesseg);
    } else {
        bekk(honnan);
    }
}

function bekk(honnan) {
    "use strict";
    if (startBekkCount >= 3) {
        return false;
    }
    if (honnan >= -3) {
        szinez(honnan, 'minuszba');
        honnan = honnan - 1;
        setTimeout("bekk(" + honnan + ");", sebesseg);
    } else {
        start(honnan);
        startBekkCount += 1;
    }
}

function printkit() {
    "use strict";
    var itemEle, tableEle, trEle, tdEle, i, il;
    itemEle = document.getElementById("metaMorfozisDotHu");

    tableEle = document.createElement("table");
    tableEle.setAttribute("align", "center");
    tableEle.setAttribute("width", "580px");
    tableEle.setAttribute("cellspacing", "0");
    tableEle.setAttribute("cellpadding", "0");
    tableEle.setAttribute("border", "0");
    trEle = document.createElement("tr");

    for (i = 1, il = rublikszama; i <= il; i += 1) {
        tdEle = document.createElement("td");
        tdEle.id = "MetaMorfozisDotHu_" + i;
        tdEle.className = "pici_1";
        tdEle.height = 1;

        trEle.appendChild(tdEle);
    }

    tableEle.appendChild(trEle);
    itemEle.appendChild(tableEle);

    for (i = 1, il = rublikszama; i <= il; i += 1) {
        document.getElementById("MetaMorfozisDotHu_" + i).className = "pici_1";
    }
}

$(function () {
    "use strict";
    // #で始まるアンカーをクリックした場合に処理
    $('a[href^=#]').click(function () {
        var speed, href, target, position;
        // スクロールの速度
        speed = 400; // ミリ秒
        // アンカーの値取得
        href = $(this).attr("href");
        // 移動先を取得
        target = $(href === "#" || href === "" ? 'html' : href);
        // 移動先を数値で取得
        position = target.offset().top;
        // スムーススクロール
        $($.browser.safari ? 'body' : 'html').animate({
            scrollTop: position
        }, speed, 'swing');
        return false;
    });
});

function loadEvent() {
    "use strict";
    printkit();
    start(-3);
}
window.addEventListener("load", loadEvent, false);

$(function () {
    // 数指定（30～40推奨）
    var snowmax = 50;
    // 色指定
    var snowcolor = new Array("#aaaacc", "#ccccdd", "#ddddff");
    // フォント指定
    var snowtype = new Array("Arial Black", "Arial Narrow", "Times", "Comic Sans MS");
    // 形状指定
    var snowletter = "*";
    // 降る早さ指定
    var sinkspeed = 1.3;
    // 最大サイズ指定
    var snowmaxsize = 14;
    // 最小サイズ指定
    var snowminsize = 8;
    // 降り落ちる横幅指定
    var snowboxwidth = 200;

    var snow = new Array();
    var marginbottom;
    var marginright;
    var marginleft;
    var margintop;
    var snowingzone = 1;

    var posleft;
    var postop;

    var is_snowing = false;
    var timer;
    var i_snow = 0;
    var x_mv = new Array();
    var crds = new Array();
    var lftrght = new Array();
    var browserinfos = navigator.userAgent;
    var ie5 = document.all && document.getElementById && !browserinfos.match(/Opera/);
    var ns6 = document.getElementById && !document.all;
    var opera = browserinfos.match(/Opera/);
    var browserok = ie5 || ns6 || opera;

    function randommaker(range) {
        rand = Math.floor(range * Math.random());
        return rand;
    }

    function movesnow() {
        if (is_snowing) {
            for (i = 0; i <= snowmax; i++) {
                crds[i] += x_mv[i];
                snow[i].posy += snow[i].sink;
                snow[i].style.left = snow[i].posx + lftrght[i] * Math.sin(crds[i]) + "px";
                snow[i].style.top = snow[i].posy + "px";

                marginleft = 760;
                if (snow[i].posy >= marginbottom - 2 * snow[i].size || parseInt(snow[i].style.left) > (marginright - 3 * lftrght[i])) {
                    snow[i].posx = randommaker(snowboxwidth) + marginleft - 2 * snow[i].size;
                    if (ie5 || opera) {
                        if (snow[i].posx >= document.body.clientWidth - 2 * snow[i].size) {
                            snow[i].posx = snow[i].posx - snowboxwidth;
                        }
                    }
                    if (ns6) {
                        if (snow[i].posx >= window.innerWidth - 2 * snow[i].size) {
                            snow[i].posx = snow[i].posx - snowboxwidth;
                        }
                    }
                    snow[i].posy = randommaker(marginbottom - margintop) + margintop - 2 * snow[i].size;
                }
            }

            setTimeout(movesnow, 50);
        } else {
            for (i = 0; i <= snowmax; i++) {
                snow[i].style.visibility = "hidden";
            }
        }
    }

    function startsnow() {
        is_snowing = true;
        if (ie5 || opera) {
            margintop = postop + 15;
            marginbottom = document.body.clientHeight;
            marginleft = posleft;
            marginright = posleft + snowboxwidth;
        } else if (ns6) {
            margintop = postop + 15;
            marginbottom = window.innerHeight;
            marginleft = posleft;
            marginright = posleft + snowboxwidth;
        }
        var snowsizerange = snowmaxsize - snowminsize;
        for (i = 0; i <= snowmax; i++) {
            crds[i] = 0;
            lftrght[i] = Math.random() * 15;
            x_mv[i] = 0.03 + Math.random() / 10;
            snow[i] = document.getElementById("s" + i);
            snow[i].style.fontFamily = snowtype[randommaker(snowtype.length)];
            snow[i].size = randommaker(snowsizerange) + snowminsize;
            snow[i].style.fontSize = snow[i].size + "px";
            snow[i].style.color = snowcolor[randommaker(snowcolor.length)];
            snow[i].sink = sinkspeed * snow[i].size / 5;
            snow[i].posx = randommaker(snowboxwidth) + marginleft - 2 * snow[i].size;
            if (ie5 || opera) {
                if (snow[i].posx >= document.body.clientWidth - 2 * snow[i].size) {
                    snow[i].posx = snow[i].posx - snowboxwidth;
                }
            }
            if (ns6) {
                if (snow[i].posx >= window.innerWidth - 2 * snow[i].size) {
                    snow[i].posx = snow[i].posx - snowboxwidth;
                }
            }
            snow[i].posy = randommaker(marginbottom - margintop) + margintop - 2 * snow[i].size;
            snow[i].style.left = snow[i].posx + "px"; /*★HTML5対応のため+"px"追加*/
            snow[i].style.top = snow[i].posy + "px"; /*★HTML5対応のため+"px"追加*/
            snow[i].style.visibility = "visible";

        }
        movesnow();
    }

    function stopsnow() {
        is_snowing = false;
    }


    function getcoordinates(e) {
        if (ie5 || opera) {
            posleft = document.body.scrollLeft + window.event.x;
            postop = document.body.scrollTop + window.event.y;
        }
        if (ns6) {
            posleft = e.pageX;
            postop = e.pageY;
        }
    }

    for (i = 0; i <= snowmax; i++) {
        $("<span id='s" + i + "' style='position:absolute;top:-" + snowmaxsize + "'>" + snowletter + "</span>").appendTo("body");
    }
    if (browserok) {
        document.onmousemove = getcoordinates;
    }

    $("#snowStar").hover(startsnow, stopsnow);

});