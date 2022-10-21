var proj = app.project;
var comp = proj.activeItem;

function getLayerSelection(){
    var layerSelection = comp.selectedLayers;

    if(layerSelection.length < 1){
        return alert("Select more than one layer")
    } else {
        return layerSelection
    }
}


function sequenceLayers(){
    var compDur = comp.duration;
    var layerArray = getLayerSelection();
    var layerDur = compDur/layerArray.length;

    

    for(var i = 0; i < layerArray.length; i++){
        layerArray[i].inPoint = i * layerDur;
        layerArray[i].outPoint = layerArray[i].inPoint + layerDur;
    }

    return
}

app.beginUndoGroup("layer sequencer");

sequenceLayers()

app.endUndoGroup();

