(function km_zSort(thisObj) {

    var scriptName = "km_zSort";
    var editCharacters = 5;

   
    createUI(thisObj)

    function createUI(thisObj) {

        var win = thisObj instanceof Panel
            ? thisObj
            : new Window("window", scriptName, undefined, {
                resizeable: true
            })
    
        win.orientation = 'column';
        win.alignChildren = ["left", "top"];


        var sortDistance = win.add("group", undefined, "Z Sort");
        sortDistance.alignChildren = ["left", "top"];
        var zSortStatic = sortDistance.add("statictext", undefined, "Z Sort: ");
        var zSortEdit = sortDistance.add("edittext", undefined, "0");
        zSortEdit.characters = editCharacters;
    


 var proj = app.project;

function activeComp(){
    var currentComp = proj.activeItem;

    if (!(currentComp && currentComp instanceof CompItem)) {
        alert("Open up a comp first!")
        return
    };
}

function selLayer(){
    var curComp = activeComp();
    var layerSelection = curComp.selectedLayers;

    var layerArray = new Array();


    for(var i = 0; i< layerSelection.length; i++){
        layerArray.push(layerSelection[i])
    }


        if(layerSelection.length < 1){
            alert("Select atleast one layer")
            return 
        } else {
            return layerArray
        }

   
}


function setup3D(zDepth){
    var layerRange = selLayer();


    for(var n = 0; n<layerRange.length; n++){
        layerRange[n].threeDLayer = true;
        layerRange[n].property("ADBE Transform Group").property("ADBE Position").setValue([960,540,zDepth*n]);
        
    }
    return layerRange
}
        win.onResizing = win.onResize = function () {
            this.layout.resize();
        };

        if (win instanceof Window) {
            win.center();
            win.show();
        } else {
            win.layout.layout(true);
            win.layout.resize();
        }
    
    }







})(this)






