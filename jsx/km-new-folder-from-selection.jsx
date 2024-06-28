/**
 * 
 * @description a script that will create a folder in the project panel that will hold the selected items in the panel
 * @author: Kyle Harter <kylenmotion@gmail.com>
 * @version 0.1.0
 * 
 * 
 * 
*/


(function(thisObj){
    
    var scriptName = "km-new-folder-from-selection";

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


    var newFolderGroup = mainGroup.add("group", undefined, "Apply Group");
    newFolderGroup.orientation = 'row';

    var newFolderStaticText = newFolderGroup.add("statictext", undefined, "New folder name:");
    var newFolderEditText = newFolderGroup.add("edittext", undefined, "");
    newFolderEditText.preferredSize = [100, 30];
    


    var applyGroup = mainGroup.add("group", undefined, "Apply Group");
    applyGroup.orientation = 'row';
    var applyButton = applyGroup.add("button", undefined, "Apply");
    applyButton.preferredSize = [-1,30];
    applyButton.helpTip = 'Click: Collect selected items into a folder that you name.\rShift+Click: Collect selected items into a folder with a name of \"New folder from Selection\".'


    applyButton.onClick = function(){
    try {
        app.beginUndoGroup("New folder from selection");
        var project = app.project;
        var selectedItems = getItems(project);

        if(selectedItems.length < 1){
            alert("Select atleast 1 item to be sorted into a folder")
            return
        }

        var newFolderName = newFolderEditText.text;

        if(newFolderName == ""){
            alert("Enter a name for your new folder before moving forward")
            return
        }

        var shiftKey = ScriptUI.environment.keyboardState.shiftKey;

        var newFolder = createFolder(project, newFolderName, shiftKey);
        
        putItemsInFolder(selectedItems, newFolder)
      } catch(error) {
        alert("An error occured on line: " + error.line + "\nError message: " + error.message);
      } finally {
        // this always runs no matter what
        app.endUndoGroup()
      }
      
    }

    
    function getItems(proj){
        var selectedItems = proj.selection;
        
        return selectedItems
    }

    function createFolder(proj, folderName, shift){
        
        var newFolder = proj.items.addFolder(folderName);
        
        if(shift){
            newFolder.name = "New folder from selection"
        } 
        return newFolder
    }

    function putItemsInFolder(selItems, folder){
        for(var i = 0; i<selItems.length; i++){
            selItems[i].parentFolder = folder
        }

        return folder
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
