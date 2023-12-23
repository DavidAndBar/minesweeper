let minesGame;
let minesDiscovered = 0;
let timer;
var HEIGHT; // Beg: 10 Easy: 14 Inter: 20 Exp: 26
var WIDTH; // Beg: 8 Easy: 9 Inter: 15 Exp: 19
var MINES_NUMBER; // Beg: 7 Easy: 15 Inter: 40 Exp: 99
var mineFontSize;
var startTime;
var timerOn;
var highScoreBeg = {"high-scores": [ {"name": "", "time": ""}, {"name": "", "time": ""}, {"name": "", "time": ""}, {"name": "", "time": ""}, {"name": "", "time": ""}]};
var highScoreEasy = {"high-scores": [ {"name": "", "time": ""}, {"name": "", "time": ""}, {"name": "", "time": ""}, {"name": "", "time": ""}, {"name": "", "time": ""}]};
var highScoreInter = {"high-scores": [ {"name": "", "time": ""}, {"name": "", "time": ""}, {"name": "", "time": ""}, {"name": "", "time": ""}, {"name": "", "time": ""}]};
var highScoreExpert = {"high-scores": [ {"name": "", "time": ""}, {"name": "", "time": ""}, {"name": "", "time": ""}, {"name": "", "time": ""}, {"name": "", "time": ""}]};

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
    setTimeout(checkWin, 0, HEIGHT, WIDTH, MINES_NUMBER);
}

const checkCell = (rowNumber, columnNumber, HEIGHT, WIDTH, MINES_NUMBER,) => {
    let intRowNumber = rowNumber.slice(1);
    let intColumnNumber = columnNumber.slice(1);
    if (!minesGame) {
        minesGame = createGame(HEIGHT, WIDTH, MINES_NUMBER, intRowNumber, intColumnNumber);
        timerOn = setInterval(updateDisplay, 10);
    }
    let number = minesGame[intRowNumber][intColumnNumber];
    if (number == -1) {
        clearInterval(timerOn);
        showWindow(0, false, false);
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
        clearInterval(timerOn);
        let time = (parseFloat($('#timer').find('.value').text())).toFixed(2);
        showWindow(time, true, false);
        setTimeout(setHighScore, 50, time);
    }
}

const showWindow = (time, win, checkScore) => {
    if ($("#game-over-div").length == 0) {
        if (checkScore) {
            highScoreBeg = JSON.parse(localStorage.getItem("high-scores-beg"));
            $("body").append(`
            <div id="game-over-div"> 
                <h3>High Scores: </h3>
                <div class="w3-bar w3-black" style="display: flex; justify-content: center">
                    <button class="w3-bar-item w3-button" onclick="openScores('Beginner')">Beginner</button>
                    <button class="w3-bar-item w3-button" onclick="openScores('Easy')">Easy</button>
                    <button class="w3-bar-item w3-button" onclick="openScores('Intermediate')">Intermediate</button>
                    <button class="w3-bar-item w3-button" onclick="openScores('Expert')">Expert</button>
                </div>
                <div id="Beginner" class="high-scores">
                    <ul></ul>
                </div>
                <div id="Easy" class="high-scores" style="display:none">
                    <ul></ul>
                </div>
                <div id="Intermediate" class="high-scores" style="display:none">
                    <ul></ul>
                </div>
                <div id="Expert" class="high-scores" style="display:none">
                    <ul></ul>
                </div>
            </div>`);
            highScoreBeg["high-scores"].forEach((e) => {
                if (e.name != "") {
                    $("#Beginner ul").append(`<li>${e.name}: ${e.time} s</li>`)
                }
            })
        } else {
            $("body").append(`<div id="game-over-div"> <p>You ${win ? `won!</p>  <p>Time: ${time} s</p> </div>` : "lose!</p></div>"}`);
            $("#reset-icon img").attr("src", `../icons/${win ? "winner-icon" : "dead-face"}.svg`);
        }
        $("#mines-grid").css({"opacity": "0.4"});
        let leftPos = ($("#mines-grid").position().left)*1.0110605075 + parseFloat($("#mines-grid").css("border-width"));
        $("#game-over-div").css({
            top: $("#mines-grid").position().top,
            left: leftPos,
            width: parseFloat($("#mines-grid").css("width")) - parseFloat($("#mines-grid").css("border-width"))*2,
            height: parseFloat($("#mines-grid").css("height"))
        });
    }
};

