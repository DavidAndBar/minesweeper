let minesGame;
let minesDiscovered = 0;
let timer;
var HEIGHT; // Beg: 10 Easy: 14 Inter: 20 Exp: 26
var WIDTH; // Beg: 8 Easy: 9 Inter: 15 Exp: 19
var MINES_NUMBER; // Beg: 7 Easy: 15 Inter: 40 Exp: 99
var mineFontSize;

const createGame = (HEIGHT, WIDTH, MINES_NUMBER, intRowNumber, intColumnNumber) => {

    let minesNumber = MINES_NUMBER;

    let minesList = [];
    let minesRow = [];
    let number = 0;
    let x;
    let y;

    // Creating the array as a template full of zeros.
    for (let i = 0; i < HEIGHT + 2; i++) {
        for (let j = 0; j < WIDTH + 2; j++) {
            minesRow[j] = number;
        }
        minesList[i] = [...minesRow]; // Passing the array by reference.
    }
    intRowNumber = parseInt(intRowNumber);
    intColumnNumber = parseInt(intColumnNumber);
    // Choosing randomly where the mines are.
    while (minesNumber > 0) {
        x = Math.round(Math.random()*(HEIGHT - 1)) + 1;
        y = Math.round(Math.random()*(WIDTH - 1)) + 1;
        surrondings =   !( x == intRowNumber - 1 && y == intColumnNumber - 1) && 
                    !( x == intRowNumber - 1 && y == intColumnNumber) && 
                    !( x == intRowNumber - 1 && y == intColumnNumber + 1) && 
                    !( x == intRowNumber && y == intColumnNumber - 1) && 
                    !( x == intRowNumber && y == intColumnNumber + 1) &&
                    !( x == intRowNumber + 1 && y == intColumnNumber - 1) &&
                    !( x == intRowNumber + 1 && y == intColumnNumber) &&
                    !( x == intRowNumber + 1 && y == intColumnNumber + 1);
        if (minesList[x][y] != -1 && !( x == intRowNumber && y == intColumnNumber) && surrondings) {
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


const clickMine = (event, HEIGHT, WIDTH, MINES_NUMBER) => {
    let rowNumber = event.target.parentElement.id;
    let columnNumber = event.target.id;

    if (event.which == 1 && $(`#${rowNumber} #${columnNumber}`).val() != "X") {
        leftClick(rowNumber, columnNumber);
    } else if (event.which == 3) {
        flagMine(rowNumber, columnNumber);
    }
}

const leftClick = (rowNumber, columnNumber) => {
    checkCell(rowNumber, columnNumber, HEIGHT, WIDTH, MINES_NUMBER);
    checkWin(HEIGHT, WIDTH, MINES_NUMBER);
}

const checkCell = (rowNumber, columnNumber, HEIGHT, WIDTH, MINES_NUMBER,) => {
    let intRowNumber = rowNumber.slice(1);
    let intColumnNumber = columnNumber.slice(1);
    if (!minesGame) {
        minesGame = createGame(HEIGHT, WIDTH, MINES_NUMBER, intRowNumber, intColumnNumber);
    }
    let number = minesGame[intRowNumber][intColumnNumber];
    if (number == -1) {
        $("body").append('<div id="game-over-div"> <p>You lose, <span onclick="startover()"> try again! </span></p></div>');
        $("#mines-grid").css({"opacity": "0.4"})
        $("#game-over-div").css({
            top: $("#mines-grid").position().top,
            left: $("#mines-grid").position().left + parseFloat($("#mines-grid").css("margin-left")),
            width: parseFloat($("#mines-grid").css("width")),
            height: parseFloat($("#mines-grid").css("height"))
        });
    } else if (number == 0) {
        $(`#${rowNumber} #${columnNumber}`).val(number).addClass("mine-opened");
        
        openSurrondings(rowNumber, columnNumber, HEIGHT, WIDTH); // here the logic to check cells around.
    } else {
        $(`#${rowNumber} #${columnNumber}`).text(number).val(number).addClass("mine-opened");
        if (number == 1) {
            $(`#${rowNumber} #${columnNumber}`).css({
                color: 'green',
            });
        } else if (number == 2) {
            $(`#${rowNumber} #${columnNumber}`).css({
                color: 'blue',
            });
        } else if (number == 3) {
            $(`#${rowNumber} #${columnNumber}`).css({
                color: 'red',
            });
        } else if (number == 4) {
            $(`#${rowNumber} #${columnNumber}`).css({
                color: 'purple',
            });
        } else if (number == 5) {
            $(`#${rowNumber} #${columnNumber}`).css({
                color: 'darkblue',
            });
        } 
    }
}

const openSurrondings = (rowNumber, columnNumber, HEIGHT, WIDTH) => {
    let rn = parseInt(rowNumber.slice(1)); // i height, j width
    let cn = parseInt(columnNumber.slice(1));
    if (rowNumber != `r-1` && columnNumber != `c-1`) {
        for (let i = rn - 1; i <= rn + 1; i++) {
            for(let k = cn - 1; k <= cn + 1; k++){
                if (!(k == cn && i == rn) && !(k==0 || i == 0) && !(i > HEIGHT || k > WIDTH)) { //I'm here, im missing to test the function and add the recursivity.
                    if ($(`#r${i} #c${k}`).val().length == 0) {
                        checkCell(`r${i}`, `c${k}`, HEIGHT, WIDTH);
                    }
                }
            }
        }
    }
}

const checkWin = (HEIGHT, WIDTH, MINES_NUMBER) => {
    let numberDiscovered = 0;
    for (let i = 1; i <= HEIGHT ; i++) {
        for (let j = 1 ; j <= WIDTH; j++) {
            if ($(`#r${i} #c${j}`).val() != "X" && (!!$(`#r${i} #c${j}`).val() || $(`#r${i} #c${j}`).val() == '0' )) {
                numberDiscovered++;
            }
        }
    }
    if (numberDiscovered == WIDTH * HEIGHT - MINES_NUMBER) {
        $("body").append('<div id="game-over-div"><p>You Won, <span onclick="startover()"> play again! </span></p></div>');
        $("#mines-grid").css({"opacity": "0.4"})
        $("#game-over-div").css({
            top: $("#mines-grid").position().top,
            left: $("#mines-grid").position().left + parseFloat($("#mines-grid").css("margin-left")),
            width: parseFloat($("#mines-grid").css("width")),
            height: parseFloat($("#mines-grid").css("height"))
        });
    }
}

const flagMine = (rowNumber, columnNumber) => {
    let minesDiscovered = parseInt($('#div-mines-discovered').text());
    if (!$(`#${rowNumber} #${columnNumber}`).val()) {
        $(`#${rowNumber} #${columnNumber}`).val("X");
        $(`#${rowNumber} #${columnNumber}`).css({
            backgroundImage: "url('../icons/skull-flag.svg')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center"
        });
        minesDiscovered--;
        $('#div-mines-discovered').text(minesDiscovered);
    } else if ($(`#${rowNumber} #${columnNumber}`).val() == "X") {
        $(`#${rowNumber} #${columnNumber}`).val("");
        $(`#${rowNumber} #${columnNumber}`).css({
            backgroundImage: "none"
        });
        minesDiscovered++;
        $('#div-mines-discovered').text(minesDiscovered);
    }
}





const newGame = (difficulty) => {
    let sizeMine = 45;
    switch (difficulty) {
        case "beginner":
            HEIGHT = 8; // Beg: 10 Easy: 14 Inter: 20 Exp: 26
            WIDTH = 10; // Beg: 8 Easy: 9 Inter: 15 Exp: 19
            MINES_NUMBER = 7; // Beg: 7 Easy: 15 Inter: 40 Exp: 99
            mineFontSize = "2em";
            break;
        case "easy":
            HEIGHT = 9; // Beg: 10 Easy: 14 Inter: 20 Exp: 26
            WIDTH = 14; // Beg: 8 Easy: 9 Inter: 15 Exp: 19q
            MINES_NUMBER = 15; // Beg: 7 Easy: 15 Inter: 40 Exp: 99
            mineFontSize = "1.3em";
            break;
        case "inter":
            HEIGHT = 15; // Beg: 10 Easy: 14 Inter: 20 Exp: 26
            WIDTH = 20; // Beg: 8 Easy: 9 Inter: 15 Exp: 19
            MINES_NUMBER = 40; // Beg: 7 Easy: 15 Inter: 40 Exp: 99
            mineFontSize = "1em";
            break;
        case "expert":
            HEIGHT = 19; // Beg: 10 Easy: 14 Inter: 20 Exp: 26
            WIDTH = 26; // Beg: 8 Easy: 9 Inter: 15 Exp: 19
            MINES_NUMBER = 99; // Beg: 7 Easy: 15 Inter: 40 Exp: 99
            mineFontSize = "0.8em";
            break;
        default:
            break;
    }

    $('#div-mines-discovered').text(MINES_NUMBER);
    let cssRows = "";
    let cssColumns = "";
    for (let i = 1; i <= HEIGHT; i++) {
        cssColumns = "";
        $("#mines-grid").append(`<div id="r${i}" class="rows"></div>`);
        for (let j = 1; j <= WIDTH; j++){
            $(`#r${i}`).append(`<div id="c${j}" class="mine" ></div>`);
            cssColumns += `${sizeMine}px `;
        }
        cssRows += `${sizeMine}px `;
    }

    $('.mine').bind("mousedown", (event) => {
        clickMine(event, HEIGHT, WIDTH, MINES_NUMBER);
    })
    
    $('.mine').on("taphold",(event) => {
        let rowNumber = event.target.parentElement.id;
        let columnNumber = event.target.id;
        flagMine(rowNumber, columnNumber);
    });

    $('.mine').css({
        fontSize: mineFontSize,
    })

    $("#mines-grid").css({
        gridTemplateColumns: `1fr`,
        gridTemplateRows: cssRows
    });

    $(".rows").css({
        gridTemplateColumns: cssColumns,
        gridTemplateRows: `1fr`
    });
    $("#mines-grid").css({"opacity": "1"})
}

const deleteGame = () => {
    $("#mines-grid").empty();
    $("#game-over-div").remove();
    minesGame = undefined;
}

const startover = () => {
    deleteGame();
    newGame($("#difficulty").val());
}

$(document).ready(() => {
    window.addEventListener("contextmenu", e => e.preventDefault());
    newGame("easy"); // Change to easy
    $("#difficulty").on("change", () => {
        deleteGame();
        newGame($("#difficulty").val());
    } );
    $(".ui-body-a").remove();
})
