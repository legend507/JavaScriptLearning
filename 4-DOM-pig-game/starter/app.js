/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

/*
// Math.random() yields a float valune between [0,1]
console.log(Math.random())

// to make the random valune between [1,6], do
console.log(Math.floor( Math.random() * 6 ) + 1)
*/

var activePlayer = 0;   // 0 = player1, 1 = player2

// to generate a var with a random dice value
var dice = Math.floor( Math.random() * 6 ) + 1;

// to modify DOM using document object, 1. use querySelector to choose the content, 2. use textContent to change the content
document.querySelector('#current-' + activePlayer).textContent = dice;
// or 2. use innerHTML to parse a line of HTML code 
document.querySelector('#current-' + activePlayer).innerHTML = '<em>' + dice + '</em>';

// to get current HTML content
var content = document.querySelector('#current-0').textContent;

// to hide the dice.img at first, note .dice is the class name
document.querySelector('.dice').style.display = 'none';