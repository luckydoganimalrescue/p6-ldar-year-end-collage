// Photoshop Script: Multi-Circle Mask Face-Fitter
// Compatibility: Adobe Photoshop 2024 (v27.3.0)
// Targets: Exactly 5 layers named "mask" (no suffix)

function main() {
    // ======================================================================
    // YOUR HARD-CODED PATHS
    // ======================================================================
//    var inputFolder = "/Users/emilyjagdmann/Desktop/testpics";
//    var templateFile = "/Users/emilyjagdmann/Desktop/template.psd";
//    var outputFolder = "/Users/emilyjagdmann/Desktop/output";

    var inputFolder = Folder.selectDialog("Select folder with animal images");
    var templateFile = File.openDialog("Select your PSD template");
    var outputFolder = Folder.selectDialog("Select output folder");

    if (!inputFolder || !templateFile || !outputFolder) return;

    var inputDir = new Folder(inputFolder);
    var sourceTmpl = new File(templateFile);
    var outputDir = new Folder(outputFolder);

    if (!inputDir.exists) { alert("Input folder not found!"); return; }
    if (!sourceTmpl.exists) { alert("Template PSD not found!"); return; }
    if (!outputDir.exists) { outputDir.create(); }

    // Identify all layers named exactly "mask"
    var tempDoc = open(sourceTmpl);
    var maskLayersFound = [];
    
    for (var i = 0; i < tempDoc.layers.length; i++) {
        if (tempDoc.layers[i].name === "mask") {
            maskLayersFound.push(tempDoc.layers[i]);
        }
    }
    
    var maskCount = maskLayersFound.length;
    tempDoc.close(SaveOptions.DONOTSAVECHANGES);

    if (maskCount === 0) {
        alert("No layers named 'mask' were found in your template.");
        return;
    }

    var fileList = inputDir.getFiles(/\.(jpg|jpeg|png|tif|psd)$/i);
    var groupCounter = 1;

    for (var j = 0; j < fileList.length; j += maskCount) {
        var doc = open(sourceTmpl);
        
        var activeMasks = [];
        for (var k = 0; k < doc.layers.length; k++) {
            if (doc.layers[k].name === "mask") {
                activeMasks.push(doc.layers[k]);
            }
        }

        for (var m = 0; m < maskCount; m++) {
            var imageIndex = j + m;
            if (imageIndex >= fileList.length) break;

            var currentFile = fileList[imageIndex];
            var targetMask = activeMasks[m]; 
            
            var imageLayer = placeSmartObject(currentFile);
            imageLayer.move(targetMask, ElementPlacement.PLACEBEFORE);
            imageLayer.grouped = true; 

            fitToMask(imageLayer, targetMask);
        }

        var saveFile = new File(outputDir + "/Animal_Set_" + groupCounter + ".png");
        savePNG(saveFile);
        
        doc.close(SaveOptions.DONOTSAVECHANGES);
        groupCounter++;
    }

    alert("Batch Complete! Generated " + (groupCounter - 1) + " images.");
}

function fitToMask(imgLyr, maskLyr) {
    var mB = maskLyr.bounds;
    var iB = imgLyr.bounds;

    var mW = mB[2].as("px") - mB[0].as("px");
    var mH = mB[3].as("px") - mB[1].as("px");
    var iW = iB[2].as("px") - iB[0].as("px");
    var iH = iB[3].as("px") - iB[1].as("px");

    // Scale to "CONTAIN" within the mask bounds (no overflow)
    var scaleX = (mW / iW) * 100;
    var scaleY = (mH / iH) * 100;
    var finalScale = Math.min(scaleX, scaleY);

    // Add a small safety margin so it never exceeds the mask bounds due to rounding
    finalScale = finalScale * 0.80;

    imgLyr.resize(finalScale, finalScale, AnchorPosition.MIDDLECENTER);

    // Center after resize
    var niB = imgLyr.bounds;
    var imgCenterX = (niB[0].as("px") + niB[2].as("px")) / 2;
    var imgCenterY = (niB[1].as("px") + niB[3].as("px")) / 2;
    var maskCenterX = (mB[0].as("px") + mB[2].as("px")) / 2;
    var maskCenterY = (mB[1].as("px") + mB[3].as("px")) / 2;

    imgLyr.translate(maskCenterX - imgCenterX, maskCenterY - imgCenterY);
}



function placeSmartObject(file) {
    var desc = new ActionDescriptor();
    desc.putPath(charIDToTypeID("null"), new File(file));
    executeAction(charIDToTypeID("Plc "), desc, DialogModes.NO);
    return app.activeDocument.activeLayer;
}

function savePNG(saveFile) {
    var pngOpts = new PNGSaveOptions();
    pngOpts.compression = 9;
    pngOpts.interlaced = false;
    app.activeDocument.saveAs(saveFile, pngOpts, true, Extension.LOWERCASE);
}

main();
