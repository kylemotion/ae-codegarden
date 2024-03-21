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


        var xRow = win.add("group", undefined, "x row");
        xRow.alignChildren = ["left", "top"];
        var minXStatic = xRow.add("statictext", undefined, "Min X: ");
        var minXEdit = xRow.add("edittext", undefined, "0");
        minXEdit.characters = editCharacters;

        var maxXStatic = xRow.add("statictext", undefined, "Max X: ");
        var maxXEdit = xRow.add("edittext", undefined, "1920");
        maxXEdit.characters = editCharacters;

        var compWidthCheck = xRow.add("checkbox", undefined, "\u00A0Comp Width");
        compWidthCheck.value = false;

        compWidthCheck.onClick = function () { maxXEdit.text = currentComp.width }

        var myRow = win.add("group", undefined, "y row");
        myRow.alignChildren = ["left", "top"];
        var minYStatic = myRow.add("statictext", undefined, "Min Y: ");
        var minYEdit = myRow.add("edittext", undefined, "0");
        minYEdit.characters = editCharacters;

        var maxYStatic = myRow.add("statictext", undefined, "Max Y: ");
        var maxYEdit = myRow.add("edittext", undefined, "1080");
        maxYEdit.characters = editCharacters;
        var compHeightCheck = myRow.add("checkbox", undefined, "\u00A0Comp Height");
        compHeightCheck.value = false;
        compHeightCheck.onClick = function () { maxYEdit.text = currentComp.height };

        var zRow = win.add("group", undefined, "z row");
        zRow.orientation = 'row';
        zRow.alignChildren = ["left", "top"];
        var minZStatic = zRow.add("statictext", undefined, "Min Z:\u00A0");
        var minZEdit = zRow.add("edittext", undefined, "0");
        minZEdit.characters = editCharacters;
        var maxZStatic = zRow.add("statictext", undefined, "Max Z:\u00A0");
        var maxZEdit = zRow.add("edittext", undefined, "1000");
        maxZEdit.characters = editCharacters;
        var threeDCheckbox = zRow.add("checkbox", undefined, "\u00A03D Layer");

        var bottomRow = win.add("group", undefined, "bottom row");
        bottomRow.orientation = "row";
        bottomRow.alignChildren = ["left", "top"];
        var sepDimCheckbox = bottomRow.add("checkbox", undefined, "\u00A0Separate Dimensions");
        sepDimCheckbox.value = false;
        var camCheckbox = bottomRow.add("checkbox", undefined, "\u00A0Add Camera");


        var sliderRow = win.add("group", undefined, "slider row");
        sliderRow.alignChildren = ["left", "top"];
        var sliderStatic = sliderRow.add("statictext", undefined, "Position Randomizer Slider");
        sliderStatic.alignment = "center";
        var slider = sliderRow.add("slider", undefined, 0, 1, 2);
    
        
        
        slider.onChanging = function () {
            
            
            var currentComp = app.project.activeItem;
            
            var layerSelection = currentComp.selectedLayers;

        if (!(currentComp && currentComp instanceof CompItem)) {
            alert("Open up a comp first!")
            return
        };

        if (layerSelection < 1) {
            alert("Select atleast 1 layer first!")
            return
            };
                app.beginUndoGroup("Start positioning");
            try {
                adjustRandomPos(layerSelection, minXEdit.text, maxXEdit.text, minYEdit.text, maxYEdit.text, minZEdit.text, maxZEdit.text);
            } catch (e) {
                alert(e)
            } finally {
                app.endUndoGroup();
            }
        }

        threeDCheckbox.onClick = function () {
            

            var currentComp = app.project.activeItem;

            var layerSelection = currentComp.selectedLayers;

            if (!(currentComp && currentComp instanceof CompItem)) {
                alert("Open up a comp first!")
                return
            };

            if (layerSelection < 1) {
                alert("Select atleast 1 layer first!")
                return
            };

            app.beginUndoGroup("3D Layer");

            setThreeDLayer(layerSelection, threeDCheckbox.value);
            
            app.endUndoGroup()

        }


        sepDimCheckbox.onClick = function () {
            app.beginUndoGroup("separate dimensions");

            var currentComp = app.project.activeItem;

            var layerSelection = currentComp.selectedLayers;

            if (!(currentComp && currentComp instanceof CompItem)) {
                alert("Open up a comp first!")
                return
            };

            if (layerSelection < 1) {
                alert("Select atleast 1 layer first!")
                return
            };

            separateDimensions(layerSelection, sepDimCheckbox.value);
            app.endUndoGroup()
        }

        camCheckbox.onClick = function () {
            app.beginUndoGroup("add camera")

            var currentComp = app.project.activeItem;


            if (!(currentComp && currentComp instanceof CompItem)) {
                alert("Open up a comp first!")
                return
            };

            addNewCamera(currentComp, camCheckbox.value, maxZEdit.text) 
            app.endUndoGroup()
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





    }
    


})(this)




var proj = app.project;

function activeComp(){
    var activeComp = proj.activeItem;

if(activeComp instanceof CompItem){
    return activeComp
} else {
    alert("Select a Composition first")
    return
}
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


app.beginUndoGroup("Set3D");

setup3D(30)

app.endUndoGroup()

