
var stopWatchFunc = function(){
    //時間管理クラス
    var timeManage = function(){
        
        function diffrentTime(afterTime,beforeTime,gmt){
            var diffrent = new Date(afterTime - beforeTime);
            //表示情報の取得
            var milliSecond = diffrent.getMilliseconds();
            this.milliSecond = milliSecond;
            var seccond = diffrent.getSeconds();
            this.seccond = seccond;
            var minutes = diffrent.getMinutes();
            this.minutes = minutes;
            var hour = diffrent.getHours() + gmt;
            this.hour = hour;
            this.getTimeText = function(){
                var textHour = hour < 10 ? "0" + hour : hour;
                var textMinutes = minutes < 10 ? "0" + minutes : minutes;
                var textSecond = seccond < 10 ? "0" + seccond : seccond;
                var milliSecondBufu = parseInt(milliSecond / 10);
                var textMilliSecond = milliSecondBufu < 10 ? "0" + milliSecondBufu : milliSecondBufu;
                //var result = textHour + ":" + textMinutes + ":" + textSecond + ":" + textMilliSecond;
                var result = textMinutes + ":" + textSecond;
                return result;
            };
            this.getRecodeText = function(){
                var textMinutes = minutes < 10 ? "0" + minutes : minutes;
                var textSecond = seccond < 10 ? "0" + seccond : seccond;
                var result = textMinutes + ":" + textSecond;
                return result;
            };
            return this;
        };
        
        function start(){
            setField();
            interval();
        };
        
        function end(){
            cvIsEnd = true;
        };
        
        var gmt;
        var startDate;
        var stopWatch;
        function setField(){
            gmt = new Date().getTimezoneOffset() / 60;
            startDate = new Date().getTime();
            stopWatch = document.getElementById('stopWatch');
            cvIsStart = true;
            cvIsEnd = false;
        }
        
        var cvIsStart;
        var cvIsEnd;
        function interval(){
            //現在の時間取得
            var nowDate = new Date().getTime();
            var diffTime = new diffrentTime(nowDate,startDate,gmt);
            displayTime(diffTime);
            
            if(!cvIsEnd){
                setTimeout(interval,10);
            }
        };
        
        function displayTime(diffrentTime){
            stopWatch.textContent = diffrentTime.getTimeText();
        }
        
        this.start = function(){
            start();
        };
        this.end = function(){
            end();
        };
        this.getIsRnning = function(){
            return (cvIsStart && !cvIsEnd);
        };
    };
    
    var cvTimeManage;
    
    return{
        start: function(){
            cvTimeManage = new timeManage();
            cvTimeManage.start();
        },
        end : function(){
            cvTimeManage.end();
        },
        getIsRunning : function(){
            if(cvTimeManage){
                return cvTimeManage.getIsRnning();
            }else{
                return false;
            }
        }
    };
}();

var enqueteManageFunc = function(){
    
    function setEnquete(pvCommand,pvCallback){
        //クエッションＩＤの取得
        var id = document.getElementById('enqueteID').value;
        
        var sendData = {
            'command' : pvCommand,
            'id' : id
        };
        $.ajax({
            url: 'enqueteStartStop.php',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(sendData)
        }).done(function(data){
            pvCallback();
        }).fail(function(data){
            console.log(data);
        });
    };
    
    function setStartEnquete(pvCallback){
        setEnquete('startEnquete',pvCallback);
    };
    
    function setEndEnquete(pvCallback){
        setEnquete('stopEnquete',pvCallback);
    };
    
    return {
        startEnquete : function(pvCallback){
            setStartEnquete(pvCallback);
        },
        endEnquete : function(pvCallback){
            setEndEnquete(pvCallback);
        }
    };
}();

var uiControler = function(){
    
    return {
        invalidTimeSelect : function(){
            $("#timeSelect").prop("disabled", true);
        },
        invalidStartButton : function(){
            $('#startBtn').prop("disabled", true);
        },
        invalidEndButton : function(){
            $('#endBtn').prop("disabled", true);
        },
        validEndButton : function(){
            $('#endBtn').prop("disabled", false);
        }
    };
}();

$(function () {
    "use strict";
    
    uiControler.invalidEndButton();
    
    $(window).on('beforeunload',function(){
        var isRunning = stopWatchFunc.getIsRunning();
        if(isRunning){
            event.returnValue='アンケート実施中です。終了してページを移動しますか？';
        }
    });
    
    $('#startBtn').on('click',function(){
        uiControler.invalidTimeSelect();
        uiControler.invalidStartButton();
        var callback = stopWatchFunc.start;
        enqueteManageFunc.startEnquete(callback);
        uiControler.validEndButton();
    });
    
    $('#endBtn').on('click',function(){
        uiControler.invalidEndButton();
        var callback = stopWatchFunc.end;
        enqueteManageFunc.endEnquete(callback);
    });
});