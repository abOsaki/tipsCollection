$(function() {
    $(window).load(function() {
        var rowCount = document.createElement("tbody").children.length;
        if (rowCount === 0) {
            var educationSerchObject = getSaveEducation();
            if (educationSerchObject != null) {
                loadEdcation(educationSerchObject.itemDataList, educationSerchObject.eduType);
                settingBaseInfoCallBack = function() {
                    rollbackBaseInfoEducation(educationSerchObject)
                }
            }
        }
    })
});