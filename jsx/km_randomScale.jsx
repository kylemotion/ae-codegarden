/// a script to randomly scale layers in 2D and 3D space

(function km_randomScale(thisObj) {

    var scriptName = "km_randomScale";
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
        var minScaleStatic = topRow.add("statictext", undefined, "Min Scale: ");
        var minScaleEdit = topRow.add("edittext", undefined, "0");
        minScaleEdit.characters = editCharacters;

        var maxScaleStatic = topRow.add("statictext", undefined, "Max Scale: ");
        var maxScaleEdit = topRow.add("edittext", undefined, "100");
        maxScaleEdit.characters = editCharacters;

        var slider = win.add("slider", undefined, 100, 0, 100);
        slider.maxvalue = maxScaleEdit.text;
        
        var sliderValueGroup = win.add("group", undefined, "slider value group");
        sliderValueGroup.oreientation = 'row';
        sliderValueGroup.alignment = "center";
        var sliderValDescript = sliderValueGroup.add("statictext", undefined, "Max Scale: ");
        var sliderValue = sliderValueGroup.add("statictext", undefined, "");
        sliderValue.text = Math.floor(slider.value);

        
        maxScaleEdit.onChange = function () {
            slider.maxvalue = maxScaleEdit.text
            slider.value = parseFloat(maxScaleEdit.text);
        }

        slider.onChanging = function () {
            app.beginUndoGroup("Start positioning")
            try {

                var currentComp = app.project.activeItem;

                if (!(currentComp && currentComp instanceof CompItem)) {
                    alert("Open up a comp first!")
                    return
                };


                var layerSelection = currentComp.selectedLayers;

                if (layerSelection < 1) {
                    alert("Select atleast 1 layer first!")
                    return
                };


                sliderValue.text = Math.floor(slider.value);
                randomPos(layerSelection ,minScaleEdit.text, slider.value)

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
    function randomPos(selectedLayers,scaleMin, scaleMax) {


        for (var i = 0; i < selectedLayers.length; i++) {
            var scaleRange = Math.floor(Math.random() * (parseFloat(scaleMax) - parseFloat(scaleMin) + 1)) + parseFloat(scaleMin);

            var pos = selectedLayers[i].property("ADBE Transform Group").property("ADBE Scale");

            if (selectedLayers[i].threeDLayer == true) {
                pos.setValue([scaleRange, scaleRange, scaleRange])
            } else {
                pos.setValue([scaleRange, scaleRange])
            }
        }

    };


})(this)