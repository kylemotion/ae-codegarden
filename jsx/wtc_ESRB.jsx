/**
 * 
 * a script to change length of ESRB comps and setup esrb comps with essential properties
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

        var dropdownRow = win.add("panel", undefined, "Setup ESRB Controls");
        dropdownRow.alignChildren = ["fill", "fill"];
        var dropdownButton = dropdownRow.add("button", undefined, "Setup Dropdown Controls")


        var durationRow = win.add("panel", undefined, "Change duration ESRB Comp");
        durationRow.alignChildren = ["fill", "fill"];
        var durationButton = durationRow.add("button", undefined, "ESRB Duration");

        var helpGroup = win.add("group", undefined, "Help Me Button");
        helpGroup.alignChildren = ["right", "fill"];
        var helpButton = helpGroup.add("button", undefined, "How do I work?");
        

        
        
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

        helpButton.onClick = function (){
            alert(helpMeDirections())
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
        var timeRemap = esrbComp.property("Time Remap");
        
        if (esrbComp.containingComp.duration <= 15) {
            esrbComp.outPoint = esrbComp.inPoint + shortFormDur
        } else {
            esrbComp.outPoint = esrbComp.inPoint + longFormDur
        }
        
        timeRemap.setValueAtTime(esrbComp.inPoint, 0);
        timeRemap.removeKey(2)
        timeRemap.setInterpolationTypeAtKey(1, KeyframeInterpolationType.HOLD);

        return

    }

    function helpMeDirections(){
        var helpMeText = 
        'How do I work?\r1. Setup ESRB Controls\r\r- Place your ESRB logos in a new comp. Make sure the comp is set to 4 seconds.\r- Select your ESRB logos inside of the comp from Top > Down.\r- Click Setup Dropdown Controls Button.\r-Boom! Your controls are now setup on your control layer and in your essential graphics panel.\r\r\
        2. ESRB Duration\r\r- Select your ESRB precomp layer that is located in your parent comp.\r- Press ESRB Duration button.\r- Boom! Your precomp layer will automatically adjust its duration based on the parent comp duration.\r\r\
        You are also free to use the Essential Properties on the outside of the ESRB precomp to select your preferred ESRB logo.'

        return helpMeText


    }


}) (this)