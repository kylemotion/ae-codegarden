var proj = app.project;

function getMoney(color, name, width, height, pixelAspect){
    for(var i = 0; i < proj.selection.length; i++){
        if(proj.selection[i] instanceof CompItem){
            proj.selection[i].layers.addSolid(color,name, width, height, pixelAspect)
            
        }
    }
}

app.beginUndoGroup("Yolo");

getMoney([1.0,.6,.3], "Yella", 1920, 1080, 1.0)
// alert(proj.selection.length)

app.endUndoGroup()