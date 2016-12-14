//color[ color.length - 1 ] = ESCAPE COLOR
var color = [ "#FF7F50", "#FFD700", "#98FB98", "#87CEEB", "#6495ED", "#EE82EE", "#9370DB" ];

//fake overload
function lineChart( id, inputData, inputLabels, unit, min, max, border )
{
    if ( arguments.length == 6 )
        lineChartNoBorder( id, inputData, inputLabels, unit, min, max );
    
    else if ( arguments.length == 7 )
        lineChartBorder( id, inputData, inputLabels, unit, min, max, border );
}

function lineChartNoBorder( id, inputData, inputLabels, unit, min, max )
{   
    var labels = [], dataset;
    
    for ( i = 0; i < inputLabels.length; i++ )
        labels[i] = inputLabels[i] + unit;
 
    if ( id == "sleepData" )
    {
        dataset = {
                    strokeColor: "rgba( 0, 128, 255, 1.0 )",
                    pointColor: "rgba( 0, 0, 255, 1.0 )",
                    pointStrokeColor: "rgba( 0, 0, 255, 1.0 )",
                    pointHighlightFill: "rgba( 0, 0, 255, 1.0 )",
                    pointHighlightStroke: "rgba( 0, 0, 255, 1.0 )",
                    data: inputData
                  };
        
        Chart.defaults.global.tooltipTemplate = "<%if (label){%><%=label%>: <%}%><%= value %>";
    }
    
    else if ( id == "qualityData" )
    {
        dataset = {
                    strokeColor: "rgba( 255, 192, 0, 1.0 )",
                    pointColor: "rgba( 255, 128, 0, 1.0 )",
                    pointStrokeColor: "rgba( 255, 128, 0, 1.0 )",
                    pointHighlightFill: "rgba( 255, 128, 0, 1.0 )",
                    pointHighlightStroke: "rgba( 255, 128, 0, 1.0 )",
                    data: inputData
                  };
        
        Chart.defaults.global.tooltipTemplate = "<%if(label){%><%}%><%%><%if(value > 2){%><%=value%><%}else if(value == 0){%>あまり眠れなかった<%}else if(value == 1){%>眠れた<%}else if(value == 2){%>よく眠れた<%}%>";
    }
    
    var data =
    {
        labels: labels,
        datasets:
        [
                dataset
        ]
    }
    
    var options = 
    {
        scaleOverlay: true,
        scaleOverride: true,
        scaleSteps: max - min,
        scaleStepWidth: 1,
        scaleStartValue: min,
        bezierCurve: false,
        datasetFill: false,
        pointDot: true,
    }
    
    new Chart( document.getElementById(id).getContext("2d") ).Line( data, options );
}

function lineChartBorder( id, inputData, inputLabels, unit, min, max, borderNum )
{
    var labels = [], border = [], dataset;
    
    for ( i = 0; i < inputLabels.length; i++ )
        labels[i] = inputLabels[i] + unit;
    
    for ( i = 0; i < inputData.length; i++ )
        border[i] = borderNum;
    
    if ( id == "sleepData" )
    {
        dataset = {
                    strokeColor: "rgba( 0, 128, 255, 1.0 )",
                    pointColor: "rgba( 0, 0, 255, 1.0 )",
                    pointStrokeColor: "rgba( 0, 0, 255, 1.0 )",
                    pointHighlightFill: "rgba( 0, 0, 255, 1.0 )",
                    pointHighlightStroke: "rgba( 0, 0, 255, 1.0 )",
                    data: inputData
                  };
        
        Chart.defaults.global.tooltipTemplate = "<%if (label){%><%=label%>: <%}%><%= value %>";
    }
    
    else if ( id == "qualityData" )
    {
        dataset = {
                    strokeColor: "rgba( 255, 192, 0, 1.0 )",
                    pointColor: "rgba( 255, 128, 0, 1.0 )",
                    pointStrokeColor: "rgba( 255, 128, 0, 1.0 )",
                    pointHighlightFill: "rgba( 255, 128, 0, 1.0 )",
                    pointHighlightStroke: "rgba( 255, 128, 0, 1.0 )",
                    data: inputData
                  };
        
        Chart.defaults.global.tooltipTemplate = "<%if(label){%><%}%><%%><%if(value > 2){%><%=value%><%}else if(value == 0){%>あまり眠れなかった<%}else if(value == 1){%>眠れた<%}else if(value == 2){%>よく眠れた<%}%>";
    }
    
    var data =
    {
        labels: labels,
        datasets:
        [
            dataset,
            
            {
                strokeColor: "rgba( 255, 0, 0, 1.0 )",
                pointColor:  "rgba( 255, 0, 0, 0.0 )",
                pointStrokeColor: "rgba( 255, 0, 0, 0.0 )",
                pointHighlightFill: "rgba( 255, 0, 0, 0.0 )",
                pointHighlightStroke: "rgba( 255, 0, 0, 0.0 )",
                data: border
            }
        ]
    }
    
    var options = 
    {
        scaleOverlay: true,
        scaleOverride: true,
        scaleSteps: max - min,
        scaleStepWidth: 1,
        scaleStartValue: min,
        bezierCurve: false,
        datasetFill: false,
        pointDot: true,
    }
    
    new Chart( document.getElementById(id).getContext("2d") ).Line( data, options );
}

