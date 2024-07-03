/**
 * @description a headless script to switch on preserve nested frame rate in export comps
 * @name ae-comp-preserve-nested-fr
 * @author Kyle Harter <kylenmotion@gmail.com>
 * @version 1.0.0
 * 
 * @license This script is provided "as is," without warranty of any kind, expressed or implied. In
 * no event shall the author be held liable for any damages arising in any way from the use of this
 * script.
 * 
 * 
 * 7.3.2024
 * 
 * 
*/




(function(){

    try {
        app.beginUndoGroup("preserve nested frame rates");
        var proj = app.project;

        if(!(proj)){
          alert("An After Effects project is not open. Either open on or create a new AE project file before continuing")
          return 
        }

        
        var selProjItems = proj.selection;

        if(selProjItems.length < 1){
          alert("Whoops!\r\
            Select atleast 1 comp before continuing.")
          return
        }

        var shiftKey = ScriptUI.environment.keyboardState.shiftKey;

        var selectedCompItems = getCompItems(selProjItems);

        if(shiftKey){
          alertPreserveNextedFrameRate(selectedCompItems)
        } else {
          preserveNestedFrameRate(selectedCompItems)
        }

      } catch(error) {
        alert("An error occured on line: " + error.line + "\nError message: " + error.message);

      } finally {
        // this always runs no matter what
        app.endUndoGroup()
      }
      
      

    function getCompItems(selItems){
      var compItems = new Array();

      for(var i = 0; i<selItems.length; i++){
        if(selItems[i] && selItems[i] instanceof CompItem){
          compItems.push(selItems[i])
        }
      }
      
      return compItems

    }


    function preserveNestedFrameRate(compItems){
      var successComps = new Array();
      var nameComps = new Array();

      
      for(var i = 0; i<compItems.length; i++){
        var nestedFR = compItems[i].preserveNestedFrameRate;
        
        if(nestedFR == false){
          successComps.push(compItems[i]);
          nameComps.push(compItems[i].name)
          for(var j = 0; j<successComps.length; j++){
            successComps[j].preserveNestedFrameRate = true;
          }
        }
      }

      if(successComps.length > 0){
        alert("Success!\r\
        You've preserved the nested frame rate in the following " + successComps.length.toString() + " comps!\r\
        \r\
        " + nameComps.join("\r"))
      } else {
        alert("Heads up!\r\
          Looks like you've already preserved the nested frame rate in these selected comps")
      }
       return
    }


    function alertPreserveNextedFrameRate(compItems){
      var trueComps = new Array();
      var falseComps = new Array();

      for(var i = 0; i<compItems.length; i++){
        var nestedFR = compItems[i].preserveNestedFrameRate;
        if(nestedFR == true){
          trueComps.push(compItems[i].name);
        } else {
          falseComps.push(compItems[i].name);
        }
      }

      var trueComp, falseComp;
        trueComp = trueComps.join("\r");
        falseComp = falseComps.join("\r");
     

      alert("Summary\r\
        The following items' nested frame rate IS PRESERVED:\r\ " + 
        trueComp + 
        "\r\
          \r\
         The following items' nested frame rate IS NOT PRESERVED:\r\ " + 
         falseComp
        )

      return compItems


    }

}())
