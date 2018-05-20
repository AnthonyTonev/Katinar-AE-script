{
    function AssembleSelectedLayers(thisObj) {
        var scriptName = "Katinar";
        var dropNum = 0;
        var locked = false;
        var check = false;
        var uncheck = true;
        var icheck = false;
        var iuncheck = true;


        function checkLocker() {
            if (uncheck) {
                check = true;
                uncheck = false;
                locked = check;
            } else if (!uncheck) {
                check = false;
                uncheck = true;
                locked = check;
            }
            return locked;
        }

        function invertLocker() {
            if (iuncheck) {
                icheck = true;
                iuncheck = false;

            } else if (!iuncheck) {
                icheck = false;
                iuncheck = true;

            }
            return icheck;
        }

        function dropNumGen() {
            var dropList = my_palette.grp.optsRow.dropDown.items;
            for (var i = 0; i <= dropList.length; i++) {
                if (dropList[i].selected == true) {
                    dropNum = i;
                    return dropNum;
                }
            }
        }

        function onAssembleClick() {
            app.beginUndoGroup("lock back");
            var dropList = my_palette.grp.optsRow.dropDown.items;
            var activeItem = app.project.activeItem;
            var firstLayer;
            if ((activeItem == null) || !(activeItem instanceof CompItem)) {
                alert("Select or open a comp first.", scriptName);
            } else if (dropList[dropNum].selected) {
                for (var i = 0; i < activeItem.numLayers; i++) {
                    firstLayer = activeItem.layer(i + 1);
                    if (icheck) {
                        if (firstLayer.label != (dropNum - 1) && dropNum > 0) {
                            firstLayer.locked = locked;
                        } else if (dropNum == 0) {
                            firstLayer.locked = locked;
                        }
                    } else if (!icheck) {
                        if (firstLayer.label == (dropNum - 1) && dropNum > 0) {
                            firstLayer.locked = locked;
                        } else if (dropNum == 0) {
                            firstLayer.locked = locked;
                        }
                    }
                }
            }

            app.endUndoGroup();
        }

        function BuildAndShowUI(thisObj) {
            var my_palette = (thisObj instanceof Panel) ? thisObj : new Window("palette", scriptName, undefined, {
                resizeable: true
            });
            if (my_palette != null) {

                var res =
                    "group { \
                            cmds: Group { \
							orientation:'row', alignment:['fill','top'], \
                            okButton: Button { text:'  ⚿ ', alignment:['fill','center'],preferredSize:[20,30], }, \
						}, \
						orientation:'column', alignment:['fill','top'], alignChildren:['left','top'], spacing:5, margins:[0,0,0,0], \
						optsRow: Group { \
							orientation:'row', alignment:['fill','top'], \
                            fcheck: Checkbox { text:'Lock', alignment:['fill','center'] }, \
                            dropDown: DropDownList {properties:{items:['All','None', 'Red','Yellow','Aqua','Pink','Lavender','Peach','Sea Foam', 'Blue','Green','Purple','Orange','Brown','Fuchsia','Cyan','Sandstone','Dark Green'], alignment:['fill','center'] }, preferredSize:[-1,20]},\
                             icheck: Checkbox { text:'Invert', alignment:['fill','center'] }, \
						}, \
					}";

                my_palette.margins = [10, 10, 10, 10];
                my_palette.grp = my_palette.add(res);

                var winGfx = my_palette.graphics;
                var darkColorBrush = winGfx.newPen(winGfx.BrushType.SOLID_COLOR, [0, 0, 0], 1);
                my_palette.grp.cmds.okButton.onClick = onAssembleClick;
                my_palette.grp.optsRow.dropDown.onChange = dropNumGen;
                my_palette.grp.optsRow.fcheck.onClick = checkLocker;
                my_palette.grp.optsRow.icheck.onClick = invertLocker;
                my_palette.onResizing = my_palette.onResize = function () {
                    this.layout.resize();
                }

            }
            return my_palette;
        }

        if (parseFloat(app.version) < 8) {
            alert("This script requires After Effects CS3 or later.", scriptName);
            return;
        }

        var my_palette = BuildAndShowUI(thisObj);
        my_palette.grp.optsRow.dropDown.selection = 0;
        if (my_palette != null) {
            if (my_palette instanceof Window) {
                my_palette.center();
                my_palette.show();
            } else {
                my_palette.layout.layout(true);
                my_palette.layout.resize();
            }
        } else {
            alert("Could not open the user interface.", scriptName);
        }
    }

    AssembleSelectedLayers(this);

}
