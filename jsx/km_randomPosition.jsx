/// a script to rnadomly position layers in 2D and 3D space

(function km_randomPosition(thisObj) {

    var scriptName = "km_randomPosition";
    var editCharacters = 5;

    var currentComp = app.project.activeItem;

    if (!(currentComp && currentComp instanceof CompItem)){
        alert("Open up a comp first!")
    return
    };

    
    var layerSelection = currentComp.selectedLayers;

    if (layerSelection < 1) {
        alert("Select atleast 1 layer first!")
        return
    };


    createUI(thisObj)

    function createUI(thisObj) {

        var win = thisObj instanceof Panel
            ? thisObj
            : new Window("window", scriptName, undefined, {
                resizeable: true
            })
    
        win.orientation = 'column';
        win.alignChildren = ["fill", "fill"];


        var xRow = win.add("group", undefined, "x row");
        xRow.alignChildren = ["fill", "fill"];
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
        myRow.alignChildren = ["fill", "fill"];
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
        zRow.alignChildren = ["fill", "fill"];
        var minZStatic = zRow.add("statictext", undefined, "Min Z:\u00A0");
        var minZEdit = zRow.add("edittext", undefined, "0");
        minZEdit.characters = editCharacters;
        var maxZStatic = zRow.add("statictext", undefined, "Max Z:\u00A0");
        var maxZEdit = zRow.add("edittext", undefined, "6000");
        maxZEdit.characters = editCharacters;
        var threeDCheckbox = zRow.add("checkbox", undefined, "\u00A03D Layer");

        var bottomRow = win.add("group", undefined, "bottom row");
        bottomRow.orientation = "row";
        bottomRow.alignChildren = ["fill", "fill"];
        var sepDimCheckbox = bottomRow.add("checkbox", undefined, "\u00A0Separate Dimensions");
        sepDimCheckbox.value = false;
        var camCheckbox = bottomRow.add("checkbox", undefined, "\u00A0Add Camera");


        var sliderRow = win.add("group", undefined, "slider row");
        sliderRow.alignChildren = ["fill", "fill"];
        var sliderStatic = sliderRow.add("statictext", undefined, "Position Randomizer Slider");
        sliderStatic.alignment = "center";
        var slider = sliderRow.add("slider", undefined, 0, 1, 2);
    


        slider.onChanging = function () {
            app.beginUndoGroup("Start positioning")

            try {
                adjustRandomPos(minXEdit.text, maxXEdit.text, minYEdit.text, maxYEdit.text, minZEdit.text, maxZEdit.text);
            } catch (e) {
                alert(e)
            } finally {
                app.endUndoGroup();
            }
        }

        threeDCheckbox.onClick = function () {
            app.beginUndoGroup("3D Layer");
            setThreeDLayer(threeDCheckbox.value);
            app.endUndoGroup()

        }


        sepDimCheckbox.onClick = function () {
            app.beginUndoGroup("separate dimensions");
            separateDimensions(sepDimCheckbox.value);
            app.endUndoGroup()
        }

        camCheckbox.onClick = function () {
            app.beginUndoGroup("add camera")
            win.close();
            addNewCamera(camCheckbox.value, maxZEdit.text) 
            app.endUndoGroup()
        }


        win.layout.layout();
        win.onResizing = function () {
            this.layout.resize()
        };

        win.show();
    
    }

    function separateDimensions(dimSeparated) {
        for (var i = 0; i < layerSelection.length; i++) {
            var pos = layerSelection[i].property("ADBE Transform Group").property("ADBE Position");
            if (dimSeparated == true) {
                pos.dimensionsSeparated = true;
            } else {
                pos.dimensionsSeparated = false;
            }
        }
        return layerSelection.length
    }

    function setThreeDLayer(threeDCheck) {
        for (var i = 0; i < layerSelection.length; i++) {
            
            if (threeDCheck == true) {
                layerSelection[i].threeDLayer = true;
            } else {
                layerSelection[i].threeDLayer = false;
            }
        }
        return layerSelection.length
    }


    function adjustRandomPos(xMin, xMax, yMin, yMax, zMin, zMax) {
        for (var i = 0; i < layerSelection.length; i++) {
            var xRange = Math.floor(Math.random() * (parseFloat(xMax) - parseFloat(xMin) + 1)) + parseFloat(xMin);
            var yRange = Math.floor(Math.random() * (parseFloat(yMax) - parseFloat(yMin) + 1)) + parseFloat(yMin);
            var zRange = Math.floor(Math.random() * (parseFloat(zMax) - parseFloat(zMin) + 1)) + parseFloat(zMin);

            var pos = layerSelection[i].property("ADBE Transform Group").property("ADBE Position");

            if (pos.dimensionsSeparated == true) {
                layerSelection[i].property("ADBE Transform Group").property("ADBE Position_0").setValue(xRange);
                layerSelection[i].property("ADBE Transform Group").property("ADBE Position_1").setValue(yRange);
            } else {
                pos.setValue([xRange, yRange])
            };

            if (layerSelection[i].threeDLayer == true && pos.dimensionsSeparated == true) {
                layerSelection[i].property("ADBE Transform Group").property("ADBE Position_0").setValue(xRange);
                layerSelection[i].property("ADBE Transform Group").property("ADBE Position_1").setValue(yRange);
                layerSelection[i].property("ADBE Transform Group").property("ADBE Position_3").setValue(zRange);
            } else {
                pos.setValue([xRange, yRange, zRange])
            } 

    }

    return layerSelection.length
    }


    function addNewCamera(camCheck, zMax) {
        if (camCheck == true) {
            var compLayers = currentComp.layers;
            var newCam = compLayers.addCamera("Cam", [960, 540]);
            newCam.property("ADBE Transform Group").property("ADBE Position").setValue([960, 540, -2666.7]);
            var camNull = compLayers.addNull();
            camNull.name = "Cam Null";
            var camPosition = camNull.property("ADBE Transform Group").property("ADBE Position");
            camNull.threeDLayer = true;
            camPosition.setValuesAtTimes([0, 5], [[0, 0, 0], [0, 0, parseFloat(zMax)]]);
            newCam.parent = camNull;

        }
    }
    


})(this)