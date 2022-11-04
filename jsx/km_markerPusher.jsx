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
            toLayers[n].marker.setValueAtTime(fromLayerMarkers.keyTime(i), newMarker)
        }
    }

    return markerArray

}

app.beginUndoGroup("Copy Markers");

    if(activeComp.selectedLayers.length < 2){
        alert("Please select atleast 2 layers first.\r\Select the layer with the markers to be copied first. Then select the layers you want to paste the markers to.")
    } else {
        copyLayerMarkers(activeComp.selectedLayers[0],activeComp.selectedLayers)
    }

app.endUndoGroup();





