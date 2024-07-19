/**
 * @description a headless script to duplicate your current comp in the project panel as a means of sketching options
 * @name ae-comp-sketch
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
        app.beginUndoGroup("create sketch comps and easy versioning");
        var proj = app.project;

        if(!(proj)){
          alert("Whoops!\r\ An After Effects project is not open. Either open on or create a new AE project file before continuing.")
          return 
        }

      var activeComp = proj.activeItem;

      if(!(activeComp && activeComp instanceof CompItem)){
      alert("Woah!\r\ You don't have a comp open at the moment. Be sure to open one up before continuing.")
      return
      }
        

        duplicateCurrentComp(activeComp, proj)

      } catch(error) {
        alert("An error occured on line: " + error.line + "\nError message: " + error.message);

      } finally {
        // this always runs no matter what
        app.endUndoGroup()
      }
      
      

    function duplicateCurrentComp(comp, project){
      var currentComp = comp;
      var items = project.items;

      for(var i= 1; i <= items.length; i++){
        if(items[i] instanceof CompItem && items[i].name === currentComp.name){
          var dupedComp = project.item(i).duplicate();
          
        }
      }
      
      currentComp.name = dupedComp.name;
      var existingName = currentComp.name;

      var newName = existingName.replace(/\d+/g, function(match) {
          return parseInt(match) - 1;
      });


      dupedComp.name = newName;
      
      return dupedComp

    }

}())
