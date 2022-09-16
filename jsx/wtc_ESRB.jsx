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


    createUI(thisObj);

    function createUI(thisObj) {

        var win = thisObj instanceof Panel
            ? thisObj
            : new Window("window", scriptName, undefined, {
                resizeable: true
            })

        win.orientation = 'column';
        win.alignChildren = ["fill", "top"];

        var durationRow = win.add("group", undefined, "duration row");
        durationRow.alignChildren = ["left", "top"];
        var durationButton = durationRow.add("button", undefined, "ESRB Duration");
        
        
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
        var activeComp = proj.activeItem;

        if (!(activeComp && activeComp instanceof CompItem)) {
            alert("Select or open your ESRB-EN comp first");
            return
        } else {
            return activeComp
        }

    }

    function esrbLayerDuration() {
        var activeComp = getCurrentCompInProj();

        var selLayers = activeComp.selectedLayers;

            if (selLayers.length == 1 && selLayers[0].source instanceof CompItem) {
                var esrbComp = selLayers[0];
            } else {
                alert("Select only 1 layer and make sure it's a precomp");
                return
            }
        
        esrbComp.timeRemapEnabled = true;
        var shortFormDur = 2;
        var longFormDur = 4;
        
        if (esrbComp.containingComp.duration < 15) {
            esrbComp.outPoint = esrbComp.inPoint + shortFormDur
        } else {
            esrbComp.outPoint = esrbComp.inPoint + longFormDur
        }

        return

    }


}) (this)