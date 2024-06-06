/**
 * 
 * a script to do something amazing
 * @author: Kyle Harter <kylenmotion@gmail.com>
 * @version 0.1.0
 * 
 * 
 * 
*/


(function(thisObj){
    

    var scriptName = "markerPlace";

    createUI(thisObj)

    function createUI(thisObj){
        var win = thisObj instanceof Panel
        ? thisObj
        : new Window("window", scriptName, undefined, {
            resizeable: true
        })

    win.orientation = 'column';
    win.alignChildren = ["left", "top"];

    var mainGroup = win.add("group", undefined, "Main Group");
    mainGroup.orientation = 'column';


    var applyGroup = mainGroup.add("group", undefined, "Apply Group");
    applyGroup.orientation = 'row';
    var applyButton = applyGroup.add("button", undefined, "Apply");
    applyButton.preferredSize = [-1,30];
    applyButton.helpTip = "Click: Apply markers to selected layers.\rShift+Click: Apply markers to beginning of a comp."


    applyButton.onClick = function(){
    try {
        app.beginUndoGroup("What script does");

        var activeComp = app.project.activeItem;
        

        if(!(activeComp && activeComp instanceof CompItem)){
            alert("Please open a comp first")
            return
        }

        var markerComment;
        var keyState = ScriptUI.environment.keyboardState;


        if(keyState.shiftKey){
            markerComment = "OUT"
        } else {
            markerComment = "IN"
        }

        if(keyState.metaKey){
            addScaleExpression()
        } else {
            placeMarker(markerComment)
        }

        
        

      } catch(error) {
        alert(error)
      } finally {
        // this always runs no matter what
        app.endUndoGroup()
      }
      
    }

    function placeMarker(comment){
        var curComp = app.project.activeItem;
        var selLayers = curComp.selectedLayers;
        var curTime = curComp.time;


        if(curComp.selectedLayers.length > 0){
            var textMarker = new MarkerValue(comment);
            selLayers[0].marker.setValueAtTime(curTime,textMarker);
        } else {
            alert("Select a layer to apply your marker to")
        }

        return
    }


    function addScaleExpression(){
        var curComp = app.project.activeItem;
        
        var selLayers = curComp.selectedLayers;
        var scaleExpression = 
        '/* ---------- Flow Function Declarations ---------- */\
        function customBezier(_0x2d9177,_0x5c8757,_0x6afde2,_0x174984,_0x2ff069,_0x240aad){if(arguments.length!==0x6)\
        return value;var _0x13de91=_0x2ff069-_0x174984,_0x34deaf=_0x6afde2-_0x5c8757;_0x2d9177=clamp((_0x2d9177-_0x5c8757)/_0x34deaf,0x0,0x1);\
        if(!(_0x240aad instanceof Array)||_0x240aad.length!==0x4)_0x240aad=[0x0,0x0,0x1,0x1];return _0x13de91*bezierCurve(_0x2d9177,_0x240aad)+_0x174984;\
        function bezierCurve(_0xa9b6d4,_0x121eda){var _0x3ca26a=0x3*_0x121eda[0x0],_0x125266=0x3*(_0x121eda[0x2]-_0x121eda[0x0])-_0x3ca26a,_0x555e8a=0x1-_0x3ca26a-\
        _0x125266,_0x4c53a9=0x3*_0x121eda[0x1],_0x34605b=0x3*(_0x121eda[0x3]-_0x121eda[0x1])-_0x4c53a9,_0xeaf102=0x1-_0x4c53a9-_0x34605b,_0x1a2e39=_0xa9b6d4;\
        for(var _0x50789f=0x0;_0x50789f<0x5;_0x50789f++){var _0x4d0609=_0x1a2e39*(_0x3ca26a+_0x1a2e39*(_0x125266+_0x1a2e39*_0x555e8a))-_0xa9b6d4;\
        if(Math.abs(_0x4d0609)<0.001)break;_0x1a2e39-=_0x4d0609/(_0x3ca26a+_0x1a2e39*(0x2*_0x125266+0x3*_0x555e8a*_0x1a2e39));}return _0x1a2e39*(_0x4c53a9+_0x1a2e39*(_0x34605b+_0x1a2e39*_0xeaf102));}}\
        \
        easeValues = [0.34838709677419,0.00665161290323,0.21612903225806,0.99818548387097];\
        fadeFrames = 12;\
        m = 0; \
        t = time;\
        startVal = 75;\
        endVal = 100;\
        \
        if (marker.numKeys > 0) {\
            m = marker.nearestKey(time).index;\
            tag = marker.key(m).comment;\
            if (tag == "IN") { t = time - marker.key(m).time}\
            else if (tag == "OUT") { t = marker.key(m).time - time}\
            customBezier(t, 0, framesToTime(fadeFrames), [startVal,startVal], [endVal,endVal], easeValues);\
        } else {\
            value\
        }'


        for(var i = 0; i<selLayers.length; i++){
            selLayers[i].property("ADBE Transform Group").property("ADBE Scale").expression = scaleExpression
        }

        return

    }


    win.onResizing = win.onResize = function (){
        this.layout.resize();
    };

    if(win instanceof Window){
        win.center();
        win.show();
    } else {
        win.layout.layout(true);
        win.layout.resize();
    }


    }

}(this))
