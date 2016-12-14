var undoOperation = (function() {
    var undoAction;
    var redoAction;

    function undoExecute() {
        if (undoAction != null) {
            undoAction()
        }
    };

    function redoExecute() {
        if (redoAction != null) {
            redoAction()
        }
    };

    function setUndoAction(pvUndoAction) {
        undoAction = pvUndoAction
    };

    function setRedoAction(pvRedoAction) {
        redoAction = pvRedoAction
    };
    return {
        undoExecute: function() {
            undoExecute()
        },
        redoExecute: function() {
            redoExecute()
        },
        setUndoAction: function(pvUndoAction) {
            setUndoAction(pvUndoAction)
        },
        setRedoAction: function(pvRedoAction) {
            setRedoAction(pvRedoAction)
        }
    }
})();