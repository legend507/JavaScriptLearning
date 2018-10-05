/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

var activePlayer = 0;   // 0 = player1, 1 = player2
var roundScore = 0;
var scores = [0,0];

reset();

// when "roll" button is clicked
//  the following line adds event listener to the "roll" button
document.querySelector('.btn-roll').addEventListener('click', function() {
    // 1. generate a random number [1,6]
    var dice = Math.floor( Math.random() * 6 ) + 1;

    // 2. display the corresponding dice img (querySelector interact with .css file)
    var diceDOM = document.querySelector('.dice');
    diceDOM.style.display = 'block';
    diceDOM.src = 'dice-' + dice + '.png';

    // 3. update the "round score", if the dice != 1
    if ( dice == 1 ) {
        // when dice result is 1,
        switchActivePlayer(false);
    } else {
        roundScore += dice;

        // to dispplay the current roundScore
        //  method 1 (getElementById interact with HTML, faster than querySelector)
        document.getElementById('current-' + activePlayer).textContent = roundScore;
        //  method 2 (innerHTML)
        //document.querySelector('#current-' + activePlayer).innerHTML = '<em>' + dice + '</em>';
    }
});

// when "hold" button pressed
document.querySelector('.btn-hold').addEventListener('click', function() {
    switchActivePlayer(true);
});

document.querySelector('.btn-new').addEventListener('dblclick', reset);

function reset() {
    // to hide the dice.img at first, note .dice is the class name
    //  the following line modifies the property of "<img src="dice-5.png" alt="Dice" class="dice">" in HTML
    document.querySelector('.dice').style.display = 'none';

    // initialize the socres of Player 1 & 2
    document.getElementById('score-0').textContent = 0;
    document.getElementById('score-1').textContent = 0;
    document.getElementById('current-0').textContent = 0;
    document.getElementById('current-1').textContent = 0;

    activePlayer = 0;
    roundScore = 0;
    scores = [0,0];
}

function switchActivePlayer(isHold) {
    // is 'Hold' is pressed, add current round score to score
    if (isHold) {
        scores[activePlayer] += roundScore;
        document.getElementById('score-' + activePlayer).textContent = scores[activePlayer];

        // check if score >= 100
        if (scores[activePlayer] >= 100) {
            //alert('Player ' + (activePlayer + 1) + ' is the Winner!');

            // apply 'winner' class to .player-?-panel 
            document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
            document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
            
            reset();
            return;
        }
    }

    //  1. clear current player's roundScore
    roundScore = 0;
    //  2. change player GUI to 0
    document.getElementById('current-' + activePlayer).textContent = roundScore;
    //  3. remove the active marker on GUI
    document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
    //  4. switch active player
    activePlayer = 1 - activePlayer;
    //  5. add the active marker on GUI
    document.querySelector('.player-' + activePlayer + '-panel').classList.add('active');

    /* instead of using 'remove' & 'add', use 'toggle' for simplicity */
}
