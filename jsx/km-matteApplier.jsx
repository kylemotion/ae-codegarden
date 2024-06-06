
var proj = app.project;

function activeComp(){
    var activeComp = proj.activeItem;

    if(activeComp instanceof CompItem){
        return activeComp
    } else {
        return
    }

}
function getLayerSelection(){
    var layerSelection = activeComp().selectedLayers;

    if(layerSelection.length < 1){
        return alert("Select more than one layer!")
    } else {
        return layerSelection
    }
}

function toMatte(){
    var matteLayer = getLayerSelection();

    for(var i = 1; i < matteLayer.length; i++){
        matteLayer[i].setTrackMatte(getLayerSelection()[0], TrackMatteType.ALPHA)
    }

    getLayerSelection()[0].enabled = true

}


app.beginUndoGroup("FUCK");

toMatte()

app.endUndoGroup()