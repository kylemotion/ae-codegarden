/** 
* 
* script to create multi-line text 
* 
* 
* 
*/


(function km_textSequencer(thisObj) {
    
    var scriptName = this.name;
    var editcharacters = 20;

    createUI(thisObj);

    function createUI(thisObj) {
        
        var win = thisObj instanceof Panel
            ? thisObj
            : new Window("window", scriptName, undefined, {
                resizeable: true
            });
        
        win.orientation = 'column';
        win.alignChildren = ["fill", "top"];

        var tpanel = win.add("tabbedpanel");
        var inputTab = tpanel.add("tab", undefined, "Input");
        var textInputGroup = inputTab.add("group", undefined, "text input group");
        textInputGroup.orientation = 'column';
        textInputGroup.alignChildren = ["fill", "top"];
        var textInputStatic = textInputGroup.add("statictext", undefined, "Text Input:");
        var textInputEdit = textInputGroup.add("edittext", [0, 0, 150, 100], "Enter Text Here", {multiline: true, scrollable: true});
        textInputEdit.characters = editcharacters;
        
        
        var styleTab = tpanel.add("tab", undefined, "Style");
        styleTab.orientation = 'column';
        styleTab.alignChildren = ["fill", "top"];
        var fontStyle = styleTab.add("panel", undefined, "Font Style");
        
        var colorStyle = styleTab.add("panel", undefined, "Color Style");


        
        var applyGroup = win.add("group", undefined, "apply group");
        applyGroup.orientation = 'row';
        applyGroup.alignChildren = ["fill", "fill"];
        var helpButton = applyGroup.add("button", undefined, "Help Me");
        var createTextButton = applyGroup.add("button", undefined, "Create Text");


        helpButton.onClick = function () {
            alert("Help me plz")
        }

        createTextButton.onClick = function () {

            var currentComp = app.project.activeItem;

            if (!(currentComp && currentComp instanceof CompItem)) {
                alert("Open up a comp first!")
                return
            };

            win.close()
            app.beginUndoGroup("createText")
            try {
                createText(currentComp,textInputEdit.text, mainColorHexEdit.text, fillStrokeCheckbox.value, altColors.value, altColorHexEdit.text, numCopiesEdit.text)
            } catch (e) {
                alert(e)
            } finally {
                app.endUndoGroup()
            }
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


    }



    function hexToRGB(mainColor) {
        var hexColor = "0x" + mainColor;
        var r = hexColor >> 16;
        var g = (hexColor & 0x00ff00) >> 8;
        var b = hexColor & 0xff;
        return [r / 255, g / 255, b / 255];
    }


    function createText(comp,textInput, mainColor, fillStroke, colorOptions, altColor, numCopies) {
        var newText = comp.layers.addText(textInput);
        var textProp = newText.property("Source Text");
        var textDoc = textProp.value;
        textDoc.resetCharStyle();
        textDoc.fontSize = 150;
        textDoc.fillColor = hexToRGB(mainColor);
        textDoc.strokeColor = hexToRGB(mainColor);
        textDoc.strokeWidth = 2;
        textDoc.font = "ProximaNova-Regular";
        textDoc.strokeOverFill = true;
        if (fillStroke == true) {
            textDoc.applyStroke = false;
            textDoc.applyFill = true;
        } else {
            textDoc.applyStroke = true;
            textDoc.applyFill = false;
        }
        textDoc.justification = ParagraphJustification.CENTER_JUSTIFY;
        textProp.setValue(textDoc);

                var numCopiesSlider = newText.property("ADBE Effect Parade").addProperty("ADBE Slider Control");
        numCopiesSlider.name = "Num Copies";
        numCopiesSlider.property(1).setValue(parseInt(numCopies));
        
        textProp.expression = 
        's = myText = value + "\\n";\
        numCopies = effect("Num Copies")(1);\
        for(i = 1; i<numCopies; i++){\
            s += myText\
        }\
        s'
        
        var layerSize = newText.sourceRectAtTime(0, true);
        var transProp = newText.property("ADBE Transform Group");
        var textAnchor = transProp.property("ADBE Anchor Point");
        var textWidth = layerSize.left + layerSize.width/2;
        var textHeight = layerSize.top + layerSize.height/2;
        textAnchor.setValue([textWidth, textHeight]);


        return comp.layer(textInput)

    }




})(this)