function openScores(level) {
    var i;
    var x = document.getElementsByClassName("high-scores");
    highScoreBeg = JSON.parse(localStorage.getItem("high-scores-beg"));
    highScoreEasy = JSON.parse(localStorage.getItem("high-scores-easy"));
    highScoreInter = JSON.parse(localStorage.getItem("high-scores-inter"));
    highScoreExpert = JSON.parse(localStorage.getItem("high-scores-expert"));
    $(`#${level} ul`).empty();
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    document.getElementById(level).style.display = "block";
    if (level == "Beginner") {
        highScoreBeg["high-scores"].forEach((e) => {
            if (e.name != "") {
                $(`#${level} ul`).append(`<li>${e.name}: ${e.time} s</li>`)
            }
        })
    } else if (level == "Easy") {
        highScoreEasy["high-scores"].forEach((e) => {
            if (e.name != "") {
                $(`#${level} ul`).append(`<li>${e.name}: ${e.time} s</li>`)
            }
        })
    } else if (level == "Intermediate") {
        highScoreInter["high-scores"].forEach((e) => {
            if (e.name != "") {
                $(`#${level} ul`).append(`<li>${e.name}: ${e.time} s</li>`)
            }
        })
    } else if (level == "Expert") {
        highScoreExpert["high-scores"].forEach((e) => {
            if (e.name != "") {
                $(`#${level} ul`).append(`<li>${e.name}: ${e.time} s</li>`)
            }
        })
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
    let sizeMine = 40;
    switch (difficulty) {
        case "beginner":
            HEIGHT = 10; // Beg: 10 Easy: 14 Inter: 20 Exp: 26
            WIDTH = 8; // Beg: 8 Easy: 9 Inter: 15 Exp: 19
            MINES_NUMBER = 7; // Beg: 7 Easy: 15 Inter: 40 Exp: 99
            mineFontSize = "1.5em";
            break;
        case "easy":
            HEIGHT = 14; // Beg: 10 Easy: 14 Inter: 20 Exp: 26
            WIDTH = 9; // Beg: 8 Easy: 9 Inter: 15 Exp: 19q
            MINES_NUMBER = 15; // Beg: 7 Easy: 15 Inter: 40 Exp: 99
            mineFontSize = "1.3em";
            break;
        case "inter":
            HEIGHT = 20; // Beg: 10 Easy: 14 Inter: 20 Exp: 26
            WIDTH = 15; // Beg: 8 Easy: 9 Inter: 15 Exp: 19
            MINES_NUMBER = 40; // Beg: 7 Easy: 15 Inter: 40 Exp: 99
            mineFontSize = "1em";
            break;
        case "expert":
            HEIGHT = 26; // Beg: 10 Easy: 14 Inter: 20 Exp: 26
            WIDTH = 19; // Beg: 8 Easy: 9 Inter: 15 Exp: 19
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
        //gridTemplateColumns: `1fr`,
        gridTemplateRows: cssRows
    });

    $(".rows").css({
        gridTemplateColumns: cssColumns,
        //gridTemplateRows: `1fr`
    });
    $("#mines-grid").css({"opacity": "1"})

    $("#board").css({"width": `${sizeMine*WIDTH*1.30}px`})
}

const deleteGame = () => {
    $("#mines-grid").empty();
    $("#game-over-div").remove();
    minesGame = undefined;
}

const startover = () => {
    deleteGame();
    newGame($("#difficulty").val());
    clearInterval(timerOn);
    $('#timer').find('.value').text(0);
    $(".ui-selectmenu-button-text").remove();
    $("#reset-icon img").attr("src", "../icons/smile-face.svg");
}

function updateDisplay() {
    var value = parseFloat($('#timer').find('.value').text());
    value = value + 0.01;
    $('#timer').find('.value').text(value.toFixed(2));
};

