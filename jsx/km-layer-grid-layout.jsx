/**
 * @description a script wiht a UI that will lay selected layers out in a grid in a composition in AE
 * @name km-layer-grid-layout
 * @author Kyle Harter <kylenmotion@gmail.com>
 * @version 1.0.0
 * 
 * @license This script is provided "as is," without warranty of any kind, expressed or implied. In
 * no event shall the author be held liable for any damages arising in any way from the use of this
 * script.
 * 
 * 
 * 6.29.2024
 * 
 * 
*/


(function(thisObj){
    
    var scriptName = "km-layer-grid-layout";

    createUI(thisObj)

    function createUI(thisObj){
        var win = thisObj instanceof Panel
        ? thisObj
        : new Window("window", scriptName, undefined, {
            resizeable: true
        })

    win.orientation = 'column';
    win.alignChildren = ["left", "top"];

    var main = win.add("panel", undefined);
    main.orientation = 'column';

    var columnsGroup = main.add("group", undefined, "Columns Group");
    columnsGroup.orientation = "column";
    columnsGroup.alignChildren = ["left", "top"];
    var columnStatic = columnsGroup.add("statictext", undefined, "# Columns");
    var columnText = columnsGroup.add("edittext", undefined, "5");
    columnText.characters = 20;

    var rowGroup = main.add("group", undefined, "Rows Group");
    rowGroup.orientation = "column";
    rowGroup.alignChildren = ["left", "top"];
    var rowStatic = rowGroup.add("statictext", undefined, "# Rows");
    var rowText = rowGroup.add("edittext", undefined, "4");
    rowText.characters = 20;

    var marginsGroup = main.add("group", undefined, "Margin Group");
    marginsGroup.orientation = "column";
    marginsGroup.alignChildren = ["left", "top"];
    var marginsStatic = marginsGroup.add("statictext", undefined, "Margins (pixels)");
    var marginsText = marginsGroup.add("edittext", undefined, "50");
    marginsText.characters = 20;

    var applyGroup = main.add("group", undefined, "Apply Group");
    applyGroup.orientation = 'row';
    var applyButton = applyGroup.add("button", undefined, "Apply");
    applyButton.preferredSize = [-1,30];
    applyButton.helpTip = "Click: Apply markers to selected layers.\rShift+Click: Apply markers to beginning of a comp."


    applyButton.onClick = function(){
    try {
        app.beginUndoGroup("What script does");

        var activeComp = app.project.activeItem;
        var numRows = Number(rowText.text);
        var numCols = Number(columnText.text);
        var marginAmt = Number(marginsText.text);

        if(!(activeComp && activeComp instanceof CompItem)){
            alert("Please open a comp first")
            return
        }

        var selLayers = getSelLayers(activeComp);

        if(selLayers.length < 1){
            alert("Please select atleast 1 layer in the comp before continuing");
            return
        }
        
        layoutLayers(selLayers, numRows, numCols, activeComp)

      } catch(error) {
        alert("An error occured on line: " + error.line + "\nError message: " + error.message);
      } finally {
        // this always runs no matter what
        app.endUndoGroup()
      }
      
    }

    
    function getSelLayers(comp){
        var selectedLayers = comp.selectedLayers;
        var selLayersArray = new Array();

        for(var i = 0; i< selectedLayers.length; i++){
            selLayersArray.push(selectedLayers[i])
        }

        return selLayersArray
        
    }


    function layoutLayers(layers, rows, cols, comp){
        var selLayers, numRows, numCols

        selLayers = layers;
        numRows = rows;
        numCols = cols;
        var gridWidth = comp.width * .8;
        var gridHeight = comp.height * .8;
        var marginX = (comp.width - gridWidth)/2;
        var marginY = (comp.height - gridHeight)/2;

        for(var i = 0; i< selLayers.length; i++){
            var layer = selLayers[i];
            var layerTransform = layer.property("ADBE Transform Group");
            var layerPosition = layerTransform.property("ADBE Position");
            var layerScale = layerTransform.property("ADBE Scale").value;
            
            var layerSize = layer.sourceRectAtTime(0, true);
            var layerWidth = layerSize.width * (layerScale[0]/100);
            var layerHeight = layerSize.height * (layerScale[1]/100);
            var col = i % numCols;
            var row = Math.floor(i/numCols);
            var posX = col * layerWidth + marginX;
            var posY = row * layerHeight + marginY;

            layerPosition.setValue([posX, posY, 0]);
            
        }

        return layers
    }





    win.onResizing = win.onResize = function (){
        this.layout.resize();
    };

    if(win instanceof Window){
        win.center();
        win.show();
    } else {
        win.layout.layout(true);
        win.layout.resize();
    }


    }

}(this))
