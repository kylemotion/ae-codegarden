/**
 * 
 * a script to do something amazing
 * @author: Kyle Harter <kylenmotion@gmail.com>
 * @version 0.1.0
 * 
 * 
 * 
*/


(function(thisObj){



    var scriptName = "km-precomp-footage-replace";

    createUI(thisObj)

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


    var applyGroup = mainGroup.add("group", undefined, "Apply Group");
    applyGroup.orientation = 'row';
    var applyButton = applyGroup.add("button", undefined, "Replace Footage");
    applyButton.preferredSize = [-1,30];
    applyButton.helpTip = "Click: Apply markers to selected layers.\rShift+Click: Apply markers to beginning of a comp."


    applyButton.onClick = function(){
    try {
        app.beginUndoGroup("What script does");

        /* if(!(activeComp && activeComp instanceof CompItem)){
            alert("Please open a comp first")
            return
        } */

            replaceFootage()


      } catch(error) {
        alert(error)
      } finally {
        // this always runs no matter what
        app.endUndoGroup()
      }
      
    }

    
    function getProjItems(){
        var proj = app.project;
        var footageStart;
        var footageReplace;

        var projItemArray = new Array();
    
        for(var t = 1; t<= proj.numItems;t++){
            for(var i = 0; i< proj.selection.length; i++){
                if(proj.selection[i] instanceof FootageItem){
                    if(proj.selection[i].name == proj.item(t).name){
                        projItemArray.push(t)
                    }
                } else {
                    alert("Select a footage layer first")
                }
            }

            }

        return projItemArray
        
    }


    function precompSelection(){
        var proj = app.project;
        var activeComp = proj.activeItem;
        var selLayers = activeComp.selectedLayers;
        var precompArray = new Array();

        if(!(activeComp && activeComp instanceof CompItem)){
            alert("Please open a comp first")
        }

        for(var n = 0; n<selLayers.length; n++){
            if(selLayers[n].source && selLayers[n].source instanceof CompItem){
                precompArray.push(selLayers[n])
            } else {
                alert("Please select a precomp in your current comp first")
            }
        }
        
        return precompArray
    }


    function replaceFootage(){
        var proj = app.project;
        var projItems = getProjItems();
    
        var precompArray = precompSelection();
        var preCompLength = precompArray.length;

        for(var b = 0; b<precompArray.length; b++){
            var precompSource = precompArray[b].source;  
            for(var w = 1; w<=precompSource.numLayers; w++){
                var precompLayer = precompSource.layer(w);
                if(precompLayer instanceof AVLayer && precompLayer.name === proj.item(projItems[1]).name){
                        precompLayer.replaceSource(proj.item(projItems[0]), false)
                        precompLayer.name = proj.item(projItems[0]).name
                    }
                }
            }

        alert("Footage has been replaced in "+preCompLength+" comps")
        
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

}(this))