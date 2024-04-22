/**
 * Takes a string input and converts that to markers on a selected layer separated by words that are distributed at even intervals
 * @author: Kyle Harter <kylenmotion@gmail.com>
 * @version 0.1.0
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

    const applyGroup = mainTextGroup.add("group", undefined, "Apply Group");
    applyGroup.orientation = 'row';
    const applyButton = applyGroup.add("button", undefined, "Apply");
    applyButton.preferredSize = [-1,30];
    const helpButton = applyGroup.add("button", undefined, "?");
    helpButton.helpTip = "Click for instructions on how use script"
    helpButton.preferredSize = [30,30]




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

        // WILL BE FINAL FUNCTION: 

        applyMarkers(curLayerSel, textEditField.text)
        
        win.close();
        app.endUndoGroup();

    }

    helpButton.onClick = function(){
        alert("Help FUCK")
    }



    function applyMarkers(layers, textInput){
        const textSplit = textInput.split(" ");

        for(var i=0; i<layers.length; i++){
            
            var layersDuration = layers[i].outPoint - layers[i].inPoint;
            
            var markerDistance = layersDuration/textSplit.length;
            

            for(var v=0; v<textSplit.length; v++){
            
                var textMarker = new MarkerValue(textSplit[v]);
                
                
                layers[i].marker.setValueAtTime(layers[i].inPoint + (v * markerDistance),textMarker);
                
                
            }
        }


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
