/** 
* 
* script to create multi-line text 
* 
* 
* 
*/


(function km_textRepeater(thisObj) {
    
    var scriptName = "km_textRepeater"
    var editcharacters = 20;

    var currentComp = app.project.activeItem;

    if (!(currentComp && currentComp instanceof CompItem)) {
        alert("Open up a comp first!")
        return
    };

    createUI(thisObj);

    function createUI(thisObj) {
        
        var win = thisObj instanceof Panel
            ? thisObj
            : new Window("window", scriptName, undefined, {
                resizeable: true
            });
        
        win.orientation = 'column';
        win.alignChildren = ["fill", "fill"];



        var textInputGroup = win.add("group", undefined, "text input group");
        textInputGroup.orientation = 'row';
        // textInputGroup.alignChildren = ["fill", "fill"];
        var textInputStatic = textInputGroup.add("statictext", undefined, "Text Input:");
        var textInputEdit = textInputGroup.add("edittext", undefined, "Enter Text Here", {multiline: true, scrollable: true});
        textInputEdit.characters = editcharacters;
        var copiesGroup = textInputGroup.add("group", undefined, "copies group");
        var numCopiesStatic = copiesGroup.add("statictext", undefined, "# of Copies:");
        var numCopiesEdit = copiesGroup.add("edittext", undefined, "3");
        numCopiesEdit.characters = 8;

        // var fontGroup = win.add("group", undefined, "font group");
        // var fontStatic = fontGroup.add("statictext", undefined, "Pick a font:");
        // var fontDropdown = fontGroup.add("dropdownList", undefined, []);
        // fontDropdown.characters = editcharacters;


        var colorCheckGroup = win.add("group", undefined, "color check group");
        colorCheckGroup.orientation = 'row';
        var fillStrokeCheckbox = colorCheckGroup.add("checkbox", undefined, "\u00A0Fill/Stroke");
        fillStrokeCheckbox.value = true;
        var altColors = colorCheckGroup.add("checkbox", undefined, "\u00A0Alternate Colors");

        var colorInputGroup = win.add("group", undefined, "color input group");
        colorInputGroup.orientation = 'row';
        // colorInputGroup.alignChildren = ["fill", "fill"];
        var mainColorStatic = colorInputGroup.add("statictext", undefined, "Main Color:");
        var mainColorHexEdit = colorInputGroup.add("edittext", undefined, "ffffff");
        mainColorHexEdit.characters = 8;
        var altColorStatic = colorInputGroup.add("statictext", undefined, "Alt Color:");
        var altColorHexEdit = colorInputGroup.add("edittext", undefined, "d0d0d0");
        altColorHexEdit.characters = 8;


        var applyGroup = win.add("group", undefined, "apply group");
        applyGroup.orientation = 'row';
        applyGroup.alignChildren = ["fill", "fill"];
        var helpButton = applyGroup.add("button", undefined, "Help Me");
        var createTextButton = applyGroup.add("button", undefined, "Create Text");

        helpButton.onClick = function () {
            alert("Help me plz")
        }

        createTextButton.onClick = function () {
            win.close()
            app.beginUndoGroup("createText")
            try {
                createText(textInputEdit.text, mainColorHexEdit.text, fillStrokeCheckbox.value, altColors.value, altColorHexEdit.text, numCopiesEdit.text)
            } catch (e) {
                alert(e)
            } finally {
                app.endUndoGroup()
            }
        }


        win.layout.layout();
        win.onResizing = function () {
            this.layout.resize()
        }

        win.show()


    }



    function hexToRGB(mainColor) {
        var hexColor = "0x" + mainColor;
        var r = hexColor >> 16;
        var g = (hexColor & 0x00ff00) >> 8;
        var b = hexColor & 0xff;
        return [r / 255, g / 255, b / 255];
    }


    function createText(textInput, mainColor, fillStroke, colorOptions, altColor, numCopies) {
        var newText = currentComp.layers.addText(textInput);
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


        return currentComp.layer(textInput)

    }




})(this)