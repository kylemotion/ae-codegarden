
/**
 * 
 * a headless script to reverse the layer order in an after effects composition
 * @author: Kyle Harter <kylenmotion@gmail.com>
 * @version 0.1.1
 * 
 * 
 * 
*/


(function(){

    try {
        app.beginUndoGroup("layer order reverse");
        var activeComp = app.project.activeItem;
        var layerSelection = getLayerSel(activeComp);
        var sortedLayers = sortLayers(layerSelection)

        reverseLayerOrder(layerSelection, sortedLayers, activeComp)
      } catch(error) {
        alert(error)

      } finally {
        // this always runs no matter what
        app.endUndoGroup()
      }
      
      

    function getLayerSel(comp){
      var selLayers
      
      if(!(comp && comp instanceof CompItem)){
         alert("Open up a comp first")
         return
      }

      selLayers = comp.selectedLayers;
      
      if(selLayers.length < 2){
        alert("Select atleast 2 layers first")
        return 
      }
      
      var sellayersCollection = new Array();

      for(var i = 0; i<selLayers.length; i++){
        sellayersCollection.push(selLayers[i]);
      }

      return sellayersCollection

    }

    function sortLayers(layers){
      return layers.slice().sort(function(a,b){
        return a.index-b.index
      })
    }


    function reverseLayerOrder(selLayers,layersArray,comp){
      var origSelLayers = selLayers.reverse();
      var layerIndices = layersArray;
      
      for(var i = 1; i<layerIndices.length; i++){
        var layer = origSelLayers[i];
          if(i==0){
            // alert(layer.name)
            // Move the first layer to it's new position
            layer.moveBefore(comp.layer(origSelLayers[origSelLayers.length-1]))
          } else{
            // alert(layer.name)
            // move the rest of the layers
            layer.moveAfter(origSelLayers[i-1])
          }
      }

      return 
    }
   
    

}())