const setHighScore = (time) => {
    highScoreBeg = JSON.parse(localStorage.getItem("high-scores-beg"));
    highScoreEasy = JSON.parse(localStorage.getItem("high-scores-easy"));
    highScoreInter = JSON.parse(localStorage.getItem("high-scores-inter"));
    highScoreExpert = JSON.parse(localStorage.getItem("high-scores-expert")); 
    let newhighScore = {"high-scores": []};
        if ($("#difficulty").val() == "beginner") {
            highScoreBeg["high-scores"].some(element => {
                if (element.time == "") {
                    element.time = time;
                    let newName = prompt("New Record!\n Insert your name: ");
                    element.name = newName == "" ? " " : newName;
                    localStorage.setItem("high-scores-beg", JSON.stringify(highScoreBeg));
                    return true;
                } 
                if (parseFloat(element.time) > time) {
                    let name = prompt("New Record!\n Insert your name: ");
                    newhighScore["high-scores"].push({"name": name, "time": time});
                    for (let i = newhighScore["high-scores"].length - 1; i < 5 - 1 ; i++) {
                        newhighScore["high-scores"].push({"name": highScoreBeg["high-scores"][i]["name"], "time": highScoreBeg["high-scores"][i]["time"]});
                    }
                    localStorage.setItem("high-scores-beg", JSON.stringify(newhighScore));
                    return true;
                }
                newhighScore["high-scores"].push({"name": element.name, "time": element.time});
            });
        } else if ($("#difficulty").val() == "easy") {
            highScoreEasy["high-scores"].some(element => {
                if (element.time == "") {
                    element.time = time;
                    element.name = prompt("New Record!\n Insert your name: ");
                    localStorage.setItem("high-scores-easy", JSON.stringify(highScoreEasy));
                    return true;
                } 
                if (parseFloat(element.time) > time) {
                    let name = prompt("New Record!\n Insert your name: ");
                    newhighScore["high-scores"].push({"name": name, "time": time});
                    for (let i = newhighScore["high-scores"].length - 1; i < 5 - 1 ; i++) {
                        newhighScore["high-scores"].push({"name": highScoreEasy["high-scores"][i]["name"], "time": highScoreEasy["high-scores"][i]["time"]});
                    }
                    localStorage.setItem("high-scores-easy", JSON.stringify(newhighScore));
                    return true;
                }
                newhighScore["high-scores"].push({"name": element.name, "time": element.time});
            });
        } else if ($("#difficulty").val() == "inter") {
            highScoreInter["high-scores"].some(element => {
                if (element.time == "") {
                    element.time = time;
                    element.name = prompt("New Record!\n Insert your name: ");
                    localStorage.setItem("high-scores-inter", JSON.stringify(highScoreInter));
                    return true;
                } 
                if (parseFloat(element.time) > time) {
                    let name = prompt("New Record!\n Insert your name: ");
                    newhighScore["high-scores"].push({"name": name, "time": time});
                    for (let i = newhighScore["high-scores"].length - 1; i < 5 - 1 ; i++) {
                        newhighScore["high-scores"].push({"name": highScoreInter["high-scores"][i]["name"], "time": highScoreInter["high-scores"][i]["time"]});
                    }
                    localStorage.setItem("high-scores-inter", JSON.stringify(newhighScore));
                    return true;
                }
                newhighScore["high-scores"].push({"name": element.name, "time": element.time});
            });
        } else if ($("#difficulty").val() == "expert") {
            highScoreExpert["high-scores"].some(element => {
                if (element.time == "") {
                    element.time = time;
                    element.name = prompt("New Record!\n Insert your name: ");
                    localStorage.setItem("high-scores-expert", JSON.stringify(highScoreExpert));
                    return true;
                } 
                if (parseFloat(element.time) > time) {
                    let name = prompt("New Record!\n Insert your name: ");
                    newhighScore["high-scores"].push({"name": name, "time": time});
                    for (let i = newhighScore["high-scores"].length - 1; i < 5 - 1 ; i++) {
                        newhighScore["high-scores"].push({"name": highScoreExpert["high-scores"][i]["name"], "time": highScoreExpert["high-scores"][i]["time"]});
                    }
                    localStorage.setItem("high-scores-expert", JSON.stringify(newhighScore));
                    return true;
                }
                newhighScore["high-scores"].push({"name": element.name, "time": element.time});
            });
        }
} 

const showHighScores = () => {

}


$(document).ready(() => {
    window.addEventListener("contextmenu", e => e.preventDefault());

    if (!!!localStorage.getItem("high-scores-beg") || !!!localStorage.getItem("high-scores-easy") || !!!localStorage.getItem("high-scores-inter") || !!!localStorage.getItem("high-scores-expert")) {
        localStorage.setItem("high-scores-beg", JSON.stringify(highScoreBeg));
        localStorage.setItem("high-scores-easy", JSON.stringify(highScoreEasy));
        localStorage.setItem("high-scores-inter", JSON.stringify(highScoreInter));
        localStorage.setItem("high-scores-expert", JSON.stringify(highScoreExpert));
    } else {
        highScoreBeg = JSON.parse(localStorage.getItem("high-scores-beg"));
        highScoreEasy = JSON.parse(localStorage.getItem("high-scores-easy"));
        highScoreInter = JSON.parse(localStorage.getItem("high-scores-inter"));
        highScoreExpert = JSON.parse(localStorage.getItem("high-scores-expert")); 
    }

    newGame("easy"); // Change to easy
    $("#difficulty").on("change", () => {
        startover();
    } );
    $(".ui-body-a").remove();
    $(".ui-selectmenu-button-text").remove();
    $(".ui-page, .ui-page-theme-a, .ui-page-active").css("min-height", "auto");

    $(window).resize(() => {
        let leftPos = ($("#mines-grid").position().left);
        
        $("#game-over-div").css({
            top: $("#mines-grid").position().top,
            left: leftPos,
            width: parseFloat($("#mines-grid").css("width")) - parseFloat($("#mines-grid").css("border-width"))*2,
            height: parseFloat($("#mines-grid").css("height"))
        });
    });

})
