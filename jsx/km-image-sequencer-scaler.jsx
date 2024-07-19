var proj = app.project;

function getCurrentComp() {
    var activeComp = proj.activeItem;

    if (!(activeComp && activeComp instanceof CompItem)) {
        alert("Open up a comp first")
        return
    } else {
        return activeComp
    }

}


function getImageSelection() {
    var imageArray = new Array();

    if (proj.selection.length < 1) {
        alert("Select atleast 1 image first");
        return
    } else {
        for (var i = 0; i < proj.selection.length; i++) {
            imageArray.push(proj.selection[i])
        }

        return imageArray
    }

}
