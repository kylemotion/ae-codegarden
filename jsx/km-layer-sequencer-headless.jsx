/**
 * 
 * a script to sequence layers based on amount of frames
 * @author: Kyle Harter <kylenmotion@gmail.com>
 * @version 0.1.0
 * 
 * 
 * 
*/


(function(thisObj){

    try {
        app.beginUndoGroup("Sequences layers");
        

        sequenceLayers()
      } catch(error) {
        alert(error)

      } finally {
        // this always runs no matter what
        app.endUndoGroup()
      }

    
    function sequenceLayers(){
        var activeComp = app.project.activeItem;
        
        if(!(activeComp && activeComp instanceof CompItem)){
            return alert("Please open a comp first")
        }


        var compFrameRate = activeComp.frameDuration;
        var curLayerSel = activeComp.selectedLayers;

        if(curLayerSel.length < 2){
            return alert("Select atleast 2 layers first")
        }


        for(var i = 0; i < curLayerSel.length; i++){
            var layerDur = curLayerSel[i].outPoint - curLayerSel[i].inPoint;
            curLayerSel[i].inPoint  = curLayerSel[i].inPoint + (compFrameRate * i);
            curLayerSel[i].outPoint = curLayerSel[i].inPoint + layerDur;
        }

        return


    }

}(this))
