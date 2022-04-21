 //State of the game
var state = [[0,1,2],[3,4,5],[6,7,8]];
var moves = []; //Used to decide cpu move on easy (easier to handle it as it's 1d)
var gameOver = false;
var turn = 'X';
var line = null; //Line drawn at game end

//Game settings
var difficulty = 0; // Value 0 to 2 Easy - Medium - Impossible
var diffText = 'AI Wants<br>to Lose'; //Text output for current difficulty

//Ai Properties
var ai = true; // Ai on/off
var aiTurn = false; // Ai wait to play

//Surfaces to edit
var board = document.getElementById('board'); //Main game board
var aiDiffText = document.getElementById('aiDiff'); //Difficulty heading display
var aiDiffLevelText = document.getElementById('aiDiffLvl') //Difficulty level display
var p1h1 = document.getElementById('whoIsP1'); // Player 1 currently playing as ( X or O) display
var p1Score = document.getElementById('P1Score');//Player 1 score disaply
var p2h1 = document.getElementById('whoIsP2'); // Player 2 currently playing as ( X or O)
var p2Score = document.getElementById('P2Score'); // Player 2 score display
var diffButton = document.getElementById('difficultyButton'); //Ai Difficulty button (when it needs to be displayed/ hidden)
var diffLvlDiv = document.getElementById('diffLvl'); //Ai Difficulty level display

//Player Info
var p1 = {
    name: 'Player 1',
    score: 0,
    playingAs: 'X'
}
var p2 = {
    name: 'Ai Player',
    score: 0,
    playingAs: 'O'
}

/**
 * Chekc all values in array eqaul
 * @param {*} arr Array
 * @returns {boolean}
 */
const allEqual = arr => arr.every( v => v === arr[0] )

// Setup game board
function setup(){

    //Create grid
    for(x = 0; x < 3; x++){
        let row = document.createElement('div');
        row.classList.add('row')
        row.setAttribute('id','row'+(x+1))
        for(y=0; y < 3; y++){
            let square = document.createElement('div');
            square.setAttribute('id',`(${x},${y})`);
            square.classList.add('markSquare');
            square.setAttribute('onClick',`handleInput("(${x},${y})")`);
            moves.push(`(${x},${y})`); //Populate moves array with coordinates
            row.appendChild(square);
        }
        updateInfo();
        board.appendChild(row);
    }
}
/**
 * Handle user click on board
 * @param {string} pos position clicked
 */
function handleInput(pos){
    //Ignore clicks if game over
    if(!gameOver && !aiTurn){
        //Update the state of the game
        updateState(pos);
        // Check winner
        checkWinner();
        //Switching Players or AI turn
        if(!gameOver){

            if(ai){
                //AI play at set difficulty and block human play
                aiTurn = true;
                cpuPlay(difficulty);
                aiTurn = false;
            }
            //Switch players (AI switches players to itself internally)
            //If 2 humans are playing, it's the next player
            //If 1 human is playing, it goes back to them
            turn = switchPlayer(turn);
        }

    }
}

/**
 * Alternate between 'X' and 'O'
 * @param {*} turn 
 * @returns {string}
 */
function switchPlayer(turn){
    if (turn == 'X'){
        turn = 'O';
    }else{
        turn = 'X';
    }
    return turn;
}

/**
 * Update state of the game (display and internally)
 * @param {string} pos position clicked
 */
function updateState(pos){
    //Remove current position from moves
    moves = moves.filter(e => e !== pos);
    //select and update pdate the clicked square
    let square = document.getElementById(pos);
    let mark = document.createElement('div');
    square.appendChild(mark);
    //Make the square unclickable
    square.setAttribute('onClick',``);
    //Add the relevant mark to the square
    if(turn == 'O'){
        mark.classList.add('spin');
        mark.classList.add('circle');
        mark.classList.add('oDraw');
    }else{
        mark.classList.add('xDraw');
    }
    //Update the state array
    pos = pos.replace('(','');
    pos = pos.replace(')','');
    let x,y;
    [x,y] = pos.split(',');
    x = parseInt(x)
    y = parseInt(y)
    state[x][y] = turn;
}
/**
 * Check if the game is over
 */
