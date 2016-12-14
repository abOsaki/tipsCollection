function createUserFrmSubmit() {

    userid = document.getElementById("modal_id").value;
    displayname = document.getElementById("modal_displayname").value;
    password = document.getElementById("modal_password").value;
    authority = document.getElementById("modal_authority").value;
console.log('userid:' + userid);
console.log('displayname:' + displayname);
console.log('authority:' + authority);

    sendData = {};
    sendData.userid = userid;
    sendData.displayname = displayname;
    sendData.password = password;
    sendData.authority = authority;

    var xmlhr, response;
    xmlhr = new XMLHttpRequest();
    xmlhr.open("POST", "../api/user/create_user", true);
    //console.log(data);
    xmlhr.onreadystatechange = function () {
        if (xmlhr.readyState === 1) {
            //loading開始処理
            loadStart();
        }
        if (xmlhr.readyState === 4) {
            response = xmlhr.responseText;
            location.href = "./";
            //loading終了処理
            loadEnd();
        }
    };
    xmlhr.send(JSON.stringify(sendData));

}

function updateUserFrmSubmit() {
    id = document.getElementById("modal_id").value;
    element = document.getElementById("modal_displayname");
console.log('updateUserFrmSubmit() element:' + element);
console.log('updateUserFrmSubmit() element.name:' + element.name);
console.log('updateUserFrmSubmit() element.value:' + element.value);
console.log('updateUserFrmSubmit() element.type:' + element.type);
console.log('updateUserFrmSubmit() element.defaultValue:' + element.defaultValue);
console.log('updateUserFrmSubmit() element.id:' + element.id);

    displayname = document.getElementById("modal_update_displayname").value;
//    displayname = $(this).find('.modal-body .name').val;
//    password = document.getElementById("modal_password").value;
    authority = document.getElementById("modal_authority").value;
console.log('updateUserFrmSubmit() id:' + id);
console.log('updateUserFrmSubmit() displayname:' + displayname);
console.log('updateUserFrmSubmit() authority:' + authority);

    sendData = {};
    sendData.id = id;
    sendData.displayname = displayname;
//    sendData.password = password;
    sendData.authority = authority;

    var xmlhr, response;
    xmlhr = new XMLHttpRequest();
    xmlhr.open("POST", "../api/user/update_user", true);
    //console.log(data);
    xmlhr.onreadystatechange = function () {
        if (xmlhr.readyState === 1) {
            //loading開始処理
            loadStart();
        }
        if (xmlhr.readyState === 4) {
            response = xmlhr.responseText;
            location.href = "./";
            //loading終了処理
            loadEnd();
        }
    };
    xmlhr.send(JSON.stringify(sendData));
}

function setModalUser(id, target) {
    var xmlhr, response;
    xmlhr = new XMLHttpRequest();
    xmlhr.open("POST", "../api/user/get", true);
    //console.log(data);
    xmlhr.onreadystatechange = function () {
        if (xmlhr.readyState === 1) {
            //loading開始処理
            loadStart();
        }
        if (xmlhr.readyState === 4) {
            response = xmlhr.responseText;
            response = JSON.parse(response);
console.log("response.id:" + response.id);
            $(target).find('.modal-body .id').text(response.id);
console.log("response.loginName:" + response.userid);
            $(target).find('.modal-body .userid').text(response.userid);
console.log("response.name:" + response.name);
            $(target).find('.modal-body .name').val(response.name);

            document.getElementById("modal_id").value = response.id;
//            document.getElementById("modal_displayname").value = response.name;

            tdElement = document.getElementById("user_modal_authority_td");
            while (tdElement.firstChild) {
                tdElement.removeChild(tdElement.firstChild);
            }
            selectElement = document.createElement("select");
            selectElement.id = 'modal_authority';

            optionElement = document.createElement("option");
            optionElement.value = "s";
            optionElement.text = "s 支援員";
            if (response.authority == "s") {
              optionElement.selected = true;
            }
            selectElement.appendChild(optionElement);

            optionElement = document.createElement("option");
            optionElement.value = "m";
            optionElement.text = "m 管理者";
            if (response.authority == "m") {
              optionElement.selected = true;
            }
            selectElement.appendChild(optionElement);

            selectElement.appendChild(optionElement);
            tdElement.appendChild(selectElement);

            //loading終了処理
            loadEnd();
        }
    };
    xmlhr.send(JSON.stringify({'id': id}));

}

