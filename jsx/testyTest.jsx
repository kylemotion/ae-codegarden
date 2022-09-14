var currentComp = app.project.activeItem;

function getMoney(color, name, width, height, pixelAspect){
    for(var i = 0; i < proj.selection.length; i++){
        if(proj.selection[i] instanceof CompItem){
            proj.selection[i].layers.addSolid(color,name, width, height, pixelAspect)
            
        }
    }
}


function getComp() {
    if (!(currentComp && currentComp instanceof CompItem)) {
        alert("Open up a comp first")
        return
    } else {
        return currentComp
    }
}

function textAdd() {
    var activeComp = getComp();

    var newNull = activeComp.layers.addNull();
    newNull.name = "Fuck Me";
    newNull.threeDLayer = true;
    var distanceSlider = newNull.property("ADBE Effect Parade").addProperty("Slider Control");
    distanceSlider.name = "fuckin Distance mate";


    var newCam = activeComp.layers.addCamera("Double Fuck", [960, 540]);
    newCam.parent = newNull;
    
    for (var i = 1; i <= 10; i++){
        var newText = activeComp.layers.addText("Fack");
        newText.name = "fuck-" + i;
        newText.threeDLayer = true;
        var text3DPos = newText.property("ADBE Transform Group").property("ADBE Position");

        text3DPos.expression = 'var distanceSlider = thisComp.layer("Fuck Me").effect("fuckin Distance mate")(1);\
        [960, 540, distanceSlider * '+i+']';
    }
    newCam.moveToBeginning();
    newNull.moveToBeginning();

    return

}

app.beginUndoGroup("Yolo");

textAdd()

app.endUndoGroup()