function barChart( id, inputData, inputLabels, unit, scaleStartValue, scaleStepWidth, scaleSteps )
{
    var labels = [];
    
    for ( i = 0; i < inputLabels.length; i++ )
        labels[i] = inputLabels[i] + unit;
    
    var data =
    {
        labels: labels,
        datasets:
        [
            {
                fillColor: "rgba( 220, 220, 220, 0.2 )",
                strokeColor: "rgba( 220, 220, 200, 1.0 )",
                pointColor: "rgba( 220, 220, 220, 1.0 )",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba( 220, 220, 220, 1.0 )",
                data: inputData
            }
        ]
    }
    
    var options = 
    {
        scaleOverlay: true,
        datasetFill: false,
        pointDot: true,
    }
    
    if(scaleStartValue != null && scaleStepWidth != null && scaleSteps != null) {
        options["scaleOverride"] = true;
        options["scaleStartValue"] = scaleStartValue;
        options["scaleStepWidth"] = scaleStepWidth;
        options["scaleSteps"] = scaleSteps;
    }
    
    return new Chart( document.getElementById(id).getContext("2d") ).Bar( data, options );
}

function pieChart( id, inputData, inputLabels, unit )
{
    var data = [];
    
    for ( var i = 0; i < inputData.length; i++ )
    {
        data[i] = {};
        data[i]["value"] = inputData[i];
        data[i]["label"] = inputLabels[i] + unit;
        
//        if ( ( inputData.length % ( color.length - 1 ) ) == 1 && i == ( inputData.length - 1 ) )
//        {
//            //ESCAPE COLOR
//            data[i]["color"] = color[ color.length - 1 ];
//        }
//            
//        else
//            data[i]["color"] = color[ i % ( color.length - 1 ) ];
        
        data[i]["color"] = color[ i % color.length ];
    }
    
    var options = 
    {
        animateScale: false,
        legendTemplate: "<ul><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\">&nbsp;&nbsp;&nbsp;&nbsp;</span><%if(segments[i].label){%>&nbsp;&nbsp;<%=segments[i].label%><%}%></li><%}%></ul>",
    }

    return ( new Chart( document.getElementById(id).getContext("2d") ).Pie( data, options ) );
}

function radarChart( id, inputData, inputLabels, unit )
{
    var labels = [];
    
    for ( i = 0; i < inputLabels.length; i++ )
        labels[i] = inputLabels[i] + unit;
    
    var data =
    {
        labels: labels,
        datasets:
        [
            {
                fillColor: "rgba( 220, 220, 220, 0.2 )",
                strokeColor: "rgba( 220, 220, 200, 1.0 )",
                pointColor: "rgba( 220, 220, 220, 1.0 )",
                pointStrokeColor: "#fff",
                data: inputData
            }
        ]
    }
    
    var options = 
    {
        scaleShowLabels: true,
        pointLabelFontSize: 10
    }
    
    new Chart( document.getElementById(id).getContext("2d") ).Radar( data, options );
}