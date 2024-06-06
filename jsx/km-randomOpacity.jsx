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


    createUI(thisObj)

    function createUI(thisObj) {

        var win = thisObj instanceof Panel
            ? thisObj
            : new Window("window", scriptName, undefined, {
                resizeable: true
            })

        win.orientation = 'column';
        win.alignChildren = ["fill", "top"];


        var topRow = win.add("group", undefined, "top row");
        topRow.alignChildren = ["left", "top"];
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
        


                
        slider.onChanging = function () {
            app.beginUndoGroup("Start positioning")

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

            try {
                sliderValue.text = Math.floor(slider.value);
                randomOpacity(layerSelection ,minOpacityEdit.text, slider.value)

            } catch (e) {
                alert(e)
            } finally {
                app.endUndoGroup();
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

    }
    
    function randomOpacity(selectedLayers ,opacityMin, opacityMax) {


        for (var i = 0; i < selectedLayers.length; i++) {
            //  Math.floor(Math.random() * (max - min + 1)) + min;
            var opacityRange = Math.floor(Math.random() * (parseFloat(opacityMax) - parseFloat(opacityMin) + 1)) + parseFloat(opacityMin);

            selectedLayers[i].property("ADBE Transform Group").property("ADBE Opacity").setValue([opacityRange])
        }

    };


})(this)