var proj = app.project;

function getCurrentComp() {
    var activeComp = proj.activeItem;

    if (!(activeComp && activeComp instanceof CompItem)) {
        alert("Open up a comp first")
        return
    } else {
        return activeComp
    }

}


function getImageSelection() {
    var imageArray = new Array();

    if (proj.selection.length < 1) {
        alert("Select atleast 1 image first");
        return
    } else {
        for (var i = 0; i < proj.selection.length; i++) {
            imageArray.push(proj.selection[i])
        }

        return imageArray
    }

}


function addImagesToComp() {
    var activeComp = getCurrentComp();
    var imageSelection = getImageSelection();


    for (var n = 0; n < imageSelection.length; n++){
        var addedImages = activeComp.layers.add(imageSelection[n]);

        var layerSize = addedImages.sourceRectAtTime(addedImages.containingComp.time, true);
        var transProp = addedImages.property("ADBE Transform Group");
        var imageWidth = layerSize.width;
        var imageHeight = layerSize.height;
        var imageScale = transProp.property("ADBE Scale");
        var smallerDifference = activeComp.height - imageHeight;
        var largerDifference = imageHeight - activeComp.height;

        if (imageHeight < activeComp.height) {
            var smallerConversion = ((smallerDifference * 100) / imageHeight);
            var finalConversion = [0, 100 + smallerConversion, 0];
        } else if (imageHeight > activeComp.height) {
            var largerConversion = ((largerDifference * 100) / imageHeight);
            var finalConversion = [0, 100 - largerConversion, 0];
        } else {
            var finalConversion = [100, 100, 100];
        }
        
        imageScale.setValue([finalConversion[1], finalConversion[1], finalConversion[1]]);

        var rangeDuration = activeComp.duration;  

        var imageDuration = rangeDuration / imageSelection.length;

        addedImages.inPoint = (n) * imageDuration;
        addedImages.outPoint = addedImages.inPoint + imageDuration;


    }


}


app.beginUndoGroup("Image Sequencer & Scaler");

addImagesToComp()

app.endUndoGroup()