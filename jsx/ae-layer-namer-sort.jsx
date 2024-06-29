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


(function km_layerRenamer(thisObj) {

   

    createUI(thisObj);

    var scriptName = 'ae-layer-namer-sort';

    function createUI(thisObj) {
        var win = thisObj instanceof Panel
            ? thisObj
            : new Window("palette", scriptName , undefined, {
                resizeable: true
            })

        win.orientation = "column";
        win.alignChildren = ["fill", "top"];

        var layerNameSepPanel = win.add("panel", undefined);
        layerNameSepPanel.orientation = "column";
        layerNameSepPanel.alignChildren = ["fill", "top"];
        var layerNameEditGroup = layerNameSepPanel.add("group", undefined, "Layer Name Group");
        layerNameEditGroup.orientation = "column";
        layerNameEditGroup.alignChildren = "left";
        var layerNameStatic = layerNameEditGroup.add("statictext", undefined, "Layer Name");
        var layerNameEdit = layerNameEditGroup.add("edittext", undefined, "Enter custom layer name");
        layerNameEdit.characters = 20;
        var separatorGroup = layerNameSepPanel.add("group", undefined, "Separator Group");
        separatorGroup.orientation = "column";
        separatorGroup.alignChildren = "left";
        var separatorStatic = separatorGroup.add("statictext", undefined, "Separator")
        var separatorEdit = separatorGroup.add("edittext", undefined, "-")
        separatorEdit.characters = 20;

        var utilitiesGroup = layerNameSepPanel.add("group", undefined);
        utilitiesGroup.orientation = "column";
        utilitiesGroup.alignChildren = "left";
        var startNumberStatic = utilitiesGroup.add("statictext", undefined, "Start Number");
        var startNumberEdit = utilitiesGroup.add("edittext", undefined, "Enter start number");
        startNumberEdit.characters = 20;
        var overrideGroup = layerNameSepPanel.add("group", undefined);
        overrideGroup.orientation = "row";
        overrideGroup.alignChildren = "left";
        var overrideStaticText = overrideGroup.add("statictext", undefined, "Iteration override")
        var iterateOverrideCheckbox = overrideGroup.add("checkbox", undefined)


        var buttonGroup = win.add("group", undefined, "buttons");
        buttonGroup.orientation = 'row';
        buttonGroup.alignChildren = ["fill", "top"];

        var renameButton = buttonGroup.add("button", undefined, "Rename");
        renameButton.size = [100, 25]

        
        renameButton.onClick = function () {
            app.beginUndoGroup("rename")

            try{

            var activeComp = app.project.activeItem;

            if (!(activeComp && activeComp instanceof CompItem)) {
                alert("Please open up a comp first!")
                return
            }
            var selectedLayers = activeComp.selectedLayers;

            if (selectedLayers.length < 1) {
                alert("Please select atleast 1 layer first!")
                return
            }
            
            renameLayers(selectedLayers,layerNameEdit.text, separatorEdit.text,startNumberEdit.text,iterateOverrideCheckbox.value);
        }catch(error){
            alert("An error occured on line: " + error.line + "\nError message: " + error.message);
        } finally {
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
    }
    
    



    


    function renameLayers(selectedLayers,layerNames, separator, startNum, override) {

        for (var i = 0; i < selectedLayers.length; i++) {
            var count = i + 1;
            var startNumCount = Number(startNum) + i;
            if(override == false){
                if(!startNum || isNaN(startNum)){
                    selectedLayers[i].name = layerNames + separator + count
                } else {
                    selectedLayers[i].name = layerNames + separator + startNumCount
                }
            } else {
                selectedLayers[i].name = layerNames
            }
        }

        return selectedLayers
    }

}(this))