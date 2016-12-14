/*
 * マスター情報の一覧を返す。
 *
 * item     : 名称
 * where    : 条件
 */
function get_item_list(item, where) {

console.log('get_item_list() item:' + item);
    if (item == undefined) {
        return;
    }

//    if (where == 'undefined') {
//        where = null;
//    }

//console.log('"itemlist_" + item:' + 'itemlist_' + item);
    // すでに取得済みの情報がlocalStorageにある場合はそちらを使用する。
    itemList =[];
    if (where != undefined) {
        if (where.areaid != undefined) {
console.log("get_item_list() where.areaid:" + where.areaid);
//            itemList = $.cookie('itemlist_' + item + '_areaid_' + where.areaid);
            try {
                itemList = localStorage.getItem('itemlist_' + item + '_areaid_' + where.areaid);
            } catch (e) {
                itemList = undefined;
            }
        }
    } else {
//        itemList = $.cookie('itemlist_' + item);
        try {
            itemList = localStorage.getItem('itemlist_' + item);
        } catch (e) {
            itemList = undefined;
        }
console.log("get_item_list() localStorage itemList_" + item + ":" + itemList);
    }
    if (itemList != undefined) {
            itemList = JSON.parse(itemList);
console.log('get_item_list() return localStorage itemList:' + itemList);
            return itemList;
    }

    // 指定したマスター情報を取得する。
    itemList =[];
    xmlhr = new XMLHttpRequest();
    xmlhr.open("POST", "../api/item/get_item_list", false);
    xmlhr.onreadystatechange = function () {
        if (xmlhr.readyState === 1) {
            //loading開始処理
            loadStart();
        }
        if (xmlhr.readyState === 4) {
            response = xmlhr.responseText;
console.log('get_item_list() api response:' + response);
            if (response !== "null") {
                response_array = JSON.parse(response);
console.log('get_item_list() api response_array:' + response_array);
                itemList = response_array[item];
console.log('get_item_list() api itemList:' + itemList);
                // 取得した情報をlocalStorageにセットする。
                if (where != undefined) {
console.log('get_item_list() set localStorage where:' + where);
                    if (where.areaid != undefined) {
console.log('get_item_list() set localStorage 1');
//                        $.cookie('itemlist_' + item + '_areaid_' + where.areaid, JSON.stringify(itemList));
                        try {
                            localStorage.setItem('itemlist_' + item + '_areaid_' + where.areaid, JSON.stringify(itemList));
                        } catch (e) {
                            // TODO: handle exception
                        }
                    }
                } else {
console.log('get_item_list() set localStorage 2');
//                    $.cookie('itemlist_' + item, JSON.stringify(itemList));
                    try {
                        localStorage.setItem('itemlist_' + item, JSON.stringify(itemList));
                    } catch (e) {
                        // TODO: handle exception
                    }
                }

            }
            //loading終了処理
            loadEnd();
        }
    };

//console.log("get_item_list() where:" + where);

    if (where != undefined) {
//console.log("get_item_list() send 1 item:" + item);
        xmlhr.send(JSON.stringify({'array':[item], 'where':[where]}));
//        xmlhr.send(JSON.stringify({'array':[item], 'where': where}));
    } else {
//console.log("get_item_list() send 2 item:" + item);
        xmlhr.send(JSON.stringify({'array':[item]}));
    }

  //console.log('get_item_list() return api itemList:' + itemList);
    return itemList;
}

/*
 * マスター情報の一覧を指定したプルダウンリストにセットする。
 *
 * selectElement
 * selected
 * item     : 名称
 * where    : 条件
 */
function setSelectElementItem(selectElement, selected, item, where) {
    var response_array, itemList, optionEle, xmlhr, response, i;

    if (item == undefined) {
console.log("setSelectElementItem() item:" + item);
        return;
    }

//    if (where == 'undefined') {
//        where = null;
//    }

    // すでに取得済みの情報がlocalStorageにある場合はそちらを使用する。
    itemList =[];
    if (where != undefined) {
        if (where.areaid != undefined) {
//console.log("setSelectElementItem() cookie where.areaid:" + where.areaid);
//            itemList = $.cookie('itemlist_' + item + '_areaid_' + where.areaid);
            try {
                itemList = localStorage.getItem('itemlist_' + item + '_areaid_' + where.areaid);
            } catch (e) {
                itemList = undefined;
            }

//console.log("setSelectElementItem() cookie itemList:" + itemList);
        }
    } else {
//        itemList = $.cookie('itemlist_' + item);
        try {
            itemList = localStorage.getItem('itemlist_' + item);
        } catch (e) {
            itemList = undefined;
        }
    }
//if (item == 'area') {
//console.log("1 setSelectElementItem() itemList:" + itemList);
//}
    if (itemList != undefined) {
//console.log("3 setSelectElementItem() itemList:" + itemList);
        itemList = JSON.parse(itemList);
        for (i = 0; i < itemList.length; i++) {
            optionElement = document.createElement("option");
            optionElement.value = itemList[i].id;
            optionElement.text = itemList[i].name;
            if (itemList[i].id == selected) {
              optionElement.selected = true;
            }
            selectElement.appendChild(optionElement);
        }
        // 取得した情報をlocalStorageにセットする。
        if (where != undefined) {
            if (where.areaid != undefined) {
//                $.cookie('itemlist_' + item + '_areaid_' + where.areaid, JSON.stringify(itemList));
                try {
                    localStorage.setItem('itemlist_' + item + '_areaid_' + where.areaid, JSON.stringify(itemList));
                } catch (e) {
                    // TODO: handle exception
                }
            }
        } else {
//            $.cookie('itemlist_' + item, JSON.stringify(itemList));
            try {
                localStorage.setItem('itemlist_' + item, JSON.stringify(itemList));
            } catch (e) {
                // TODO: handle exception
            }
        }
        return;
    }

    itemList =[];
    xmlhr = new XMLHttpRequest();
    xmlhr.open("POST", "../api/item/get_item_list", true);
    xmlhr.onreadystatechange = function () {
        if (xmlhr.readyState === 1) {
            //loading開始処理
            loadStart();
        }
        if (xmlhr.readyState === 4) {
            response = xmlhr.responseText;
            if (response !== "null") {
                response_array = JSON.parse(response);
                itemList = response_array[item];
//if (item == 'area') {
//console.log("2 setSelectElementItem() itemList:" + itemList);
//}

                for (i = 0; i < itemList.length; i++) {
                    optionElement = document.createElement("option");
                    optionElement.value = itemList[i].id;
                    optionElement.text = itemList[i].name;
                    if (itemList[i].id == selected) {
                      optionElement.selected = true;
                    }
                    selectElement.appendChild(optionElement);
                }
            }
            //loading終了処理
            loadEnd();

            return itemList;
        }
    };

//console.log("where:" + where);

    if (where != undefined) {
        xmlhr.send(JSON.stringify({'array':[item], 'where':[where]}));
    } else {
        xmlhr.send(JSON.stringify({'array':[item]}));
    }
}
