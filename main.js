var currentItem;
var previousItem;
var availableMoves = [];

var rect = document.getElementsByClassName("rect");

var adjacentList = [];
var killingRangeList = [];


var availableKillingMoves = [];

var scoreGreen = 0,
    scoreBlue = 0;
var turn = "green" //above team if 0, 1 if below team;
//first chance of green
$('#container').on('click', '.rect', function () {
    console.log(turn);
    currentItem = $(this).index();
    //if clicked on an available move
    if (rect[currentItem].firstElementChild.classList[1] == "red") {
        var previousItemColor = rect[previousItem].firstElementChild.classList[1];
        rect[currentItem].firstElementChild.classList.remove("red");
        rect[currentItem].firstElementChild.classList.add(previousItemColor);

        rect[previousItem].firstElementChild.classList.remove(previousItemColor);
        rect[previousItem].firstElementChild.classList.add("white");

        availableMoves.splice(availableMoves.indexOf(currentItem), 1); //removing moved color
        repaint();
        killerRepaint();
        console.log("moved item from " + previousItem + " to " + currentItem);
        currentItem = null;
        previousItem = null;
        turn = (turn == "green") ? "blue" : "green";
        updateTurn();
    } else if (rect[currentItem].firstElementChild.classList[1] == "black") {
        var previousItemColor = rect[previousItem].firstElementChild.classList[1];
        rect[currentItem].firstElementChild.classList.remove("black");
        rect[currentItem].firstElementChild.classList.add(previousItemColor);

        rect[previousItem].firstElementChild.classList.remove(previousItemColor);
        rect[previousItem].firstElementChild.classList.add("white");
        availableKillingMoves.splice(availableKillingMoves.indexOf(currentItem), 1); //removing moved color
        //killing a node
        var m = getMiddleElement(previousItem, currentItem);
        rect[m].firstElementChild.classList.remove(rect[m].firstElementChild.classList[1]);
        rect[m].firstElementChild.classList.add("white");
        if (previousItemColor == "blue")
            scoreBlue++;
        else
            scoreGreen++;

        updateScore();
        repaint();
        killerRepaint();
        console.log("deleted item " + m);
        currentItem = null;
        previousItem = null;
        turn = (turn == "green") ? "blue" : "green";
        updateTurn();
    } else {
        repaint();
        killerRepaint();
        //print adjacent nodes
        try {
            if (rect[currentItem].firstElementChild.classList[1] == turn) {
                var tempI = parseInt(currentItem / 5); //converted value of element to row
                var tempJ = currentItem % 5; //converted value of element to column
                adjacentList = []; //clearing previous adjacent elements
                killingRangeList = []; //clearing previous killing range elements
                availableMoves = []; //removing previous moves from list
                availableKillingMoves = []; // removing previous killing moves from the list

                //finding adjacent elements and pushing them to adjacentList
                if (valid(tempI) && valid(tempJ - 1)) {
                    adjacentList.push(tempI * 5 + tempJ - 1)
                }

                if (valid(tempI) && valid(tempJ + 1)) {
                    adjacentList.push(tempI * 5 + tempJ + 1)
                }

                if (valid(tempI - 1) && valid(tempJ)) {
                    adjacentList.push((tempI - 1) * 5 + tempJ)
                }

                if (valid(tempI + 1) && valid(tempJ)) {
                    adjacentList.push((tempI + 1) * 5 + tempJ)
                }

                if (valid(tempI - 1) && valid(tempJ - 1)) {
                    adjacentList.push((tempI - 1) * 5 + tempJ - 1)
                }

                if (valid(tempI + 1) && valid(tempJ + 1)) {
                    adjacentList.push((tempI + 1) * 5 + tempJ + 1)
                }

                if (valid(tempI - 1) && valid(tempJ + 1)) {
                    adjacentList.push((tempI - 1) * 5 + tempJ + 1)
                }

                if (valid(tempI + 1) && valid(tempJ - 1)) {
                    adjacentList.push((tempI + 1) * 5 + tempJ - 1)
                }

                //finding killing range elements and pushing them to killingRangeList
                if (valid(tempI) && valid(tempJ - 2)) {
                    killingRangeList.push(tempI * 5 + tempJ - 2)
                }

                if (valid(tempI) && valid(tempJ + 2)) {
                    killingRangeList.push(tempI * 5 + tempJ + 2)
                }

                if (valid(tempI - 2) && valid(tempJ)) {
                    killingRangeList.push((tempI - 2) * 5 + tempJ)
                }

                if (valid(tempI + 2) && valid(tempJ)) {
                    killingRangeList.push((tempI + 2) * 5 + tempJ)
                }

                if (valid(tempI - 2) && valid(tempJ - 2)) {
                    killingRangeList.push((tempI - 2) * 5 + tempJ - 2)
                }

                if (valid(tempI + 2) && valid(tempJ + 2)) {
                    killingRangeList.push((tempI + 2) * 5 + tempJ + 2)
                }

                if (valid(tempI - 2) && valid(tempJ + 2)) {
                    killingRangeList.push((tempI - 2) * 5 + tempJ + 2)
                }

                if (valid(tempI + 2) && valid(tempJ - 2)) {
                    killingRangeList.push((tempI + 2) * 5 + tempJ - 2)
                }

                paint();
                killerPaint();
            }
        } catch (Exception) {}
        previousItem = currentItem;
    }
});

