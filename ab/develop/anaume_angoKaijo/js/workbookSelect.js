$(function() {
    $(window).load(function() {
        var rowCount = document.createElement("tbody").children.length;
        if (rowCount === 0) {
            var packageSerchObject = getSavePackage();
            if (packageSerchObject != null) {
                loadPackage(packageSerchObject.itemDataList);
                settingBaseInfoCallBack = function() {
                    rollbackBaseInfoPackage(packageSerchObject)
                }
            }
        }
    })
});