/**
 * This script will add keyframes to a layer's scale property to scale the layer up from 0 and end at it's current value.
 *
 * Hold SHIFT when running the script to add overshoot of 5 pixels
 *
 * @author Kyle Harter <kylenmotion@gmail.com>
 * @version 1.0.0
 */

(function scaleUp(){

var keyState = ScriptUI.environment.keyboardState;
var shiftheld = keyState.shiftKey;
var metaheld = keyState.metaKey;

var comp = app.project.activeItem;

if (!(comp && comp instanceof CompItem)) {
    alert("Please select a composition!");
    return;
}


var layers = comp.selectedLayers;

  if (layers.length === 0) {
    alert("Please select some layers!");
    return;
  }


  app.beginUndoGroup("ScaleUp");

const scaleLayers = layers;
    

    for(var i = 0; i<scaleLayers.length; i++){
        var scaleProp = scaleLayers[i].property("ADBE Transform Group").property("ADBE Scale");
        var scaleVal = scaleProp.value;
        var layerIn = scaleLayers[i].inPoint;
        var frameDur1 = 10 * comp.frameDuration;
        var frameDur2 = 15 * comp.frameDuration;

        var scaleTimesOvershoot = [layerIn, layerIn + frameDur1,layerIn + frameDur2];
        var scaleValuesOvershoot = [[0,0], [scaleVal[0] + 5, scaleVal[1]+5], scaleVal];
        var scaleValuesOvershootDef = [[0,0], [105, 105], [100, 100]];
        var scaleTimes = [layerIn, layerIn + frameDur1];
        var scaleValues = [[0,0], scaleVal];
        var scaleValDefault = [[0,0],[100,100]];

        var easeOut = new KeyframeEase(0,33.33333);
        var easeMid = new KeyframeEase(0,70);
        var easeIn = new KeyframeEase(0,70);




        for(var n = scaleProp.numKeys; n!=0; n--){
                scaleProp.removeKey(n)
            }

        if(shiftheld){
            scaleProp.setValuesAtTimes(scaleTimesOvershoot, scaleValuesOvershoot);
            scaleProp.setTemporalEaseAtKey(2, [easeIn, easeIn, easeIn], [easeOut, easeOut, easeOut]);
            scaleProp.setTemporalEaseAtKey(3, [easeMid, easeMid, easeMid], [easeMid, easeMid, easeMid]);
        
        } else if(metaheld){
            scaleProp.setValuesAtTimes(scaleTimes, scaleValDefault);
            scaleProp.setTemporalEaseAtKey(2, [easeIn, easeIn, easeIn], [easeOut, easeOut, easeOut]);
        } else if(shiftheld && metaheld){
            scaleProp.setValuesAtTimes(scaleTimesOvershoot, scaleValuesOvershootDef);
            scaleProp.setTemporalEaseAtKey(2, [easeIn, easeIn, easeIn], [easeOut, easeOut, easeOut]);
            scaleProp.setTemporalEaseAtKey(3, [easeMid, easeMid, easeMid], [easeMid, easeMid, easeMid]);
        } else{
            scaleProp.setValuesAtTimes(scaleTimes, scaleValues);
            scaleProp.setTemporalEaseAtKey(2, [easeIn, easeIn, easeIn], [easeOut, easeOut, easeOut]);
        }
        
        
        
    } 


app.endUndoGroup()
})()