// Calculates the greatest common denominator
// of two integers, for simplifying fractions.
function gcd(a, b) {
    var rem;
    while (b > 0) {
        rem = a % b;
        a = b;
        b = rem;
    }

    if (a == 0) {
        a = 1;
    }

    return a;
}

// This function calculates the aspect ratio
// of a computer monitor
// given the width and hight in pixels
function aspectRatio(width, height, changedBy) {
    var gcdXY;
    var yRatio;
    var xRatio;

    var ratioString = "";

    gcdXY = gcd(width, height);

    xRatio = width / gcdXY;
    yRatio = height / gcdXY;

    // divide by 2 until both numbers are under 30
    // so we don't get silly ratios like 1921:1080
    if (xRatio > 25 || yRatio > 25) {
        // find a 'neat' ratio that is as close as possible
        // to the real one
        var xTemp = xRatio;
        var xCount = 0;
        var yTemp = yRatio;
        var yCount = 0;

        if (changedBy == "x") {
            xLoop:
            while (xCount < xRatio) {
                if (xCount % 2 == 0) {
                    xTemp = xRatio + Math.ceil(xCount / 2);
                } else {
                    xTemp = xRatio - Math.ceil(xCount / 2);
                }

                while (yCount < yRatio) {
                    if (yCount % 2 == 0) {
                        yTemp = yRatio + Math.ceil(yCount / 2);
                    } else {
                        yTemp = yRatio - Math.ceil(yCount / 2);
                    }

                    gcdXY = gcd(xTemp, yTemp);

                    if (yTemp / gcdXY < 25 &&
                        xTemp / gcdXY < 25) {
                        xRatio = xTemp / gcdXY;
                        yRatio = yTemp / gcdXY;
                        break xLoop;
                    }

                    yCount++;
                }
                xCount++;
            }

            ratioString = "~";
        } else {
            yLoop:
            while (yCount < yRatio) {
                if (yCount % 2 == 0) {
                    yTemp = yRatio + Math.ceil(yCount / 2);
                } else {
                    yTemp = yRatio - Math.ceil(yCount / 2);
                }

                while (xCount < xRatio) {
                    if (xCount % 2 == 0) {
                        xTemp = xRatio + Math.ceil(xCount / 2);
                    } else {
                        xTemp = xRatio - Math.ceil(xCount / 2);
                    }

                    gcdXY = gcd(xTemp, yTemp);

                    if (yTemp / gcdXY < 25 &&
                        xTemp / gcdXY < 25) {
                        xRatio = xTemp / gcdXY;
                        yRatio = yTemp / gcdXY;
                        break yLoop;
                    }

                    xCount++;
                }
                yCount++;
            }
        }

        ratioString = "~";
    }

    if ((xRatio == 8 && yRatio == 5) ||
            (xRatio == 5 && yRatio == 8)) {
        // 16:10 - an exception
        xRatio *= 2;
        yRatio *= 2;
    }

    if (xRatio > yRatio) {
        ratioString += xRatio.toString() + ":" + yRatio.toString();
    } else {
        ratioString += yRatio.toString() + ":" + xRatio.toString();
    }

    return {
        "string": ratioString,
        "xRatio": xRatio,
        "yRatio": yRatio
    };
}

// This function calculates the dpi (dots per inch)
// of a computer monitor
// given the width and height in pixels
// and the diagonal in inches
function dpi(width, height, diagonal) {
    var density;
    var diagonalPixels;

    // Using pythag, approximate the amount of pixels along the diagonal
    diagonalPixels = Math.sqrt(Math.pow(height, 2) + Math.pow(width, 2));

    if (diagonal != 0) {
        density = Math.floor(diagonalPixels/diagonal);
    } else {
        density = 0;
    }

    return density;
}

// Creates the background grid of divs
// that visualise the density
function createGrid(width, height, gridSize) {
    var grid = $("#grid");
    grid.empty();

    grid = document.getElementById("grid");

    var vertLinesD = "";
    for (var x=0; x<width; x += gridSize) {
        vertLinesD += "M " + x + ",0 ";
        vertLinesD += "L " + x + "," + height + " ";
    }

    var vertPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    vertPath.setAttributeNS(null, "d", vertLinesD);

    grid.appendChild(vertPath);

    var horLinesD = "";
    for (var y=0; y<height; y += gridSize) {
        horLinesD += "M 0," + y + " ";
        horLinesD += "L " + width + "," + y + " ";
    }

    var horPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    horPath.setAttributeNS(null, "d", horLinesD);

    grid.appendChild(horPath);

    var diagD = "M 0,0 L " + width + "," + height;
    var diagPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    diagPath.setAttributeNS(null, "d", diagD);
    diagPath.setAttributeNS(null, "class", "mon-diag");

    grid.appendChild(diagPath);
}

// Find the angle to rotate the diagonal line of the screen by
// We know the opposite and adjacent so we can use arctan
// to give the angle in radians
// _____________
// |\) <-angle |
// | \         |
function transformAngle(width, height) {
    return Math.atan(height / width);
}

