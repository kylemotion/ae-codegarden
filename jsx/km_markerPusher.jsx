/**
 * 
 * a script to copy markers from one layer to another
 * 
 * 
 * 
 * 
*/

var proj = app.project;
var activeComp = proj.activeItem;

function copyLayerMarkers(fromLayer,toLayers){

    var markerArray = new Array();
    var newMarker;
    var fromLayerMarkers = fromLayer.marker;

    for(var i = 1; i<=fromLayerMarkers.numKeys; i++){
        var markerKeyVal = fromLayerMarkers.keyValue(i);
        newMarker = new MarkerValue(markerKeyVal.comment);
        newMarker.comment = markerKeyVal.comment;
        newMarker.cuePointName = markerKeyVal.cuePointName;
        newMarker.duration = markerKeyVal.duration;
        newMarker.eventCuePoint = markerKeyVal.eventCuePoint;
        newMarker.frameTarget = markerKeyVal.frameTarget;
        newMarker.url = markerKeyVal.url;
        newMarker.label = markerKeyVal.label;
        newMarker.protectedRegion = markerKeyVal.protectedRegion;
        for(var n = 0; n<activeComp.selectedLayers.length; n++){
            toLayers[n].marker.setValueAtTime(toLayers[n].inPoint + fromLayerMarkers.keyTime(i), newMarker)
        }
    }

    if(activeComp.selectedLayers.length < 2){
        alert("Please select atleast 2 layers first.\r\Select the layer with the markers to be copied first. Then select the layers you want to paste the markers to.")
        return
    } else {
        return
    }

}
function copyCompMarkers(fromComp,toComps){

    for(var b = 0; b < proj.selection.length; b++){

        if(!(proj.selection[b] instanceof CompItem)){
            alert("Make sure your selection in the project panel is a composition");
            return
        }

        // if(proj.selection.length < 2){
        //     alert("Please select atleast 2 comps first.\r\Select the comp with the markers to be copied first. Then select the comp you want to paste the markers to.")
        //     return
        // }
    

    var newMarker;
    var fromCompMarkers = fromComp.markerProperty;

    for(var i = 1; i<=fromCompMarkers.numKeys; i++){
        var markerKeyVal = fromCompMarkers.keyValue(i);
        newMarker = new MarkerValue(markerKeyVal.comment);
        newMarker.chapter = markerKeyVal.chapter;
        newMarker.comment = markerKeyVal.comment;
        newMarker.cuePointName = markerKeyVal.cuePointName;
        newMarker.duration = markerKeyVal.duration;
        newMarker.eventCuePoint = markerKeyVal.eventCuePoint;
        newMarker.frameTarget = markerKeyVal.frameTarget;
        newMarker.url = markerKeyVal.url;
        newMarker.label = markerKeyVal.label;
        newMarker.protectedRegion = markerKeyVal.protectedRegion;  
        toComps[b].markerProperty.setValueAtTime(fromCompMarkers.keyTime(i), newMarker)
        
    }

}
    return
        
}

app.beginUndoGroup("Copy Markers");


// copyLayerMarkers(activeComp.selectedLayers[0],activeComp.selectedLayers)
// copyCompMarkers(proj.selection[0],proj.selection)

// alert(proj.selection[1].name)

for(var b = 0; b < proj.selection.length; b++){
    alert(proj.selection[b].name)
}

app.endUndoGroup();





