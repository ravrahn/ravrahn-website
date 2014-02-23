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
function createGrid(width, height, density) {
    var grid = "";

    var row = "<div>";
    for (var i=0; i<width; i++) {
        row += "<div></div>";
    }
    row += "</div>";

    for (var j=0; j<height+5; j++) {
        grid += row;
    }

    return grid;
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

    $("#monitor").css("width", width.toString() + "px");
    $("#monitor").css("height", height.toString() + "px");

    diagonal = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));

    $("#mon-diag").css("width", diagonal.toString() + "px");
    $("#mon-diag").css("-webkit-transform", "rotate(" + transformAngle(width, height).toString() + "rad)");
    $("#mon-diag").css("-moz-transform", "rotate(" + transformAngle(width, height).toString() + "rad)");
    $("#mon-diag").css("-o-transform", "rotate(" + transformAngle(width, height).toString() + "rad)");
    $("#mon-diag").css("-ms-transform", "rotate(" + transformAngle(width, height).toString() + "rad)");
    $("#mon-diag").css("transform", "rotate(" + transformAngle(width, height).toString() + "rad)");

    $("#monitor div").remove();

    var gridAmountWide = Math.floor(density / 6);

    var gridSize = scale / gridAmountWide;

    if (gridSize < 1) {
        gridSize = 1;
        gridAmountWide = scale;
    }

    $("#monitor").append(createGrid(gridAmountWide, Math.ceil(height/gridSize)));

    $("#monitor div:not(#monitor div div)").css("height", gridSize.toString() + "px");
    $("#monitor div div").css("width", gridSize.toString() + "px");
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
