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


        var topRow = win.add("group", undefined, "top row");
        topRow.alignChildren = ["fill", "fill"];
        var minXStatic = topRow.add("statictext", undefined, "Min X: ");
        var minXEdit = topRow.add("edittext", undefined, "0");
        minXEdit.characters = editCharacters;

        var maxXStatic = topRow.add("statictext", undefined, "Max X: ");
        var maxXEdit = topRow.add("edittext", undefined, "1920");
        maxXEdit.characters = editCharacters;

        var compWidthCheck = topRow.add("checkbox", undefined, "\u00A0Comp Width");
        compWidthCheck.value = false;

        compWidthCheck.onClick = function () { maxXEdit.text = currentComp.width }

        var botRow = win.add("group", undefined, "top row");
        botRow.alignChildren = ["fill", "fill"];
        var minYStatic = botRow.add("statictext", undefined, "Min Y: ");
        var minYEdit = botRow.add("edittext", undefined, "0");
        minYEdit.characters = editCharacters;

        var maxYStatic = botRow.add("statictext", undefined, "Max Y: ");
        var maxYEdit = botRow.add("edittext", undefined, "1080");
        maxYEdit.characters = editCharacters;
        var compHeightCheck = botRow.add("checkbox", undefined, "\u00A0Comp Height");
        compHeightCheck.value = false;

        compHeightCheck.onClick = function () { maxYEdit.text = currentComp.height };


        // var slider = win.add("slider", undefined, 0, 0, 1);
    

        var applyGroup = win.add("group", undefined, "run script");
        applyGroup.alignChildren = ["fill", "fill"]
        var runButton = applyGroup.add("button", undefined, "Run Me");


        // slider.onChanging = function () {
        //     app.beginUndoGroup("Start positioning")
        //     try {
                
        //         for (var i = 0; i < layerSelection.length; i++) {
        //             Math.random() * layerSelection[i].property("ADBE Transform Group").property("ADBE Position")
        //         }

        //     } catch (e) {
        //         alert(e)
        //     } finally {
        //         app.endUndoGroup();
        //     }
        // }
        


        runButton.onClick = function () {
            win.close()
            app.beginUndoGroup("Start positioning")
            try {

                setRandomPos(minXEdit.text, maxXEdit.text, minYEdit.text, maxYEdit.text);

            } catch (e) {
                alert(e)
            } finally {
                app.endUndoGroup();
            }
        }


        win.layout.layout();
        win.onResizing = function () {
            this.layout.resize()
        };

        win.show();
    
    }

    function setRandomPos(xMin,xMax,yMin,yMax) {
        

        for (var i = 0; i < layerSelection.length; i++){
                        //  Math.floor(Math.random() * (max - min + 1)) + min;
            var xRange = Math.floor(Math.random()*(parseFloat(xMax) - parseFloat(xMin) + 1)) + parseFloat(xMin);
            var yRange = Math.floor(Math.random() * (parseFloat(yMax) - parseFloat(yMin) + 1)) + parseFloat(yMin);

            layerSelection[i].property("ADBE Transform Group").property("ADBE Position").setValue([xRange, yRange])
        }

    };


    function adjustRandomPos() {
        for (var i = 0; i < layerSelection.length; i++) {

            Math.random() * layerSelection[i].property("ADBE Transform Group").property("ADBE Position")
        }

    }
    


})(this)