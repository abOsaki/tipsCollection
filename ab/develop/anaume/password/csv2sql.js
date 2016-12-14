//使用例：<input type="file" id="upload" onchange="csvConvert(this)" />
/*global jsSHA, Blob, FileReader*/
function csvConvert(e) {
    "use strict";

    //ハッシュ化（ライブラリ利用）
    function getSaltedPassword(password, userId) {
        var stretchCount, shaObj, saltObj, salt, hash, i, il;
        stretchCount = 1000;

        saltObj = new jsSHA("SHA-256", "TEXT");
        saltObj.update(userId);
        salt = saltObj.getHash("HEX");
        hash = "";

        for (i = 0; i < stretchCount; i += 1) {
            shaObj = new jsSHA("SHA-256", "TEXT");
            shaObj.update(hash + salt + password);
            hash = shaObj.getHash("HEX");
        }
        return hash;
    }

    //特定のカラムに対し別操作
    function columnReplace(csvArray) {
        function pw2hash(pNum, uNum) {
            var i, il, j, jl, row;
            //password,loginNameがあるならハッシュ化
            for (i = 1, il = csvArray.length; i < il; i += 1) { //0番目はヘッダー
                row = csvArray[i];
                csvArray[i][pNum] = getSaltedPassword(row[pNum], row[uNum]);
            }
            return csvArray;
        }

        var i, il, j, jl, userNum, pwNum, headArray, column;
        //ヘッダー行
        headArray = csvArray[0];
        //console.log(headArray);
        for (i = 0, il = headArray.length; i < il; i += 1) {
            //特定カラム名に対して別操作
            column = headArray[i];
            if (column === "password" || column === "loginName") {
                if (column === "password") {
                    pwNum = i;
                } else if (column === "loginName") {
                    userNum = i;
                }
                if (pwNum >= 0 && userNum >= 0) {
                    //ハッシュ化
                    csvArray = pw2hash(pwNum, userNum);
                    break;
                }
            } else if (column === "date") {
                for (j = 1, jl = csvArray.length; j < jl; j += 1) {
                    if (!csvArray[j][i]) {
                        csvArray[j][i] = "NOW()";
                    }
                }
            } else if (column === "keyword") {
                for (j = 1, jl = csvArray.length; j < jl; j += 1) {
                    if (csvArray[j][i]) {
                        csvArray[j][i] = csvArray[j][i].replace(/\&br/g, "&comma");
                    }
                }
            }
        }
        return csvArray;
    }
    //csvからArray
    function csv2array(csvData) {
        var csvArray, tempArray, i, il;
        tempArray =
            csvData
            .replace(/\r(?!(([^"]*"){2})*[^"]*$)/g, '')
            .replace(/\n(?!(([^"]*"){2})*[^"]*$)/g, '&br') //１セル内の改行コードを「&br」へ変換
            .replace(/\,(?!(([^"]*"){2})*[^"]*$)/g, '&comma') //１セル内のカンマを「&comma」へ変換
            .replace(/\,\"/g, ',') //「"」を消去
            .replace(/\"\,/g, ',') //「"」を消去
            .replace(/\"\r\n/g, '\r\n') //「"」を消去
            .split('\r\n');
        csvArray = [];
        //カンマごとに格納
        for (i = 0, il = tempArray.length; i < il; i += 1) {
            csvArray.push(tempArray[i].split(","));
        }
        return csvArray;
    }

    //ArrayからString(SQL文)
    function array2str(arrayData) {
        var sqlInsert, sqlValues, sqlStr, sql, i, il;
        //ヘッダー情報
        sqlInsert = "(`" + arrayData[0].join("`, `") + "`)";
        //各行
        sqlValues = "";
        for (i = 1, il = arrayData.length; i < il; i += 1) {
            if (arrayData[i].length === arrayData[0].length) { //ヘッダー行と同じ項目数ならば
                sqlStr = ("'" + arrayData[i].join("', '") + "'")
                    .replace(/\'\'/g, 'NULL')
                    .replace(/\'NOW\(\)\'/g, 'NOW()')
                    .replace(/\&br/g, '\\r\\n') //「&br」を改行文字へ変換
                    .replace(/\&comma/g, ','); //「&comma」を「,」へ変換
                if (sqlValues) {
                    sqlValues += ",\r\n";
                }
                sqlValues += "(" + sqlStr + ")";
            }
        }
        sql = "INSERT INTO\r\n`users`\r\n" + sqlInsert + "\r\nVALUES\r\n" + sqlValues + ";";
        return sql;
    }

    //StringからBlob
    function str2file(strCsv) {
        var i, il, blob;
        //ファイル作成
        blob = new Blob([strCsv], {
            type: "text/plain;charset=utf-8"
        });
        return blob;
    }

    //ダウンロード
    function downloadBtn(csvFile) {
        var hrefURL, fileName, hrefTarget, ahtml,
            spanEle = document.getElementById("download"),
            spanText = spanEle.textContent;
        if (window.navigator.msSaveOrOpenBlob) {
            //IEの場合
            spanEle.className = "linkSpan";
            spanEle.onclick = function () {
                navigator.msSaveBlob(csvFile, "download.sql");
            };
        } else {
            //IE以外(Chrome, Firefox)
            hrefURL = window.URL.createObjectURL(csvFile);
            fileName = "download.sql";
            hrefTarget = "_blank";
            ahtml = "<a href='" + hrefURL + "' target='" + hrefTarget + "' download='" + fileName + "'>" + spanText + "</a>";
            spanEle.innerHTML = ahtml;
        }
    }

    //表の生成
    function createTable(csvArray) {
        var dataList, trsHtml, trHtml, colLength, i, il, j, jl;
        //0番目の項目数を基準
        colLength = csvArray[0].length;
        trsHtml = "";
        for (i = 0, il = csvArray.length; i < il; i += 1) {
            dataList = csvArray[i];
            //項目数が基準と異なるとき追加しない
            if (colLength !== dataList.length) {
                continue;
            }
            //一行分のHTMLを生成
            trHtml = "<tr>";
            for (j = 0, jl = dataList.length; j < jl; j += 1) {
                trHtml += "<td>" + dataList[j] + "</td>";
            }
            trHtml += "</tr>";
            trsHtml += trHtml;
        }
        document.getElementById("csvTable").innerHTML = trsHtml;
    }

    var data, file, reader,
        inputEle = e;
    //ファイル選択されたか
    if (!inputEle.value) {
        return false;
    }
    //CSVファイル読み込み
    file = inputEle.files[0];
    reader = new FileReader();
    reader.onload = function () {
        var csvArray, sqlStr, sqlFile,
            result = this.result;
        //CSV配列生成
        csvArray = csv2array(result);
        //特定カラムに対して別操作（password,date）
        csvArray = columnReplace(csvArray);
        //テーブル表示
        createTable(csvArray);
        //SQL文字列生成
        sqlStr = array2str(csvArray);
        //SQLファイルデータ生成
        sqlFile = str2file(sqlStr);
        //SLQダウンロード
        downloadBtn(sqlFile);
    };
    reader.readAsText(file, "shift-jis");
}