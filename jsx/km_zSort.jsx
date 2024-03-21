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
        sortDistance.alignChildren = ["fill", "fill"];
        var zSortStatic = sortDistance.add("statictext", undefined, "Z Sort: ");
        var zSortEdit = sortDistance.add("edittext", undefined, "0");
        zSortEdit.characters = editCharacters;
    
        var sortGroup = win.add("group", undefined, "sort group");
        sortGroup.orientation = 'row';
        sortGroup.alignChildren = ["fill", "fill"];
        var sortButton = sortGroup.add("button", undefined, "Sort!");

 
        sortButton.onClick = function (){
            
            
            var currentComp = app.project.activeItem;

            if (!(currentComp && currentComp instanceof CompItem)) {
                alert("Open up a comp first!")
                return
            };

            if(isNaN(zSortEdit.text)){
                alert("Enter a number!")
                return
            }

            if (zSortEdit.text.text == "") {
                alert("Please enter a valid integer");
                return
            }

            win.close();
            app.beginUndoGroup("z sort")
            try{
                sort3D(parseInt(zSortEdit.text))
            } catch(e) {
                alert(e)
            } finally {
                app.endUndoGroup()
            }
            
            
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
        




function selLayer(){
    var layerSelection = app.project.activeItem.selectedLayers;
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


function sort3D(z){
    var layerRange = selLayer();
var userInput = z;
    for(var n = 0; n<layerRange.length; n++){
        layerRange[n].threeDLayer = true;
        layerRange[n].property("ADBE Transform Group").property("ADBE Position").setValue([value[0],value[1],userInput * n]);
        
    }
    
    return
}



} 

})(this)






