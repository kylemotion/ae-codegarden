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

        var botRow = win.add("group", undefined, "top row");
        botRow.alignChildren = ["fill", "fill"];
        var minYStatic = botRow.add("statictext", undefined, "Min Y: ");
        var minYEdit = botRow.add("edittext", undefined, "0");
        minYEdit.characters = editCharacters;

        var maxYStatic = botRow.add("statictext", undefined, "Max Y: ");
        var maxYEdit = botRow.add("edittext", undefined, "1080");
        maxYEdit.characters = editCharacters;
        

        var applyGroup = win.add("group", undefined, "run script");
        applyGroup.alignChildren = ["fill", "fill"]
        var runButton = applyGroup.add("button", undefined, "Run Me");

        runButton.onClick = function () {
            win.close()
            app.beginUndoGroup("Start positioning")
            try {

                // if (!minXEdit || !maxXEdit || !minYEdit || !maxYEdit) {
                //     alert("Enter a number in every text field, then try again")
                //     return
                // }

                randomPos(minXEdit.text, maxXEdit.text, minYEdit.text, maxYEdit.text)

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
    function randomPos(xMin,xMax,yMin,yMax) {
        

        for (var i = 0; i < layerSelection.length; i++){

            var diffX = parseInt(xMax) - parseInt(xMin);
            var rand = Math.random();
            var randX = Math.floor(rand * diffX);
            var xRange = randX + parseInt(xMin);

            var diffY = parseInt(yMax) - parseInt(yMin);
            var randY = Math.floor(rand * diffY);
            var yRange = randY + parseInt(yMin);



            layerSelection[i].property("ADBE Transform Group").property("ADBE Position").setValue([xRange, yRange])
        }

    };
    


})(this)