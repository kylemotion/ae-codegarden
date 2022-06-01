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



    function randomPos(x,y) {
        

        for (var i = 0; i < layerSelection.length; i++){
            var xRange = Math.random() * x;
            var yRange = Math.random() * y;

            layerSelection[i].property("ADBE Transform Group").property("ADBE Position").setValue([xRange, yRange])
        }

    };

    var userPrompt = prompt("Enter two values separated by a comma to randomly position layers", [1920, 1080]);
    
    if (!userPrompt) {
        alert("Enter two values separated by a comma to randomly position layers");
        return
    }
    
    app.beginUndoGroup("Start positioning")
    try {

        randomPos(1920, 1080)
    } catch (e) {
        alert(e)
    } finally {
        app.endUndoGroup();
    }


})(this)