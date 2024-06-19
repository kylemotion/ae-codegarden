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
    

    var scriptName = "km-markertrigger";

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
    var inButton = applyGroup.add("button", undefined, "In");
    inButton.preferredSize = [-1,30];
    inButton.helpTip = "Click: Applies '+IN+' layer marker at CTI."
    var outButton = applyGroup.add("button", undefined, "Out");
    outButton.preferredSize = [-1,30];
    outButton.helpTip = "Click: Applies '+OUT+' layer marker at CTI."
    var scaleButton = applyGroup.add("button", undefined, "Scale");
    scaleButton.preferredSize = [-1,30];
    scaleButton.helpTip = "Click: Applies marker trigger expression to scale property of selected layers."

    
    


    inButton.onClick = function(){
        
        try {
            app.beginUndoGroup("In Marker Placement");
        
        var activeComp = app.project.activeItem;    
        var markerComment;
        markerComment = "IN";
        placeMarker(markerComment, activeComp)

    } catch(error) {
        alert(error)
      } finally {
        // this always runs no matter what
        app.endUndoGroup()
      }
      
    }

        
    outButton.onClick = function(){
        try {
            app.beginUndoGroup("Out Marker Placement");
        
        var activeComp = app.project.activeItem;    
        var markerComment;
        markerComment = "OUT";
        placeMarker(markerComment, activeComp)

    } catch(error) {
        alert(error)
      } finally {
        // this always runs no matter what
        app.endUndoGroup()
      }

    }

    scaleButton.onClick = function(){
        try {
            app.beginUndoGroup("Scale Expression");

        var activeComp = app.project.activeItem;    
        addScaleExpression(activeComp);
    } catch(error) {
        alert(error)
      } finally {
        // this always runs no matter what  
        app.endUndoGroup()
      }
    }



    function placeMarker(comment, comp){
        var curComp = comp;
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


    function addScaleExpression(comp){
        var curComp = comp;

        
        
        var selLayers = curComp.selectedLayers;
        var scaleExpression = 

        'function sine(_0x31b84d,_0x54cab5,_0x1d6622,_0x539bcf,_0x2d8204)\
        {if(arguments.length!==0x5)return value;var _0x1caa33=_0x2d8204-_0x539bcf,_0x482411=_0x1d6622-_0x54cab5;\
        return _0x31b84d=clamp((_0x31b84d-_0x54cab5)/_0x482411,0x0,0x1),_0x1caa33/0x2*(0x1-Math.cos(Math.PI*_0x31b84d))+_0x539bcf;}\
        \
        fadeFrames = 14;\
        m = 0; \
        t = time;\
        startVal = 100;\
        endVal = 135;\
        \
        if (marker.numKeys > 0) {\
            m = marker.nearestKey(time).index;\
            tag = marker.key(m).comment;\
            if (tag == "IN") { t = time - marker.key(m).time}\
            else if (tag == "OUT") { t = marker.key(m).time - time}\
            sine(t, 0, framesToTime(fadeFrames), [startVal,startVal], [endVal,endVal]);\
        } else {\
            value\
        }'



        if(curComp.selectedLayers.length > 0){
            for(var i = 0; i<selLayers.length; i++){
                selLayers[i].property("ADBE Transform Group").property("ADBE Scale").expression = scaleExpression
            }
        } else {
            alert("Select a layer to apply your marker to")
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
