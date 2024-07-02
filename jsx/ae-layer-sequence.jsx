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
 * 7.2.2024
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

        var sequencerPanel = win.add("panel", undefined, "Stagger Style");
        sequencerPanel.orientation = "column";
        sequencerPanel.alignChildren = ["fill", "top"];


        var sequenceGroup = sequencerPanel.add("group", undefined, "Sequence Group");
        sequenceGroup.orientation = "column";
        sequenceGroup.alignChildren = "left";
        var sequenceOffset = sequenceGroup.add("radiobutton", undefined, "Sequence");
        sequenceOffset.value = true;
        var sequenceRandom = sequenceGroup.add("radiobutton", undefined, "Random");
        // var sequenceDoubling = sequenceGroup.add("radiobutton", undefined, "Doubling");
        
        var sliderPanel = win.add("panel", undefined, "Offset layers");
        sliderPanel.orientation = 'column';
        sliderPanel.alignChildren = ["fill", "top"];
        
        var sliderGroup = sliderPanel.add("group", undefined, "slider offset");
        sliderGroup.orientation = 'column';
        sliderGroup.alignChildren = ["fill", "top"];
        var sliderOffset = sliderGroup.add("slider",undefined, 0, 0, 40);
        sliderOffset.value = 0;
        var titleResult = sliderGroup.add("statictext",undefined, "Offset: " + sliderOffset.value + " Frames");
        
        var doublingPanel = win.add("panel", undefined, "Sequence Doubling");
        doublingPanel.orientation = 'column';
        doublingPanel.alignChildren = ["fill", "top"];

        var doublingGroup = doublingPanel.add("group", undefined, "Doubling Group");
        doublingGroup.orientation = "column";
        doublingGroup.alignChildren = "left";
        // var doublingStatic = doublingGroup.add("statictext", undefined, "Doubling Frame Start: ");
        // var doublingInput = doublingGroup.add("edittext", undefined, "1");
        // doublingInput.characters = 20;
        var doublingButton = doublingGroup.add("button", undefined, "Double!");
        doublingButton.alignment = ["fill", "top"];
        doublingButton.size = [100,25];

        var helpPanel = win.add("panel", undefined,"Help");
        helpPanel.orientation = 'row';
        helpPanel.alignChildren = ["fill", "top"];
        var helpButton = helpPanel.add("button", undefined, "How to use");
        helpButton.alignment = ["fill", "fill"];
        helpButton.size = [25,25];
        
        sequenceOffset.onClick = function (){ 
            sliderOffset.maxvalue = 40;
            titleResult.text = "Offset: " + Math.round(sliderOffset.value) + " Frames";
        }

        sequenceRandom.onClick = function (){ 
            sliderOffset.maxvalue = 100;
            titleResult.text = "Random Seed: " + Math.round(sliderOffset.value);
        }
        

        
        sliderOffset.onChange = function () {
            app.beginUndoGroup("rename")

            try{
                
            var offsetSlider = Math.round(sliderOffset.value);
            if(sequenceRandom.value == true){
                sliderOffset.maxvalue = 100;
                titleResult.text = "Random Seed: " + offsetSlider;
            } else {
                titleResult.text = "Offset: " + offsetSlider + " Frames";
            }


            var activeComp = app.project.activeItem;

            if (!(activeComp && activeComp instanceof CompItem)) {
                alert("Please open up a comp first!")
                return
            }

            var selectedLayers = getLayerSel(activeComp);

            if (selectedLayers.length < 1) {
                alert("Please select some layers first!")
                return
            }
            
            sequenceLayersInComp(selectedLayers,activeComp, sequenceRandom.value, offsetSlider)
        }catch(error){
            alert("An error occured on line: " + error.line + "\nError message: " + error.message);
        } finally {
        }
        
        app.endUndoGroup()
    }

        doublingButton.onClick = function (){
            app.beginUndoGroup("Double Sequncing")
            try{
                var activeComp = app.project.activeItem;

            if (!(activeComp && activeComp instanceof CompItem)) {
                alert("Please open up a comp first!")
                return
            }

            var selectedLayers = getLayerSel(activeComp);

            if (selectedLayers.length < 1) {
                alert("Please select some layers first!")
                return
            }

            // var doubles = doublingInput.text;

            // if(isNaN(doubles) || doubles.trim() == ''){
            //     alert("Please enter a number into the doubles sequencing field")
            //     return 
            // }

            doubleSequencing(selectedLayers, activeComp)

            } catch(error){
                alert("An error occured on line: " + error.line + "\nError message: " + error.message);
            } finally {

            }
            app.endUndoGroup()
        }

        helpButton.onClick = function (){
            alert("FUCK")
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


    function sequenceLayersInComp(selLayers,comp, randomOff, sliderVal){
        var origSelLayers = selLayers.slice();
        var compFrameRate = comp.frameDuration * sliderVal;
        
        for(var i = 0; i<origSelLayers.length; i++){
          var layer = origSelLayers[i];

            if(randomOff){
                layer.startTime = comp.time + (compFrameRate * ((Math.random()-.5) * 2 * i))
            } else {
                layer.startTime = comp.time + (compFrameRate * i)
            }
        }
  
        return origSelLayers
      }


    function doubleSequencing(selLayers, comp){
        var origSelLayers = selLayers.slice();
        var compFrameRate = comp.frameDuration;
        
        for(var i = 0; i<origSelLayers.length; i++){
          var layer = origSelLayers[i];
          layer.startTime = comp.time;
          var frameOffset = Math.pow(2,i)-1;
          var timeOffset = frameOffset * compFrameRate;
          layer.startTime += timeOffset;
           

        }
  
        return origSelLayers
    }

}(this))