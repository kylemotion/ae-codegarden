var proj = app.project;

function getMoney(color, name, width, height, pixelAspect){
    for(var i = 1; i <proj.numitems; i++){
        /* if(proj.item(i) instanceof CompItem){
            proj.item(i).layers.addSolid(color,name, width, height, pixelAspect)
        } */
        alert("Fuck")
    }
}
function getMoneyYes(){
    alert(proj.numitems)
}
app.beginUndoGroup("Yolo");

getMoneyYes()

app.endUndoGroup()