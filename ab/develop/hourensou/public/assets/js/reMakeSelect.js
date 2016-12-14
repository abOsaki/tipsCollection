//過去分反映用select再設定
function reGetItemList(selEle, selectInt) {
//alert('reGetItemList()');
//console.log("reGetItemList() start");
    var item,itemList, optionEle, xmlhr, response, i;
    xmlhr = new XMLHttpRequest();
//    xmlhr.responseType = 'text';
    xmlhr.open("POST", "../api/item/get_item_list", true);
    xmlhr.onreadystatechange = function () {
        if (xmlhr.readyState === 1) {
            //loading開始処理
            loadStart();
        }
        if (xmlhr.readyState === 4) {
            response = xmlhr.responseText;
//            response = xmlhr.response;
//alert(response);
            //console.log(response);
            if (response !== "null") {
                item = JSON.parse(response);
//alert(item);
//                itemList=JSON.parse(item[selEle.name]);
                itemList = item[selEle.name];
                $.cookie('itemlist_' + item, JSON.stringify(itemList));

                for (i = 0; i < itemList.length; i++) {
                    optionEle = document.createElement("option");
                    optionEle.value = i + 1;
                    optionEle.text = itemList[i].name;
                    selEle.appendChild(optionEle);
                }

                //個々にイベント登録
                for (i = 0; i < filterPoint.length; i++) {
                    if (selEle.name === filterPoint[i]) {
                        selEle.addEventListener("change", reMakeSelect, false);
                    }
                }
                selEle.options[0].selected = true;
            }

            if (selEle.name.match(/unit(.*?)/)) {
                optionEle = document.createElement("option");
                optionEle.value = "0";
                optionEle.textContent = "その他";
                selEle.appendChild(optionEle);
            }
            selEle.options[selectInt].selected = true;
//alert('reGetItemList() loadEnd()');
            //loading終了処理
            loadEnd();
        }
    };
    //console.log(selEle.name);
    xmlhr.send(JSON.stringify({'array':[selEle.name]}));
}

//親と名前を元にselectを作成
function reSelectEleEdit(parentEle, nameStr, selectInt) {
    var selEle, optionEle;

//alert('reSelectEleEdit()' + ' nameStr:' + nameStr);
    selEle = document.createElement("select");
    selEle.className = "itemSelect";
    selEle.name = nameStr;

    optionEle = document.createElement("option");
    optionEle.value = "";
    optionEle.textContent = "--";

    parentEle.appendChild(selEle);
    selEle.appendChild(optionEle);

    reGetItemList(selEle, selectInt);
}