/**
 * 
 * a script to sequence layers based on amount of frames
 * @author: Kyle Harter <kylenmotion@gmail.com>
 * @version 0.1.1
 * 
 * 
 * 
*/


(function(thisObj){

    try {
        app.beginUndoGroup("Sequences layers");
        
      var keyState = ScriptUI.environment.keyboardState;
      // Cmd key on Mac
      var os = $.os.toLowerCase().indexOf('mac') >= 0 ? "MAC": "WINDOWS";
      var modKey;
      if(os == "MAC"){
        modKey = keyState.metaKey;
      } else {
        modKey = keyState.ctrlKey;
      }

        sequenceLayers(modKey)
      } catch(error) {
        alert(error)

      } finally {
        // this always runs no matter what
        app.endUndoGroup()
      }

    
    function sequenceLayers(mod){
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
          if(!(mod)){
            curLayerSel[i].startTime  = curLayerSel[i].startTime + (compFrameRate * i);
          } else {
            curLayerSel[i].startTime = curLayerSel[i].startTime + (compFrameRate * Math.random(-i, i));
          }
        }
 
        return


    }

}(this))