function checkWinner(){
    //Horizontal or vertical win
    res = checkTernminal();
    if(res){
        endRound(res);
    }
}
/**
 * Check if a terminal condition is reached
 * Used in checkWinner to end game
 * Used in minimax to determine score
 * @returns Terminal condition or null
 */
function checkTernminal(){
    //Transpose state to check for vertical wins (columns)
    let transpose = state[0].map((_, colIndex) => state.map(row => row[colIndex]));
    //Iterate over columns. If all symbols the same game over
    for(i = 0; i < transpose.length; i++){
        if(allEqual(transpose[i])){
            //set line id vertical + column number
            line = 'v' + i;
            return 'Win';
        }
    }
    //Iterate over rows. If all symbols the same game over
    for(i = 0; i < transpose.length; i++){
        if(allEqual(state[i])){
            //set line id horizontal + column number
            line = 'h' + i;
            return 'Win';
        }
    }
    //Diagonal win from top left
    let first = state[0][0];
    let last = state[0][state.length - 1];
    for(i = 1; i < state.length; i++){
        if(!(state[i][i] == first)){
            break
        }
        if(i == state.length - 1){
            line = 'd1';
            return 'Win';
        }
    }
    //Diagonal win from top right
    for(i = 0; i < state.length; i++){
        if(!(state[i][state.length - i - 1] == last)){
            break;
        }
        if(i == state.length - 1){
            line = 'd2';
            return 'Win';
            
        }
    }
    //Game Drawn
    //Set draw to true, if any row contains an integer (it's original value), draw is false (open space available)
    for( let i = 0; i < 3; i++){
        draw = true;
        for(let j= 0; j < 3; j++){
            if (!(isNaN(state[i][j]))){
                draw = false;
            }
        }
        if(!(draw)){
            break;
        }
    }
    if((draw)){
        return 'Draw';
    }
}
/**
 * 
 * @param {string} res Game Ending Condition
 */
function endRound(res){
    //Block further actions
    gameOver = true;
    var winLine = document.getElementById('line');
    //Update info for the winner
    if (res == 'Win'){
        winLine.classList.add(line);
        if(turn == p1.playingAs){
            p1.score += 1;
        }
        else{
            p2.score += 1
        }
    }
    //Update displayed information
    p1Score.innerHTML = p1.score;
    p2Score.innerHTML = p2.score;
    //Switch Player symbols
    p2.playingAs=switchPlayer(p2.playingAs);
    p1.playingAs=switchPlayer(p1.playingAs);
}
/**
 * 
 * @param {number} difficulty How hard does the AIr go 
 */
function cpuPlay(difficulty){
    //Switch the current player (turn) to the AI
    turn = p2.playingAs;
    //Make an easy move (AI never wins)
    if (difficulty == 0){
        move = pro(turn,-1,0,1);
    }
    //Make a random move
    else if (difficulty == 1){
        move =  moves[Math.floor(Math.random() * moves.length)];
    }
    //Make a medium move
    else if (difficulty == 2){
        move = pro(turn,-1,0,1);
    }
    //Make a difficult move (Never lose)
    else if (difficulty == 3){
        move = pro(turn,1,0,-1);
    }
    //Update board based on AI's chosen move
    updateState(move);
    checkWinner();
}

/**
 * AI make a move based on parameters chosen and recursive minmax
 * @param {string} playingAs Is AI X or O
 * @param {number} wScore  Score assigned for win
 * @param {number} dScore Score assigned for draw 
 * @param {number} lScore Score assigned for loss 
 * @returns 
 */
