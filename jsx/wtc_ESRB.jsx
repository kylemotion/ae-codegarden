/**
 * 
 * a script to change length of ESRB comps
 * 
 * 
 * 
 * 
*/

(function wtc_ESRB(thisObj) {

    var scriptName = "wtc_ESRB";
    var proj = app.project;
    var activeComp = proj.activeItem;

    createUI(thisObj);

    function createUI(thisObj) {

        var win = thisObj instanceof Panel
            ? thisObj
            : new Window("window", scriptName, undefined, {
                resizeable: true
            })

        win.orientation = 'column';
        win.alignChildren = ["fill", "top"];

        var dropdownRow = win.add("group", undefined, "dropdown layers");
        dropdownRow.alignChildren = ["fill", "fill"];
        var dropdownButton = dropdownRow.add("button", undefined, "Setup Dropdown Controls")


        var durationRow = win.add("group", undefined, "duration row");
        durationRow.alignChildren = ["fill", "fill"];
        var durationButton = durationRow.add("button", undefined, "ESRB Duration");
        
        
        dropdownButton.onClick = function(){
            app.beginUndoGroup("Dropdown Button");
                createControlsLayer()
            app.endUndoGroup()
        }

        durationButton.onClick = function () {
            app.beginUndoGroup("Duration Button");
                esrbLayerDuration()
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

    };

    function getCurrentCompInProj() {
        

        if (!(activeComp && activeComp instanceof CompItem)) {
            alert("Select or open your ESRB-EN comp first");
            return
        } else {
            return activeComp
        }

    }

    function getCurrentLayers(){
        var compLayerSelection = activeComp.selectedLayers;
        if(compLayerSelection.length < 1){
            alert("Select atleast 1 layer first. Try again")
            return
        } else {
            return compLayerSelection
        }
    }

    function createControlsLayer(){
        var compLayers = activeComp.layers;
        var layerSelection = getCurrentLayers();
        var layerSelNames = new Array();

        for(var i = 0; i<layerSelection.length;i++){
            layerSelNames.push(layerSelection[i].name);
        }


        if(!(activeComp.layer("Controls"))){
            var controlsLayer = activeComp.layers.addShape();
            controlsLayer.name = "Controls";
        } else {
            var controlsLayer = activeComp.layer("Controls") 
        }

        var controlsDropdown = controlsLayer.property("ADBE Effect Parade").addProperty("ADBE Dropdown Control");
        var controlsMenu = controlsDropdown.property(1);
        
        controlsDropdown.property(1).addToMotionGraphicsTemplateAs(activeComp, "ESRB Selection");
        controlsMenu.setPropertyParameters(layerSelNames);

        for(var n = 0; n<layerSelection.length; n++){
            var layerOpacity = layerSelection[n].property("ADBE Transform Group").property("ADBE Opacity");
            layerOpacity.expression = 'id = thisLayer.index - 1;\
            layerSel = thisComp.layer("Controls").effect(1)(1);\
            id == layerSel ? 100 : 0';
            
        }

        return
    }



    function esrbLayerDuration() {

        var selLayers = getCurrentCompInProj().selectedLayers;

            if (selLayers.length == 1 && selLayers[0].source instanceof CompItem) {
                var esrbComp = selLayers[0];
            } else {
                alert("Select only 1 layer and make sure it's a precomp");
                return
            }
        
        esrbComp.timeRemapEnabled = true;
        var shortFormDur = 2;
        var longFormDur = 4;
        
        if (esrbComp.containingComp.duration <= 15) {
            esrbComp.outPoint = esrbComp.inPoint + shortFormDur
        } else {
            esrbComp.outPoint = esrbComp.inPoint + longFormDur
        }

        return

    }

}) (this)