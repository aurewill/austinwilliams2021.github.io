    2-Player Spades uses javascript, html, and css to bring to life a game that
is almost never played with two players. Spades is traditionally a four player
game with two teams of two. The whole deck is dealt out and you rarely play
online against a computer. 2-Player Spades is very different, but also similar
in many ways. See README.md for details on how the game is played.
    Our game relies on gamestates being passed in and out of functions that
update the current gamestate.  Each gamestate is stored as a javascript Object
with key-value pairs (see line 13 in spades.js for the gamestate's initial
declaration).  The inital gamestate is passed into our MAIN function where we
find multiple event handlers that encompass every possible action in the game
(dealing, bidding, playing, and scoring).  Each event handler is mapped to a
distinct button representing a game action, and if a button is clicked, the
current gamestate is checked by conditions that tell the program to either
provide instruction to the user, if the button that the user is clicking is
not supposed to call on it's associated function at that time, or to call on
that button's associated function.
    The user will find that the only button that continues the game after the
page has loaded is the "Deal" button which calls on deal() if the current
gamestate passes the necessary conditions.  Deal() takes as input the current
gamestate and returns as output an updated gamestate with new arrays for the
user and computer hands.  The Object "Dict" in main() is updated from the
gamestate returned in deal() (see line 37 in spades.js).
    After the deal button is clicked 13 times (because each player gets 13
cards and the remaining 26 cards are discarded as the button is pressed 13
times) the user will find instructions to bid by clicking the "Bid" button.
Again, the gamestate has to pass the necessary conditions for the bid button to
call on bid(). This is a common scenario in our game where our buttons are
always "listening" and ready to call on our functions. But if the gamestate
isn't just write, a clicked button will provide instruction to the user on what
to do next. After deal, the gamestate will always pass the conditions in place
for the bid button to call on bid().  Like the relationship between the deal
button and deal(), when bid() is called, it takes the current gamestate from
main() as input returns an updated gamestate assigned to "Dict" (see line 62
in spades.js).
    Once the user and computer have successfully bid, the gamestate will now
pass the conditions that allow for game() to be called on when the "Start Hand"
button is clicked. Like the deal button, the Start Hand button needs to be
clicked 13 times since 13 hands played makes up one round of the game. When the
current gamestate passes the necessary conditions and the Start Hand button is
clicked, game() will be called on which takes the current gamestate as input and
returns an updated gamestate, assigning this new gamestate to "Dict" (see line
86 in spades.js). Game() is rather lengthy because there's many rules in Spades
that have to be accounted for, so there are many conditions in game() checking
the card that the user inputted. There's also a lot of code dictating how the
computer will lead a hand or follow a hand. (We won't get into the details of
game() too much as it is heavily commented and following the code with the
comments is a much better way to grasp what's going on in the function.) Game
retrieves one card from both the user and computer each time it is called. Once
two cards are accepted, game() passes those two cards into ranking() where a
best card is determined and returned back to game().  Game() associates that
card with the player it came from and marks that player the winner of that hand.
Game adds 1 to the winning player's book count and sets the "player" key
accordingly to indicate who will lead once Start Hand is clicked again, if there
are still cards to be played.  Game() also removes the played cards from the
user and computer hands. All of this variable manipulation takes place in the
Object that was passed into game(). At the end of game(), the function returns
an updated gamestate as stated previously.
    After game() is successfuly called on 13 times via the Start Hand button,
the user will be instructed to score his/her hand by clicking the "Score"
button.  The score button checks that the current gamestate passes necessary
conditions to call upon score(). Score takes as input the current gamestate and
returns an updated gamestate.  First, score will calculate new scores and new
bags and sets (if any) updating the Object passed into score().  Score() also
keeps track of each round's max and min score in order to later compare them
to MAXSCORE and MINSCORE (constants at top of spades.js) to determine if the
game is over.  Score() resets many keys to their original values (see
lines 954-961 in spades.js) since a new round warrants original states. We
specifically have to make a deep copy of DECK (line 954 in spades.js) making
use of the lodash module, because otherwise, the deck at the beginning of a
new round would be empty since the "deck" key's value in MASTERDICT (line 13)
acts like a pointer to COPYDECK1 (line 10) and when we deplete the deck in
deal(), we're also depleting COPYDECK1. Lastly, score() checks if the game is
over.  If it isn't, it updates the html representing the scoring information.
If it is, it passes the current gamestate into gameOver() which determines the
winner and updates the scoring html accordingly.  Either way score() will return
the current gamestate and assign it to "Dict" (see line 100 in spades.js).
    If the game isn't yet over, the user will be instructed to draw another hand
of 13 and repeat the process that we've just outlined. If the game is over, the
current gamestate will not pass the conditions required to call on any other
functions.  The user will also receive instructions to reload the page if he/she
wants to play again.