//checking the validity of matrix coordinate
function valid(z) {
    if (z >= 0 && z <= 4)
        return 1;
    return 0;
}

function paint() {
    for (var i of adjacentList) {
        if (rect[i].firstElementChild.classList[1] == "white") {
            rect[i].firstElementChild.classList.remove("white");
            rect[i].firstElementChild.classList.add("red");
            availableMoves.push(i);
        }
    }
}

function killerPaint() {
    var alternateColor = getAlternateColorByIndex(currentItem);
    for (var i of killingRangeList) {
        if (rect[i].firstElementChild.classList[1] == "white") {
            var middleElement = getMiddleElement(currentItem, i);
            if (rect[middleElement].firstElementChild.classList[1] == alternateColor) {
                rect[i].firstElementChild.classList.remove("white");
                rect[i].firstElementChild.classList.add("black");
                console.log("can delete element at" + middleElement);
                availableKillingMoves.push(i);
            }
        }
    }
}

function repaint() {
    for (var i of availableMoves) {
        rect[i].firstElementChild.classList.remove("red");
        rect[i].firstElementChild.classList.add("white");
    }
    availableMoves = [];
}

function killerRepaint() {
    for (var i of availableKillingMoves) {
        rect[i].firstElementChild.classList.remove("black");
        rect[i].firstElementChild.classList.add("white");
    }
    availableKillingMoves = [];
}

function getMiddleElement(x, y) {
    var differ = x - y;
    var tempI = parseInt(x / 5); //converted value of element to row
    var tempJ = x % 5;
    if (differ == 10 && valid(tempI - 1) && valid(tempJ))
        return (tempI - 1) * 5 + tempJ;
    if (differ == (-10) && valid(tempI + 1) && valid(tempJ))
        return (tempI + 1) * 5 + tempJ;
    if (differ == 2 && valid(tempI) && valid(tempJ - 1))
        return (tempI) * 5 + tempJ - 1;
    if (differ == (-2) && valid(tempI) && valid(tempJ + 1))
        return (tempI) * 5 + tempJ + 1;

    if (differ == 12 && valid(tempI - 1) && valid(tempJ - 1))
        return (tempI - 1) * 5 + tempJ - 1;
    if (differ == (-12) && valid(tempI + 1) && valid(tempJ + 1))
        return (tempI + 1) * 5 + tempJ + 1;
    if (differ == 8 && valid(tempI - 1) && valid(tempJ + 1))
        return (tempI - 1) * 5 + tempJ + 1;
    if (differ == (-8) && valid(tempI + 1) && valid(tempJ - 1))
        return (tempI + 1) * 5 + tempJ - 1;
}

function getAlternateColorByIndex(x) {
    return (rect[x].firstElementChild.classList[1] == "blue") ? "green" : "blue";
}

function updateScore() {
    document.getElementById("above").innerHTML = "Green Score=" + scoreGreen+" ";
    document.getElementById("below").innerHTML = "Blue Score=" + scoreBlue+" ";
}

function updateTurn() {
    document.getElementById("turn").innerHTML = turn+"'s turn";
}