/**
 * Takes a string input and converts that to markers on a selected layer separated by words that are distributed at even intervals
 * @author: Kyle Harter <kylenmotion@gmail.com>
 * @version 0.1.2
 * 
 * 
 * 
*/

(function km_textMarkers(thisObj){

    const scriptName = "Text 2 Markers";

    createUI(thisObj)

    function createUI(thisObj){
        const win = thisObj instanceof Panel
        ? thisObj
        : new Window("window", scriptName, undefined, {
            resizeable: true
        })

    win.orientation = 'column';
    win.alignChildren = ["left", "top"];


    const mainTextGroup = win.add("group", undefined, "Main Text Group");
    mainTextGroup.orientation = "column";
    const textFieldGroup = mainTextGroup.add("group", undefined, "Text Field Group");
    textFieldGroup.orientation = 'column';
    const textEditField = textFieldGroup.add("EditText", undefined, 'Add your text to be converted here', {multiline: true, scrolling: true});
    textEditField.size = [200, 200];

    const basedOnGroup = mainTextGroup.add("group", undefined, "Based On Group");
    basedOnGroup.orientation = 'row';
    const basedOnText = basedOnGroup.add("StaticText", undefined, "Based on: ");
    const basedOnDropdown = basedOnGroup.add("DropDownList", undefined,["Words", "Lines", "Characters", "Characters Excluding Spaces"])
    basedOnDropdown.selection = 0;

    const applyGroup = mainTextGroup.add("group", undefined, "Apply Group");
    applyGroup.orientation = 'row';
    const applyButton = applyGroup.add("button", undefined, "Apply");
    applyButton.preferredSize = [-1,30];
    applyButton.helpTip = "Click: Apply markers to selected layers.\rShift+Click: Apply markers to beginning of a comp."


    applyButton.onClick = function(){
        app.beginUndoGroup("Apply Button");
        const activeComp = app.project.activeItem;
        const curLayerSel = activeComp.selectedLayers;

        if(!(activeComp && activeComp instanceof CompItem)){
            alert("Please open a comp first")
            return
        }

        if(textEditField.text === ""){
            alert("Please enter some text first");
            return
        }


        if(!curLayerSel.length){
            alert("Select atleast 1 layer to apply markers to");
            return
        }


        const shiftHeld = ScriptUI.environment.keyboardState.shiftKey;

        
        applyMarkers(shiftHeld,activeComp, curLayerSel, textEditField.text, basedOnDropdown.selection)        
        
        win.close();
        app.endUndoGroup();

    }

    function applyMarkers(shift,comp, layers, textInput, dropDownSel){
            
        if(dropDownSel == 0){
            var textSplit = textInput.split(" ");
        }else if(dropDownSel == 1){
            var textSplit = textInput.split(/\r?\n|\r|\n/g);
        } else if(dropDownSel == 2){
            var textSplit = textInput.split("");
        } else{
            var charNoSpace = textInput.replace(/\s/g, '')
            var textSplit = charNoSpace.split("");
        }

        for(var i=0; i<layers.length; i++){
            
            // Remove markers by setting num markers to a variable
            for(var m=layers[i].marker.numKeys; m!=0; m--){
                layers[i].marker.removeKey(m)
            } 
                
    
            var layersDuration = layers[i].outPoint - layers[i].inPoint;
            
            var markerDistance = layersDuration/textSplit.length;
            

            for(var v=0; v<textSplit.length; v++){
            
                var textMarker = new MarkerValue(textSplit[v]);
                
                if(shift){
                        comp.markerProperty.setValueAtTime(v * markerDistance,textMarker);
                } else {
                        layers[i].marker.setValueAtTime(layers[i].inPoint + (v * markerDistance),textMarker);
        
                }
            }
        }
        
        return

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

})(this)
