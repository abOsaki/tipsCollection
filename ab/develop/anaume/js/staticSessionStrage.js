function getSessionAllKey() {
    var result = [];
    var length = sessionStorage.length;
    for (var i = 0; i < length; i++) {
        var key = sessionStorage.key(i);
        result.push(key)
    }
    return result
}

function removeSession(array) {
    for (var i = 0; i < array.length; i++) {
        var removeKey = array[i];
        sessionStorage.removeItem(removeKey)
    }
}
const SessionUserIDKey = "userID";

function saveUserID(userID) {
    sessionStorage.setItem(SessionUserIDKey, userID)
}

function getUserID() {
    var result = sessionStorage.getItem(SessionUserIDKey);
    return result
}
const SessionQuestionSearchKey = "questionSearch";

function getQuestionSearchKey() {
    var questionKey = SessionQuestionSearchKey;
    var userID = getUserID();
    var result = questionKey + userID;
    return result
}

function saveQuestion(questionSerchObject) {
    var saveData = JSON.stringify(questionSerchObject);
    var questionSearchKey = getQuestionSearchKey();
    sessionStorage.setItem(questionSearchKey, saveData)
}

function getSaveQuestion() {
    var questionSearchKey = getQuestionSearchKey();
    var loadData = sessionStorage.getItem(questionSearchKey);
    if (loadData) {
        var result = JSON.parse(loadData);
        return result
    }
    return null
}

function clearSaveQuestion() {
    var keys = getSessionAllKey();
    var questionKeys = $.grep(keys, function(key, index) {
        return key.match(SessionQuestionSearchKey)
    });
    removeSession(questionKeys)
}
const SessionPackageSearchKey = "packageSearch";

function getPackageSearchKey() {
    var packageKey = SessionPackageSearchKey;
    var userID = getUserID();
    var result = packageKey + userID;
    return result
}

function savePackage(packageSerchObject) {
    var saveData = JSON.stringify(packageSerchObject);
    var packageSearchKey = getPackageSearchKey();
    sessionStorage.setItem(packageSearchKey, saveData)
}

function getSavePackage() {
    var packageSearchKey = getPackageSearchKey();
    var loadData = sessionStorage.getItem(packageSearchKey);
    if (loadData) {
        var result = JSON.parse(loadData);
        return result
    }
    return null
}

function clearSavePackage() {
    var keys = getSessionAllKey();
    var packageKeys = $.grep(keys, function(key, index) {
        return key.match(SessionPackageSearchKey)
    });
    removeSession(packageKeys)
}
const SessionEducationSearchKey = "educationSearch";

function getEducationSearchKey() {
    var educationKey = SessionEducationSearchKey;
    var userID = getUserID();
    var result = educationKey + userID;
    return result
}

function saveEducation(educationSerchObject) {
    var saveData = JSON.stringify(educationSerchObject);
    var educationSearchKey = getEducationSearchKey();
    sessionStorage.setItem(educationSearchKey, saveData)
}

function getSaveEducation() {
    var educationSearchKey = getEducationSearchKey();
    var loadData = sessionStorage.getItem(educationSearchKey);
    if (loadData) {
        var result = JSON.parse(loadData);
        return result
    }
    return null
}

function clearSaveEducation() {
    var keys = getSessionAllKey();
    var educationKeys = $.grep(keys, function(key, index) {
        return key.match(SessionEducationSearchKey)
    });
    removeSession(educationKeys)
}