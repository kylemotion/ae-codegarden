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
    



    var scriptName = "km-layer-sequencer";

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


    var frameDelayGroup = mainGroup.add("group", undefined, "Frame Delay Group");
    frameDelayGroup.orientation = 'row';
    var frameDelayText = frameDelayGroup.add("statictext", undefined, "Frames to delay: ")
    var frameDelayTextBox = frameDelayGroup.add("edittext", undefined, "1");
    frameDelayTextBox.preferredSize = [50,30];

    
    var applyGroup = mainGroup.add("group", undefined, "Apply Group");
    applyGroup.orientation = 'row';
    var applyButton = applyGroup.add("button", undefined, "Apply");
    applyButton.preferredSize = [-1,30];
    applyButton.helpTip = "Click: Sequence layers.\rInsert a number in text field to offset layers by a specific amount of frames"


    applyButton.onClick = function(){
    try {
        app.beginUndoGroup("Sequences layers");
        

        sequenceLayers(frameDelayTextBox.text)

      } catch(error) {
        alert(error)
      } finally {
        // this always runs no matter what
        app.endUndoGroup()
      }
      
    }

    
    function sequenceLayers(delayFrames){
        var activeComp = app.project.activeItem;
        
        if(!(activeComp && activeComp instanceof CompItem)){
            return alert("Please open a comp first")
        }


        var compFrameRate = activeComp.frameDuration;
        var curLayerSel = activeComp.selectedLayers;

        if(curLayerSel.length < 2){
            return alert("Select atleast 2 layers first")
        }

        if(isNaN(delayFrames) || delayFrames.trim() == ''){
            return alert("Please enter a number in the text field")
        }

        


        for(var i = 0; i < curLayerSel.length; i++){
            var layerDur = curLayerSel[i].outPoint - curLayerSel[i].inPoint;
            if(delayFrames == 1){
            curLayerSel[i].startTime  = curLayerSel[i].inPoint + (compFrameRate * i);
            } else { 
                curLayerSel[i].startTime  = curLayerSel[i].inPoint + (compFrameRate * i * parseInt(delayFrames))
            }
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
