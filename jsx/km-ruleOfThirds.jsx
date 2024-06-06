
var proj = app.project;

function activeComp(){
    var activeComp = proj.activeItem;

    if(activeComp instanceof CompItem){
        return activeComp
    } else {
        alert("Select a comp first!")
        return
    }
}

function compGuides(){
    var compWidth = activeComp().width;
    var compHeight = activeComp().height;
    
    for(var i = 1; i <= 2; i++){
        activeComp().addGuide(0, [(compHeight/3)*i]);
        activeComp().addGuide(1, [(compWidth/3)*i]);

    }

    return activeComp()
}

app.beginUndoGroup("rule of thirds");

if(app.project.activeItem instanceof CompItem){
    compGuides()
} else {
    alert("Select a comp first!")
}


app.endUndoGroup()