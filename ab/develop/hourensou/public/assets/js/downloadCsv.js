var downloadCsv = (function () {

    var newLineChar = "\r\n";

    var createCsvString = function (tableBody, tableHeader) {

        var csvStr = "";
        var ncols;

        if (tableHeader) {
            var tableData = tableHeader.children[0].children;
            ncols = countColumns(tableData);
            csvStr += tdArrayToCsvRowStr(tableData, ncols);
        }

        var tableRows = tableBody.childNodes; //tr

        for (var i = 0, iLen = tableRows.length; i < iLen; i++) {
            var tableData = tableRows[i].childNodes;
            csvStr += tdArrayToCsvRowStr(tableData, ncols);
        }

        return csvStr;
    };

    var countColumns = function (thData) {
        var count = 0;
        for (var i = 0, len = thData.length; i < len; i++) {
            if (thData[i].textContent == "") {
                break;
            } else {
                count++;
            }
        }
        return count;
    }

    var tdArrayToCsvRowStr = function (tdArray, maxColumn) {

        var str = "";
        var len = tdArray.length;
        if (maxColumn && maxColumn < len) {
            len = maxColumn;
        }
        for (var i = 0; i < len; i++) {

            var dataStr = tdArray[i].innerHTML;
console.log('1 downloadCsv dataStr:' + dataStr);

            if (dataStr.match(/^<button/) || dataStr.match(/^<textarea/)) {
                dataStr = tdArray[i].textContent;
            }
            if (dataStr.match(/^<div/) || dataStr.match(/^<span /)) {
                dataStr = tdArray[i].textContent;
console.log('2 downloadCsv dataStr:' + dataStr);
            }

            dataStr = dataStr.replace(/\n/g, newLineChar)
                .replace(/<br>/g, newLineChar);

            dataStr = dataStr.replace(/"/g, "\"\"")
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&amp;/g, '&');

            if (i != 0) {
                str += ",";
            }
            str += '"' + dataStr + '"';
        }

        return str + newLineChar;
    }

    return function (filename, tableBody, tableHeader) {
        if (!filename) {
            filename = 'output.csv';
        }

        var csv = createCsvString(tableBody, tableHeader);
        var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
        var blobObject = new Blob([bom, csv], {
            type: 'text/csv'
        });

        window.navigator.msSaveOrOpenBlob(blobObject, filename);
    };

})();