function pro(playingAs,wScore,dScore,lScore){
    //This whole function is essentially poorly written minmax
    //Set the playing symbols locally for human and Ai
    let human;
    if (playingAs == 'X'){
        human = 'O';
    }else{human='X'}
    //Assign a local turn so global turn is in tact
    let localTurn = switchPlayer(turn);
    let num = 0; // Linear counter for nested for loop
    let bestScore = -Infinity; //Set lowest best score
    let bestMove = null; //No best move set
    //Iterate over empty spaces and choose the best
    for( let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            if(state[i][j] !== "X" && state[i][j] !== "O"){
                state[i][j] = playingAs; //play the move and test it
                let score = minmax(state, 0, false, localTurn);
                console.log("Score = ", score)
                if (score > bestScore){
                    bestScore = score;
                    bestMove = `(${i},${j})`;
                }
                state[i][j] = num;
            }
            num+=1;
        }
    }
    /**
     * Recursive tree building with minmax
     * @param {Array} state current state
     * @param {number} depth depth of current branch
     * @param {boolean} isMaximising maximising or minimising
     * @returns bestMove
     */
    function minmax(state, depth, isMaximising){
        //Check if game won
        res = checkTernminal();
        //Terminate recursive calls nd go back up tree
        if(res){
            if(!isMaximising && res=='Win'){
                score = wScore;
            } else if (isMaximising && res=='Win'){
                score = lScore;
            } else if (res == 'Draw'){
                score = dScore;
            }
            return score;
        }
        //Computer turn maximising
        if (isMaximising){
            let num = 0;
            let bestScore = -Infinity;
            //Iterate over empty spaces
            for(let i = 0; i < 3; i++){
                for(let j = 0; j < 3; j++){
                    if(state[i][j] !== "X" && state[i][j] !== "O"){
                        state[i][j] = playingAs;
                        let score = minmax(state, depth + 1, false);
                        bestScore = Math.max(score, bestScore)
                        state[i][j] = num;
                    }
                    num+=1;
                }
            }
            return bestScore; //Pass highest score up tree
        }
        //Opponents turn 
        else{
            let num = 0;
            let bestScore = Infinity;
            //Iterate over empty spaces
            for(let i = 0; i < 3; i++){
                for(let j = 0; j < 3; j++){
                    if(state[i][j] !== "X" && state[i][j] !== "O" ){
                        state[i][j] = human;
                        let score = minmax(state, depth + 1, true);
                        bestScore = Math.min(score, bestScore)
                        state[i][j] = num;
                    }
                    num+=1;
                }
            }
            return bestScore; //Pass lower score up tree
        }
    }
    return bestMove;
}
/**
 * Turn Ai on/ off and hide/display Ai related info
 * Toggle Player 2 name between "AI Player" and "Player 2"
 * Reset game
 */
function toggleAi(){
    if (ai){
        ai = false;
        p2.name = 'Player 2';
        diffButton.style.display = 'none';
        diffLvl.style.display = 'none';
        

    }else{
        ai = true;
        p2.name = 'Ai Player';
        diffButton.style.display = 'block';
        diffLvl.style.display = 'block';
    }
    //Reset the game
    p1.score = 0;
    p2.score = 0;
    reset();
}
/**
 * Restart a new game
 * Scores are not reset
 */
function reset(){
    //Set the following to their original values
    state = [[0,1,2],[3,4,5],[6,7,8]];
    moves = [];
    gameOver = false;
    //Clear the board
    board.innerHTML = '<div class="line" id="line"></div>';
    turn = 'X';
    line = null;
    //Restart setup
    setup();
    //Upadte displayed info
    updateInfo();
    if (ai && p2.playingAs=='X'){
        cpuPlay(difficulty);
        turn = switchPlayer(p2.playingAs);
    }
}
/**
 * Change AI difficulty level
 * Reset() game 
 * Scores don't change
 */
function changeDifficulty(){
    if (difficulty < 3){
        difficulty +=1
    }else {difficulty = 0}

    if(difficulty ==0){
        diffText ='AI Wants<br>to Lose';
    }else if (difficulty == 1){
        diffText = "Easy";
    }else if(difficulty == 2){
        diffText='Medium';
    }
    else{
        diffText='Impossible<br>to Win';
    }
    reset();
}

/**
 * Update the UI information displayed
 */
function updateInfo(){
    //Hide/Displaye Ai buttons and info
    if(ai){
        aiDiffText.style.display = 'block';
        aiDiffLevelText.style.display = 'block';
        aiDiffLevelText.innerHTML = diffText;
    }else{
        //Hide Ai info
        aiDiffText.style.display = 'none';
        aiDiffLevelText.style.display = 'none';
    }
    //Update displayed player info
    p1h1.innerHTML = `${p1.name} (${p1.playingAs}):`;
    p1Score.innerHTML = p1.score;
    p2h1.innerHTML = `${p2.name} (${p2.playingAs}):`;
    p2Score.innerHTML = p2.score;

}

setup();