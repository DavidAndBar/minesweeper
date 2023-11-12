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

$(document).ready(() => {
    const HEIGHT = 14; // Beg: 10 Easy: 14 Inter: 20 Exp: 26
    const WIDTH = 9; // Beg: 8 Easy: 9 Inter: 15 Exp: 19
    const MINES_PERCENTAGE = 0.70; // Beg: 7 Easy: 15 Inter: 40 Exp: 99
    const minesList = createGame(HEIGHT, WIDTH, MINES_PERCENTAGE);
    let cssRows = "";
    let cssColumns = "";
    for (let i = 1; i <= HEIGHT; i++) {
        cssColumns = "";
        $("#mines-grid").append(`<div id="row${i}" class="rows"></div>`);
        for (let j = 1; j <= WIDTH; j++){
            $(`#row${i}`).append(`<div id="column${j}" class="mine"></div>`);
            cssColumns += "1fr ";
        }
        cssRows += "1fr ";
    }

    

    $("#mines-grid").css({
        gridTemplateColumns: "1fr",
        gridTemplateRows: cssRows
    });

    $(".rows").css({
        gridTemplateColumns: cssColumns,
        gridTemplateRows: "1fr"
    });
    console.log(minesList);

})




