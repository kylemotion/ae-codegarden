(function km_distributeKeyframes(thisObj) {
    
    var scriptName = this.name

    buildUI(thisObj);

    function buildUI(thisObj) {
        var win = (thisObj instanceof Panel) ? thisObj : new Window("palette", scriptName , undefined, {
            resizeable: true
        });

        win.orientation = 'column';
        win.alignChildren = ["fill", "top"];

        var durationRangeGroup = win.add('group', undefined, 'Duration Group');
        var compDuration = durationRangeGroup.add("radiobutton", undefined, "\u00A0Comp Duration");
        compDuration.value = true;
        var workAreaDuration = durationRangeGroup.add("radiobutton", undefined, "\u00A0Work Area Duration");

        var applyGroup = win.add("group", undefined, "apply group");
        applyGroup.alignChildren = ["fill", "fill"]
        var distributeButton = applyGroup.add("button", undefined, "Distribute!");



        distributeButton.onClick = function () {
            app.beginUndoGroup("Distrbute Keyframes")

            var activeComp = app.project.activeItem;

            if (!(activeComp && activeComp instanceof CompItem)) {
                alert("Open up a comp first!");
                return
            }

            try {
                distributeKeyframes(compDuration.value)
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


    function getPropertySelection() {
        var comp = app.project.activeItem;
        var selectedLayer = comp.selectedLayers;
        var selectedProps = selectedLayer[0].selectedProperties;

        return selectedProps

    }

    function collectKeyframeValues() {
        var selectedProps = getPropertySelection();
        var keyframeValArray = new Array();

        var keys = selectedProps[0].numKeys;

        for (var i = 1; i <= keys; i++){
            keyframeValArray.push(selectedProps[0].keyValue(i))
        }
        return keyframeValArray
    }

    var keyframeValArray = collectKeyframeValues();

    
    function collectKeyframeTimes(compDuration) {
        var comp = app.project.activeItem;
        var selectedProps = getPropertySelection();
        var keyFrameTimes = new Array();

        var workAreaStart = comp.workAreaStart;
        var workAreaEnd = comp.workAreaStart + comp.workAreaDuration
        if (compDuration.value = true) {
            var duration = comp.duration;
        } else {
            duration = workAreaStart + workAreaEnd
        }
        
        var keys = selectedProps[0].numKeys;
        var keyDiff = duration / keys;
        for (var i = 1; i <= keys; i++){
            var newKeyTime = ((i-1) * keyDiff);
            keyFrameTimes.push(newKeyTime)
        }
        
        return keyFrameTimes

    }


    function removeKeyframes() {
        var selectedProps = getPropertySelection();

        var keys = selectedProps[0].selectedKeys;
        alert(keys)

        if (selectedProps[0] instanceof Property) {
            for (var i = 0; i < keys.length; i++){
                selectedProps[0].removeKey(keys[i]-i)
            }
        }
        return selectedProps[0]


    }
    function distributeKeyframes(compDuration) {
        var selectedProps = getPropertySelection();
        var keyFrameTimes = collectKeyframeTimes(compDuration);

        removeKeyframes()

        selectedProps[0].setValuesAtTimes(keyFrameTimes, keyframeValArray);

        return alert(selectedProps[0].numKeys)


    }



})(this)