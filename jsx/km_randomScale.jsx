/// a script to rnadomly position layers in 2D and 3D space

(function km_randomPosition(thisObj) {
    var currentComp = app.project.activeItem;

    if (!(currentComp && currentComp instanceof CompItem)){
        alert("Open up a comp first!")
    return
    };

    
    var layerSelection = currentComp.selectedLayers;

    if (layerSelection < 1) {
        alert("Select atleast 1 layer first!")
        return
    };



    function randomPos(scaleMax) {
        

        for (var i = 0; i < layerSelection.length; i++){
            var scaleRange = Math.random() * scaleMax;

            layerSelection[i].property("ADBE Transform Group").property("ADBE Scale").setValue([scaleRange, scaleRange])
        }

    };

    var userPrompt = prompt("Enter one value to randomly scale layers", 100);
    
    if (!userPrompt) {
        alert("Enter one value to randomly scale layers");
        return
    }
    
    app.beginUndoGroup("Start random scale")
    try {

        randomPos(userPrompt)
    } catch (e) {
        alert(e)
    } finally {
        app.endUndoGroup();
    }


})(this)