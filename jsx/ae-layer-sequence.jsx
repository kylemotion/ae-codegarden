/**
 * @description A script that will name selected layers with iteration and then sort them in ascending or descending order in the composition in AE. 
 * @name ae-layer-namer-sort
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
**/


(function ae_layerNameSort(thisObj) {

    createUI(thisObj);

    var scriptName = "ae-layer-namer-sort";

    function createUI(thisObj) {
        var win = thisObj instanceof Panel
            ? thisObj
            : new Window("palette", "ae-layer-namer-sort" , undefined, {
                resizeable: true
            })

        win.orientation = "column";
        win.alignChildren = ["fill", "top"];

        var mainPanel = win.add("panel", undefined, scriptName);
        mainPanel.orientation = "column";
        mainPanel.alignChildren = ["fill", "top"];
        var layerNameEditGroup = mainPanel.add("group", undefined, "Layer Name Group");
        layerNameEditGroup.orientation = "column";
        layerNameEditGroup.alignChildren = "left";
        var layerNameStatic = layerNameEditGroup.add("statictext", undefined, "Layer Name:");
        var layerNameEdit = layerNameEditGroup.add("edittext", undefined, "Enter custom layer name");
        layerNameEdit.characters = 20;
        var separatorGroup = mainPanel.add("group", undefined, "Separator Group");
        separatorGroup.orientation = "column";
        separatorGroup.alignChildren = "left";
        var separatorStatic = separatorGroup.add("statictext", undefined, "Separator:")
        var separatorEdit = separatorGroup.add("edittext", undefined, "-")
        separatorEdit.characters = 20;

        var utilitiesGroup = mainPanel.add("group", undefined);
        utilitiesGroup.orientation = "column";
        utilitiesGroup.alignChildren = "left";
        var startNumberStatic = utilitiesGroup.add("statictext", undefined, "Start Number:");
        var startNumberEdit = utilitiesGroup.add("edittext", undefined, "1");
        startNumberEdit.characters = 20;

        // var orderGroup = mainPanel.add("group", undefined, "order sort");
        // orderGroup.orientation = "column";
        // orderGroup.alignChildren = ["fill", "top"];

        // var orderDropdownStatic = orderGroup.add("statictext", undefined, "Sort Order:");
        // var orderDropdown = orderGroup.add("dropdownlist", undefined, ["Ascending", "Descending"]);
        // orderDropdown.size = [100,25];
        // orderDropdown.selection = "Ascending";

        var buttonGroup = win.add("group", undefined, "buttons");
        buttonGroup.orientation = 'row';
        buttonGroup.alignChildren = ["center", "top"];

        var helpButton = buttonGroup.add("button", undefined, "?");
        helpButton.size = [25,25];

        var runScriptButton = buttonGroup.add("button", undefined, "Run Script");
        runScriptButton.size = [100, 25];

        helpButton.onClick = function(){
            alert("How to use ae-layer-namer-sort:\r\
                1.Fill in information in text fields.\r\
                2. Click Run Script button!")
        }

        
        runScriptButton.onClick = function () {
            app.beginUndoGroup("rename")

            try{

            var activeComp = app.project.activeItem;

            if (!(activeComp && activeComp instanceof CompItem)) {
                alert("Please open up a comp first!")
                return
            }


            var selectedLayers = getLayerSel(activeComp);

            if (selectedLayers.length < 1) {
                alert("Please select atleast 1 layer first!")
                return
            }
            
            var layerRename = renameLayers(selectedLayers,layerNameEdit.text, separatorEdit.text,startNumberEdit.text);
            var sortedLayers = sortLayers(layerRename);


             orderLayersInComp(layerRename,sortedLayers,activeComp)
        }catch(error){
            alert("An error occured on line: " + error.line + "\nError message: " + error.message);
        } finally {
        }
        
        app.endUndoGroup()
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
    
    

    function getLayerSel(comp){
        var selLayers = comp.selectedLayers;
        var selLayersArray = new Array();

        for(var i = 0; i< selLayers.length; i++){
            selLayersArray.push(selLayers[i])
        }


        return selLayersArray
    }




    function renameLayers(selectedLayers,layerNames, separator, startNum) {

        for (var i = 0; i < selectedLayers.length; i++) {
            var count = i + 1;
            var startNumCount = Number(startNum) + i;
                if(!startNum || isNaN(startNum)){
                    selectedLayers[i].name = layerNames + separator + count
                } else {
                    selectedLayers[i].name = layerNames + separator + startNumCount
                }
        }

        return selectedLayers
    }

    function sortLayers(layers){
        return layers.slice().sort(function(a,b){
          return a.name-b.name
        })
      }


    function orderLayersInComp(selLayers,layersArray,comp){
        var origSelLayers = selLayers.reverse();
        var layerIndices = layersArray;
        
        for(var i = 1; i<layerIndices.length; i++){
          var layer = origSelLayers[i];
            if(i==0){
              // alert(layer.name)
              // Move the first layer to it's new position
              layer.moveBefore(comp.layer(origSelLayers[origSelLayers.length-1]))
            } else{
              // alert(layer.name)
              // move the rest of the layers
              layer.moveAfter(origSelLayers[i-1])
            }
        }
  
        return 
      }


}(this))