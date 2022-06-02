/// a script to randomly scale layers in 2D and 3D space

(function km_randomScale(thisObj) {

    var scriptName = "km_randomScale";
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
                sliderValue.text = Math.floor(slider.value);
                randomPos(minScaleEdit.text, slider.value)

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
    function randomPos(scaleMin, scaleMax) {


        for (var i = 0; i < layerSelection.length; i++) {
            var scaleRange = Math.floor(Math.random() * (parseFloat(scaleMax) - parseFloat(scaleMin) + 1)) + parseFloat(scaleMin);

            var pos = layerSelection[i].property("ADBE Transform Group").property("ADBE Scale");

            if (layerSelection[i].threeDLayer == true) {
                pos.setValue([scaleRange, scaleRange, scaleRange])
            } else {
                pos.setValue([scaleRange, scaleRange])
            }
        }

    };


})(this)