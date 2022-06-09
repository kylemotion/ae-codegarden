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
        inputTab.alignChildren = ["fill", "fill"];
        var textInputGroup = inputTab.add("panel", undefined);
        textInputGroup.orientation = 'column';
        textInputGroup.alignChildren = ["fill", "top"];
        var textInputStatic = textInputGroup.add("statictext", undefined, "Text Input:");
        var textInputEdit = textInputGroup.add("edittext", [0,0,-1,100], "Enter Text Here", { multiline: true, scrollable: true });
        textInputEdit.characters = editcharacters;

        var specsGroup = inputTab.add("panel", undefined);
        specsGroup.orientation = 'column';
        specsGroup.alignChildren = ["fill", "top"];
        var specDurGroup = specsGroup.add("group", undefined, "Spec Duration Group");
        specDurGroup.orientation = 'row';
        var specCompDuration = specDurGroup.add("radiobutton", undefined, "\u00A0Use Comp Duration");
        specCompDuration.value = true;
        var specCustomDuration = specDurGroup.add("radiobutton", undefined, "\u00A0Use Custom Duration");
        var durationInputGroup = specsGroup.add("group", undefined, "Duration Input Group");
        durationInputGroup.orientation = 'row';
        var durationStatic = durationInputGroup.add("statictext", undefined, "Duration:");
        var durationEdit = durationInputGroup.add("edittext", undefined);
        durationEdit.alignment = ["fill", "fill"];
        durationEdit.characters = editcharacters;
        
        
        
        var styleTab = tpanel.add("tab", undefined, "Style");
        styleTab.orientation = 'column';
        styleTab.alignChildren = ["fill", "top"];
        var fontStyle = styleTab.add("panel", undefined, "Font Style");
        
        var colorStyle = styleTab.add("panel", undefined, "Color Style");
        colorStyle.orientation = 'row';
        var colorFillStatic = colorStyle.add("statictext", undefined, "Color Hex: ");
        var colorFillEdit = colorStyle.add("edittext", undefined);
        colorFillEdit.alignment = ["fill", "top"];
        colorFillEdit.characters = editcharacters;


        
        var applyGroup = win.add("group", undefined, "apply group");
        applyGroup.orientation = 'row';
        applyGroup.alignChildren = ["fill", "fill"];
        var helpButton = applyGroup.add("button", undefined, "Help Me");
        var createTextButton = applyGroup.add("button", undefined, "Create Text");


        if (specCompDuration.value = true) {
            if (app.project.activeItem && app.project.activeItem instanceof CompItem) { 
                durationEdit.text = Math.floor(app.project.activeItem.duration) + " seconds"
            }
        }

        specCompDuration.onClick = function () {
            if (app.project.activeItem && app.project.activeItem instanceof CompItem) {
                durationEdit.text = Math.floor(app.project.activeItem.duration) + " seconds"
            }
        }

        specCustomDuration.onClick = function () {
            if (app.project.activeItem && app.project.activeItem instanceof CompItem) {
                durationEdit.text = "Enter custom duration in seconds"
            }
    
        }



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
                createText(currentComp, textInputEdit.text, specCompDuration.value, durationEdit.text, colorFillEdit.text)
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



    function hexToRGB(colorInput) {
        var colorTrim = colorInput.trim();
        var colorFilter = colorTrim.replace(/[#]/g, "");
        var hexColor = "0x" + colorFilter;
        var r = hexColor >> 16;
        var g = (hexColor & 0x00ff00) >> 8;
        var b = hexColor & 0xff;
        return [r / 255, g / 255, b / 255];
    }


    function textInputAmount(comp,textInput){
        var textTrim = textInput.trim();
        var textList = textTrim;
        var textSplit = textList.split("\n");
        var textArray = new Array();

        for(var i = 0; i<textSplit.length;i++){
            textArray.push(textSplit[i]);
        }

        return textArray

    }

    function createText(comp, textInput, compLength, customDur, colorInput) {


        var textArray = textInputAmount(comp,textInput);

        for(var i = 0; i<textArray.length; i++){
        var newText = comp.layers.addText(textArray[i].toString());
        var textProp = newText.property("Source Text");
        var textDoc = textProp.value;
        textDoc.resetCharStyle();
            textDoc.fontSize = 150;
            if (colorInput == "") {
                textDoc.fillColor = [1, 1, 1];
            } else {
                textDoc.fillColor = hexToRGB(colorInput);
            }
        textDoc.strokeWidth = 2;
        textDoc.applyStroke = false;
        textDoc.applyFill = true;
        textDoc.justification = ParagraphJustification.CENTER_JUSTIFY;
        textProp.setValue(textDoc);
            

        
        var layerSize = newText.sourceRectAtTime(0, true);
        var transProp = newText.property("ADBE Transform Group");
        var textAnchor = transProp.property("ADBE Anchor Point");
        var textWidth = layerSize.left + layerSize.width/2;
        var textHeight = layerSize.top + layerSize.height/2;
        textAnchor.setValue([textWidth, textHeight]);

            if (compLength.value == true) {
                var rangeDuration = comp.duration;
            } else {
                rangeDuration = parseFloat(customDur)
            }

            
            var textDuration = rangeDuration / textArray.length;
        
            var maskAdd = newText.Masks.addProperty("Mask");
            var maskShape = maskAdd.property("maskShape");
            var myShape = maskShape.value;

            myShape.vertices = [[layerSize.left, layerSize.top], [layerSize.width + layerSize.left, layerSize.top], [layerSize.width + layerSize.left, layerSize.top + layerSize.height], [layerSize.left, layerSize.top + layerSize.height]];
            myShape.closed = true;
            maskShape.setValue(myShape);

            newText.inPoint = (i)*textDuration;
            newText.outPoint = newText.inPoint + textDuration;
            
        
        

            
        }
        return comp.layer(textInput)

    }




})(this)