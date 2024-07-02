/**
 * @description A script that will sequence layers with a slider for an interactive experience. Randomization and doubling sequencing added.
 * @name ae-layer-sequencer
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

    var scriptName = "ae-layer-sequencer";

    function createUI(thisObj) {
        var win = thisObj instanceof Panel
            ? thisObj
            : new Window("palette", "ae-layer-sequencer" , undefined, {
                resizeable: true
            })

        win.orientation = "column";
        win.alignChildren = ["fill", "top"];

        var sequencerPanel = win.add("panel", undefined, "Sequence Style");
        sequencerPanel.orientation = "column";
        sequencerPanel.alignChildren = ["fill", "top"];


        var sequenceGroup = sequencerPanel.add("group", undefined, "Sequence Group");
        sequenceGroup.orientation = "column";
        sequenceGroup.alignChildren = "left";
        var sequenceOffset = sequenceGroup.add("radiobutton", undefined, "Offset");
        var sequenceDoubling = sequenceGroup.add("radiobutton", undefined, "Doubling");
        var sequenceRandom = sequenceGroup.add("radiobutton", undefined, "Random");
        

        var framePanel = win.add("panel", undefined, "Frame Doubling");
        framePanel.orientation = 'column';
        framePanel.alignChildren = ["fill", "top"];

        var doublingGroup = framePanel.add("group", undefined, "Doubling Group");
        doublingGroup.orientation = "column";
        doublingGroup.alignChildren = "left";
        var doublingStatic = doublingGroup.add("statictext", undefined, "Doubling Frame Start: ");
        var doublingInput = doublingGroup.add("edittext", undefined, "1");
        doublingInput.characters = 20;

        
        var sliderPanel = win.add("panel", undefined, "Adjust layers");
        sliderPanel.orientation = 'column';
        sliderPanel.alignChildren = ["fill", "top"];

        var sliderGroup = sliderPanel.add("group", undefined, "slider offset");
        sliderGroup.orientation = 'column';
        sliderGroup.alignChildren = ["fill", "top"];
        var titleResult = sliderGroup.add("group",undefined, "Slider result");
        titleResult.orientation = "row";
        titleResult.alignChildren = "left";
        var sliderOffset = sliderGroup.add("slider",undefined, 0, 0, 10);
        sliderOffset.value = 0;

        
        sliderOffset.onChanging = function () {
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
            
            var delayFrameSlider = Math.floor(sliderOffset.value);
            
            sequenceLayersInComp(selectedLayers,activeComp, delayFrameSlider)
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


    function sequenceLayersInComp(selLayers,comp, delayFrames){
        var origSelLayers = selLayers.slice();
        var compFrameRate = comp.frameDuration * parseInt(delayFrames);
        
        for(var i = 1; i<origSelLayers.length; i++){
          var layer = origSelLayers[i];
            layer.startTime = origSelLayers[i].startTime + (compFrameRate * i)
        }
  
        return origSelLayers
      }


}(this))