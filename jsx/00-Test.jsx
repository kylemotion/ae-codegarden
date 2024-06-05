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
    

    var scriptName = "Text";

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

        sequenceLayers()

      } catch(error) {
        alert(error)
      } finally {
        // this always runs no matter what
        app.endUndoGroup()
      }
      
    }

    // returns an array of selected properies
    function collectKeyFrames(){
        var keysArray = new Array();
        var selLayers = app.project.activeItem.selectedLayers;
        var keyedProp = selLayers[0].property("ADBE Transform Group").property("Y Position");

        if(keyedProp.numKeys > 0){
            for(var i = 1; i <= keyedProp.numKeys; i++){
                keysArray.push(keyedProp.keyTime(i))
            }
        }
        return keysArray
        
    }

    function sequenceLayers(){
        var keysArray = collectKeyFrames();
        var selLayers = app.project.activeItem.selectedLayers;

        for(var n = 1; n < selLayers.length; n++){
            selLayers[n].inPoint = keysArray[n-1];
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