// Receives the width and height as given by
// the aspect ratio calculation
// as that gives values <30 that approximate the
// ratio. Uses these to determine the width and height
// of the monitor.
function changeMonitor(width, height, scale, density) {

    // swap width and height so width is always bigger
    if (height > width) {
        var temp = height;
        height = width;
        width = temp;
    }

    // scale width to always be <scale> rem;
    height = height/width * scale;
    width = scale;

    // set a minimum height in case of
    // ridiculous ratios
    if (height < 10) {
        height = 10;
    }

    if (width === $("#monitor").width()) {
        // animate if width has not changed
        // (ie. window was not resized)
        $("#monitor").animate({ "height": height.toString() + "px" }, 200);
    } else {
        console.log("dammit");
        $("#monitor").css("width", width.toString() + "px");
        $("#monitor").css("height", height.toString() + "px");
    }

    diagonal = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));

    $("#diagonal").css("width", diagonal.toString() + "px");
    $("#diagonal").css("-webkit-transform", "rotate(" + transformAngle(width, height).toString() + "rad)");
    $("#diagonal").css("-moz-transform", "rotate(" + transformAngle(width, height).toString() + "rad)");
    $("#diagonal").css("-o-transform", "rotate(" + transformAngle(width, height).toString() + "rad)");
    $("#diagonal").css("-ms-transform", "rotate(" + transformAngle(width, height).toString() + "rad)");
    $("#diagonal").css("transform", "rotate(" + transformAngle(width, height).toString() + "rad)");

    // the amount of grid tiles across
    var gridAmountWide = Math.floor(density / 8);

    // the size of each grid tile
    var gridSize = scale / gridAmountWide;

    if (gridSize < 1) {
        gridSize = 1;
    }

    createGrid(width, height, gridSize);
}

// Use the above functions to update the page with the new results
function updateResults(changedBy) {
    var width;
    var height;
    var diagonal;

    var dots;
    var ar;

    var contentWidth = $("#content").width();

    width = parseInt($("#width").val());
    height = parseInt($("#height").val());
    diagonal = parseFloat($("#diagonal").val());

    dots = dpi(width, height, diagonal);

    ar = aspectRatio(width, height, changedBy);

    $("#dpi").text(dots.toString());
    $("#aspect-ratio").text(ar["string"]);

    changeMonitor(width, height, contentWidth, dots);

    // permalink
    var permalinkString = "#width=" + width + "&height=" + height + "&diag=" + diagonal;

    document.getElementById("permalink-anchor").href = permalinkString;

}

function changeFontSizes() {
    updateResultsY();

    var monWidth = $("#monitor").width();

    $("#monitor").css("font-size", monWidth/56+"px");
}

function updateResultsX() {
    updateResults("x");
}
function updateResultsY() {
    updateResults("y");
}

function resChange(width, height, diagonal) {
    $("#width").val(width);
    $("#height").val(height);
    $("#diagonal").val(diagonal);

    updateResultsY();
}

function resThis() {
    var r = 1;

    if (typeof window === 'object') {
        if ('matchMedia' in window) {
            if (window.matchMedia('(min-resolution: 3dppx)').matches) { 
                r = 3;
            } else if (window.matchMedia('(min-resolution: 2dppx)').matches) { 
                r = 2;
            } else if (window.matchMedia('(min-resolution: 1dppx)').matches) { 
                r = 1;
            }
        }
    }

    // if (typeof r === 'number' && r > 1) {
    //     while (r % 25) r--;    
    // }
    console.log(r);

    var width = window.screen.width*r;
    var height = window.screen.height*r;

    var diag = Math.floor(Math.sqrt(Math.pow(width/(r*96), 2) + Math.pow(height/(r*96), 2)));

    resChange(window.screen.width*r, window.screen.height*r, diag);
}

// get the URL hash string, containing a desired width, height, and diag
function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.hash.slice(1).split('&');
    console.log(hashes);
    if (hashes.length != 3) {
        return {};
    }
    for(var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
// set the monitor to the values in the hash string
function resUrlVars() {
    var urlVars = getUrlVars();

    if (("width" in urlVars) && ("height" in urlVars) && ("diag" in urlVars)) {
        resChange(urlVars["width"], urlVars["height"], urlVars["diag"]);
    }
}

$(window).on("hashchange", function() {
    var urlVars = getUrlVars();

    if (("width" in urlVars) && ("height" in urlVars) && ("diag" in urlVars)) {
        resChange(urlVars["width"], urlVars["height"], urlVars["diag"]);
    }
});


$(document).ready(function() {
    console.log(getUrlVars())
    console.log($.isEmptyObject(getUrlVars()))
    if ($.isEmptyObject(getUrlVars())) {
        resThis();
    } else {
        resUrlVars();
    }
    changeFontSizes();
});

$(window).resize(changeFontSizes); 
