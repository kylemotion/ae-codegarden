/**
 * 
 * a script to apply random opacity to selected layers
 * 
 * 
 * 
 * 
*/

(function km_randomOpacity(thisObj) {

    var scriptName = "km_randomOpacity";
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
        var minOpacityStatic = topRow.add("statictext", undefined, "Min Opacity: ");
        var minOpacityEdit = topRow.add("edittext", undefined, "0");
        minOpacityEdit.characters = editCharacters;



        var maxOpacityStatic = topRow.add("statictext", undefined, "Max Opacity: ");
        var maxOpacityEdit = topRow.add("edittext", undefined, "100");
        maxOpacityEdit.characters = editCharacters;

        var slider = win.add("slider", undefined, 100, 0, 100);
        

        var sliderValueGroup = win.add("group", undefined, "slider value group");
        sliderValueGroup.oreientation = 'row';
        sliderValueGroup.alignment = "center";
        var sliderValDescript = sliderValueGroup.add("statictext", undefined, "Max Opacity: ");
        var sliderValue = sliderValueGroup.add("statictext", undefined, "");
        sliderValue.text = Math.floor(slider.value);
        
        
        var applyGroup = win.add("group", undefined, "run script");
        applyGroup.alignChildren = ["fill", "fill"]
        var runButton = applyGroup.add("button", undefined, "Run Me");



        slider.onChanging = function () {
            app.beginUndoGroup("Start positioning")
            try {
                sliderValue.text = Math.floor(slider.value);
                randomPos(minOpacityEdit.text, slider.value)

            } catch (e) {
                alert(e)
            } finally {
                app.endUndoGroup();
            }
        }


        runButton.onClick = function () {
            win.close()
            app.beginUndoGroup("Start positioning")
            try {

                randomPos(minOpacityEdit.text, maxOpacityEdit.text)

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
    
    function randomPos(opacityMin, opacityMax) {


        for (var i = 0; i < layerSelection.length; i++) {
            //  Math.floor(Math.random() * (max - min + 1)) + min;
            var opacityRange = Math.floor(Math.random() * (parseFloat(opacityMax) - parseFloat(opacityMin) + 1)) + parseFloat(opacityMin);

            layerSelection[i].property("ADBE Transform Group").property("ADBE Opacity").setValue([opacityRange])
        }

    };


})(this)