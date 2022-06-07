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

        var specsGroup = inputTab.add("panel", undefined);
        specsGroup.orientation = 'column';
        specsGroup.alignChildren = ["fill", "top"];
        var specDurGroup = specsGroup.add("group", undefined, "Spec Duration Group");
        specDurGroup.orientation = 'row';
        var specCompDuration = specDurGroup.add("radiobutton", undefined, "\u00A0Use Comp Duration");
        specCompDuration.value = true;
        var specCustomDuration = specDurGroup.add("radiobutton", undefined, "\u00A0Use Custom Duration");
        var durationEdit = specsGroup.add("edittext", undefined);
        durationEdit.characters = editcharacters;
        
        
        
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
                createText(currentComp,textInputEdit.text)
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


    function createText(comp,textInput) {

        var textArray = textInputAmount(comp,textInput);

        for(var i = 0; i<textArray.length; i++){
        var newText = comp.layers.addText(textArray[i].toString());
        var textProp = newText.property("Source Text");
        var textDoc = textProp.value;
        textDoc.resetCharStyle();
        textDoc.fontSize = 150;
        textDoc.fillColor = [1,1,1];
        textDoc.strokeWidth = 2;
        textDoc.font = "ProximaNova-Regular";
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


        var textDuration = comp.duration/textArray.length;

        newText.inPoint = (i)*textDuration;
        newText.outPoint = newText.inPoint + textDuration;

        }
        return comp.layer(textInput)

    }




})(this)