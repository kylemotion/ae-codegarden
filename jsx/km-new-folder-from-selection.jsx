/**
 * 
 * @description a script that will create a folder in the project panel that will hold the selected items in the panel
 * @name km-new-folder-from-selection
 * @author: Kyle Harter <kylenmotion@gmail.com>
 * @version 1.1.0
 * 
 * @license This script is provided "as is," without warranty of any kind, expressed or implied. In
 * no event shall the author be held liable for any damages arising in any way from the use of this
 * script.
 * 
 * 
 * 6.28.2024
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
    applyButton.helpTip = 'Click: Collect selected items into a folder that you name.'


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

        var newFolder = createFolder(project, newFolderName);
        
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

    function createFolder(proj, folderName){
        var newFolderName = folderName;

        if(!(folderName)){
            newFolderName = "New folder from selection"
        }

        var newFolder = proj.items.addFolder(newFolderName);
        
        


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