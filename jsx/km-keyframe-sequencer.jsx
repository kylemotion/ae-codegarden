/**
 * 
 * a script to sequence keyframes by a specified frame amount everytime the script is run
 * @author: Kyle Harter <kylenmotion@gmail.com>
 * @version 0.1.1
 * 
 * 
 * 
*/


(function(thisObj){

  createUI(thisObj)


  var scriptName = "km-frame-sequencer";

    function createUI(thisObj){
        var win = thisObj instanceof Panel
        ? thisObj
        : new Window("window", scriptName, undefined, {
            resizeable: true
        })

    win.orientation = 'column';
    win.alignChildren = ["left", "top"];

    var mainGroup = win.add("group", undefined, "Main Group");
    mainGroup.orientation = 'column';


    var frameDelayGroup = mainGroup.add("group", undefined, "Frame Delay Group");
    frameDelayGroup.orientation = 'row';
    var frameDelayText = frameDelayGroup.add("statictext", undefined, "Frames to delay: ")
    var frameDelayTextBox = frameDelayGroup.add("edittext", undefined, "1");
    frameDelayTextBox.preferredSize = [50,30];

    
    var applyGroup = mainGroup.add("group", undefined, "Apply Group");
    applyGroup.orientation = 'row';
    var applyButton = applyGroup.add("button", undefined, "Apply");
    applyButton.preferredSize = [-1,30];
    applyButton.helpTip = "Click: Sequence Keyframes from bottom property to top property.\rInsert a number in text field to offset layers by a specific amount of frames.\rShift+Click: Reverse sequence order to sequence from top property to bottom property"


applyButton.onClick = function(){
    try {
        app.beginUndoGroup("Sequences keyframes");
        var activeComp = app.project.activeItem;
        var keyState = ScriptUI.environment.keyboardState; 
        // var metaKey = keyState.metaKey;
        var shiftKey = keyState.shiftKey;
        var getPropSel = getPropertySelection(activeComp, shiftKey);
        var keyframeCollect = collectKeyframes(getPropSel);



        sequenceKeyframes(getPropSel,keyframeCollect, activeComp, frameDelayTextBox.text)
      } catch(error) {
        alert(error)

      } finally {
        // this always runs no matter what
        app.endUndoGroup()
      }
    }
      

    function getPropertySelection(comp, meta) {
      
        if(!(comp && comp instanceof CompItem)){
          return alert("Please open a comp first")
      }

        var selectedLayers = comp.selectedLayers;
        var selectedProps = new Array();

        if(selectedLayers.length < 1){
          return alert("Please select properties on a layer first")
      }

      
      for(var j = 0; j < selectedLayers.length; j++){
        var curProps = selectedLayers[j].selectedProperties;
          for(var i = 0; i < curProps.length; i++){
            if(curProps[i].numKeys > 0){
              selectedProps.push(curProps[i])
            }
         
        }

        }

        if(meta){
          return selectedProps
        } else {
          return selectedProps.reverse()
        }
      }
    
    function collectKeyframes(props){
        
      var selProps = props;



        var keyIndexList, curKeyIndex, curKeyValue, inin, outin, ab, cb, ie, oe, sab, scb, ist, ost, rov, twoDS, threeDS;
        twoDS = PropertyValueType.TwoD_SPATIAL;
        threeDS = PropertyValueType.ThreeD_SPATIAL;

        keyIndexList = new Array();
        
        for(var i = 0; i<selProps.length; i++){
          var selectedProps = selProps[i];
          for(var j=1; j <= selectedProps.numKeys; j++){
            var curKeyTime = selectedProps.keyTime(j);
            curKeyIndex = j;
            curKeyValue = selectedProps.keyValue(j);
            inin = selectedProps.keyInInterpolationType(curKeyIndex);
            outin = selectedProps.keyOutInterpolationType(curKeyIndex);

            if(inin == KeyframeInterpolationType.BEZIER && outin==KeyframeInterpolationType.BEZIER){
              ab = selectedProps.keyTemporalAutoBezier(curKeyIndex);
              cb = selectedProps.keyTemporalContinuous(curKeyIndex);
            }

            if(inin != KeyframeInterpolationType.HOLD || outin != KeyframeInterpolationType.HOLD){
              ie = selectedProps.keyInTemporalEase(curKeyIndex);
              oe = selectedProps.keyOutTemporalEase(curKeyIndex);
            }

            if(selectedProps.propertyValueType == twoDS || selectedProps.propertyValueType == threeDS){
              sab = selectedProps.keySpatialAutoBezier(curKeyIndex);
              scb = selectedProps.keySpatialContinuous(curKeyIndex);
              ist = selectedProps.keyInSpatialTangent(curKeyIndex);
              ost = selectedProps.keyOutSpatialTangent(curKeyIndex);
              rov = selectedProps.keyRoving(curKeyIndex);
            }

            keyIndexList[keyIndexList.length] = {'curKeyTime': curKeyTime, 'curKeyIndex':curKeyIndex,'curKeyValue':curKeyValue,'inin':inin,'outin':outin,'ab':ab,'cb':cb,'ie':ie,'oe':oe,'sab':sab,'scb':scb,'ist':ist,'rov':rov};
          }
        }

        return keyIndexList
    }

  

    function sequenceKeyframes(props, keysArray, comp, frames){
      try{
        var compFrameRate = comp.frameDuration;
        var frameDelay = compFrameRate * parseInt(frames);

        if(isNaN(frames) || frames.trim() == ''){
          return alert("Please enter a number in the text field")
        }


        var propSelection = props;
        

        // remove keyframes on properties
        for(var i = 0; i< propSelection.length; i++){
           while(propSelection[i].numKeys > 0){
              propSelection[i].removeKey(1);
            }
        }

        // paste keyframes and sequence them
        var newKeyTime, addNewKey, newKeyIndex;
        var keyArrayLength = keysArray.length;
        for(var j = 0; j < propSelection.length; j++){
          var propSel = propSelection[j];
          for(var k = 0; k< keyArrayLength; k++){
            addNewKey = propSel.addKey(keysArray[k].curKeyTime + (frameDelay * j));
            newKeyIndex = addNewKey;
            propSel.setValueAtKey(newKeyIndex, keysArray[k].curKeyValue);

            propSel.setInterpolationTypeAtKey(newKeyIndex, keysArray[k].inin, keysArray[k].outin);
            if(keysArray[k].inin == KeyframeInterpolationType.BEZIER && keysArray[k].outin == KeyframeInterpolationType.BEZIER && keysArray[k].cb){
              propSel.setTemporalContinuousAtKey(newKeyIndex, keysArray[k].cb);
              propSel.setTemporalAutoBezierAtKey(newKeyIndex, keysArray[k].ab);
            };

            if(propSel.propertyValueType == PropertyValueType.TwoD_SPATIAL || propSel.propertyValueType == PropertyValueType.ThreeD_SPATIAL){
              propSel.setSpatialContinuousAtKey(newKeyIndex, keysArray[k].scb);
              propSel.setSpatialAutoBezierAtKey(newKeyIndex, keysArray[k].sab);
              propSel.setSpatialTangentsAtKey(newKeyIndex, keysArray[k].ist, keysArray[k].ost);
              propSel.setRovingAtKey(newKeyIndex, keysArray[k].rov)
            };

          }
        }

        return

      } catch(err){
        alert(err.line.toString() + "\r" + err.toString());
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


}(this))
