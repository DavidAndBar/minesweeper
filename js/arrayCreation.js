let minesGame;
let minesDiscovered = 0;

const createGame = (HEIGHT, WIDTH, MINES_PERCENTAGE) => {

    let minesNumber = Math.floor(HEIGHT*WIDTH*MINES_PERCENTAGE);

    let minesList = [];
    let minesRow = [];
    let number = 0;
    let x;
    let y;

    // Creating the array as a template full of zeros.
    for (let i = 0; i < HEIGHT + 2; i++) {
        for (let j = 0; j < WIDTH + 2; j++) {
            minesRow[j] = number;
            console.log(number);
        }
        minesList[i] = [...minesRow]; // Passing the array by reference.
    }

    // Choosing randomly where the mines are.
    while (minesNumber > 0) {
        x = Math.round(Math.random()*(HEIGHT - 1)) + 1;
        y = Math.round(Math.random()*(WIDTH - 1)) + 1;
        if (minesList[x][y] != -1) {
            minesList[x][y] = -1;
            minesNumber--;
        }
    }

    // Counting how many mines a square have around.
    for (let i = 1; i <= HEIGHT; i++) {
        for (let j = 1; j <= WIDTH; j++) {
            let countMines = 0;
            if (minesList[i][j] == 0) {
                for (k = i-1; k <= i+1; k++) {
                    for(l = j - 1; l <= j + 1; l++){
                        if (!(k == i && l == j)) {
                            if (minesList[k][l] == -1) {
                                countMines++;
                            }
                        }
                    }
                }
                minesList[i][j] = countMines;
            }
        }
    }

    return minesList;
}

const clickMine = (event) => {
    let rowNumber = event.target.parentElement.id;
    let columnNumber = event.target.id;
    if (event.which == 1 && $(`#${rowNumber} #${columnNumber}`).text() != "X") {
        checkCell(rowNumber, columnNumber);
    } else if (event.which == 3) {
        flagMine(rowNumber, columnNumber);
    }
    

}

const flagMine = (rowNumber, columnNumber) => {
    if (!$(`#${rowNumber} #${columnNumber}`).text()) {
        $(`#${rowNumber} #${columnNumber}`).text("X");
        minesDiscovered++;
        $('#div-mines-discovered').text(minesDiscovered);
    } else if ($(`#${rowNumber} #${columnNumber}`).text() == "X") {
        $(`#${rowNumber} #${columnNumber}`).text("");
        minesDiscovered--;
        $('#div-mines-discovered').text(minesDiscovered);
    }
}

const checkCell = (rowNumber, columnNumber) => { 
    let number = minesGame[rowNumber.slice(1)][columnNumber.slice(1)];
    if (number == -1) {
        $("body").append('<div id="game-over-div"> You Lose </div>');
        $("#game-over-div").css({
            top: $("#mines-grid").position().top,
            left: $("#mines-grid").position().left + parseFloat($("#mines-grid").css("margin-left")),
            width: parseFloat($("#mines-grid").css("width")),
            height: parseFloat($("#mines-grid").css("height"))
        });
    } else if (number == 0) {
        $(`#${rowNumber} #${columnNumber}`).text(number);
        openSurrondings(rowNumber, columnNumber); // here the logic to check cells around.
    } else {
        $(`#${rowNumber} #${columnNumber}`).text(number);
    }
}

/*const openSurrondings = (rowNumber, columnNumber) => {
    let i = rowNumber; // i height, j width
    let k = columnNumber;
    for (k = i-1; k <= i+1; k++) {
        for(l = j - 1; l <= j + 1; l++){
            if (!(k == i && l == j) && !(k==0 || l == 0) && !(k > HEIGHT || l > WIDTH)) { //I'm here, im missing to test the function and add the recursivity.
                if (minesList[k][l] == 0) {
                    countMines++;
                }
            }
        }
    }
}*/

$(document).ready(() => {
    window.addEventListener("contextmenu", e => e.preventDefault());
    const HEIGHT = 10; // Beg: 10 Easy: 14 Inter: 20 Exp: 26
    const WIDTH = 8; // Beg: 8 Easy: 9 Inter: 15 Exp: 19
    const MINES_PERCENTAGE = 0.0875; // Beg: 7 Easy: 15 Inter: 40 Exp: 99
    minesGame = createGame(HEIGHT, WIDTH, MINES_PERCENTAGE);
    let cssRows = "";
    let cssColumns = "";
    for (let i = 1; i <= HEIGHT; i++) {
        cssColumns = "";
        $("#mines-grid").append(`<div id="r${i}" class="rows"></div>`);
        for (let j = 1; j <= WIDTH; j++){
            $(`#r${i}`).append(`<div id="c${j}" class="mine" ></div>`);
            cssColumns += "1fr ";
        }
        cssRows += "1fr ";
    }

    $('.mine').bind("mousedown", (event) => {
        clickMine(event);
    })
    

    $("#mines-grid").css({
        gridTemplateColumns: "1fr",
        gridTemplateRows: cssRows
    });

    $(".rows").css({
        gridTemplateColumns: cssColumns,
        gridTemplateRows: "1fr"
    });
    console.log(minesGame);
})
