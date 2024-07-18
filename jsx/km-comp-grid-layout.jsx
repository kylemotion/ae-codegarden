/**
 * @description a script wiht a UI that will lay selected project items out in a grid in a new composition in AE
 * @name km-comp-grid-layout
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
    
    var scriptName = "km-comp-grid-layout";

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
    main.alignChildren = 'left';

    var itemsSelGroup = main.add("group", undefined, "Columns Group");
    itemsSelGroup.orientation = "row";
    itemsSelGroup.alignChildren = ["left", "top"];
    var itemsStatic = itemsSelGroup.add("statictext", undefined, "Items Selected: ");
    var itemsSelected = itemsSelGroup.add("statictext", undefined, "");


    var rowGroup = main.add("group", undefined, "Rows Group");
    rowGroup.orientation = "row";
    rowGroup.alignChildren = ["left", "top"];
    var rowStatic = rowGroup.add("statictext", undefined, "Items In Rows");
    var rowText = rowGroup.add("edittext", undefined, "3");
    rowText.characters = 5;

    var columnItems = main.add("group", undefined, "Column Items Group");
    columnItems.orientation = "row";
    columnItems.alignChildren = ["left", "top"];
    var columnItemsStatic = columnItems.add("statictext", undefined, "Items In Columns: ");
    var columnItemsAmount = columnItems.add("statictext", undefined, "");


    var freezeGroup = main.add("group", undefined, "Freeze Frame Group");
    freezeGroup.orientation = "row";
    freezeGroup.alignChildren = ["left", "top"];
    var freezeFrameStatic = freezeGroup.add("statictext", undefined, "Freeze Frame Comps: ");
    var freezeFrameAmount = freezeGroup.add("checkbox", undefined);
    freezeFrameAmount.value = false;

    // var marginsGroup = main.add("group", undefined, "Margin Group");
    // marginsGroup.orientation = "column";
    // marginsGroup.alignChildren = ["left", "top"];
    // var marginsStatic = marginsGroup.add("statictext", undefined, "Margins (pixels)");
    // var marginsText = marginsGroup.add("edittext", undefined, "50");
    // marginsText.characters = 20;

    var applyGroup = main.add("group", undefined, "Apply Group");
    applyGroup.orientation = 'row';
    var applyButton = applyGroup.add("button", undefined, "Apply");
    applyButton.preferredSize = [-1,30];
    applyButton.helpTip = "Click: Create comp and layout items in grid."


    var proj = app.project;

    if(!(proj)){
        alert("Whoops! You don't have a project open. Be sure to open up a project or create a new one before moving forward");
        return
    }    

    var selItems = getSelItems(proj);

    if(selItems.length < 1){
        alert("Select items in your project panel first.");
        return
    }
    
    itemsSelected.text = selItems.length.toString();

    columnItemsAmount.text = rowText.text;

    applyButton.onClick = function(){
    try {
        app.beginUndoGroup("What script does");

        /* var activeComp = app.project.activeItem;
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
        
        layoutLayers(selLayers, numRows, numCols, activeComp) */

        createComp(proj, selItems)

      } catch(error) {
        alert("An error occured on line: " + error.line + "\nError message: " + error.message);
      } finally {
        // this always runs no matter what
        app.endUndoGroup()
      }
      
    }

    
    function getSelItems(proj){
        var projItems = proj.selection;
        var selItemsArray = new Array();

        for(var i = 0; i< projItems.length; i++){
            selItemsArray.push(proj.item[i])
            
        }

        return selItemsArray
        
    }

//// Need to get Item Info next
    function getItemInfo(selItems){
        var selItemArray = selItems;
        var itemSizeArray = new Array();

        for(var i = 0; i<selItemArray.length; i++){

        }

        return
    }


    function createComp(proj, selItems){
        var itemAttributes = selItems[0];
        var newComp = proj.items.addComp("Storyboard Comp", itemAttributes.width, itemAttributes.height, itemAttributes.pixelAspect, itemAttributes.duration, itemAttributes.frameDuration)
        

        return newComp
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
            var posX = col * layerWidth*2 + marginX;
            var posY = row * layerHeight*2 + marginY;

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
