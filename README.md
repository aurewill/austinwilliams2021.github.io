# Overview
    Our game is a two player iteration of the popular card game Spades. In this game,
you are pitted against an NPC (the computer) with the objective of scoring 200 points
first through a series of rounds. If your score reaches a negative score of 250, or
you receive two sets (a round in which you don't win at least as many hands as you
bid before the round), you lose the game. Beisdes winning hands, there are bags, nil,
and other ways to be penalized or awarded more ponts.

# Walkthrough

1.) Go to austinwilliams2021.github.io , Austin's github where our game is located.
2.) You will be redirected to our index.html page, where our rules will be displayed.
Carefully read through the rules and ensure that you understand the basics of the
game.

3.) Common questions:
What is a nil?
    A nil is when you bid zero with the intentions of not winning a single round.
Successful nils add 100 pts to your score, while unsuccessful ones deduct 100 points.

What is a bid?
    A bid is the total number of hands which you expect to win at the beginning of each
round. It is a number from 0-13 and should be based upon your hand and the chances
of you winning hands.If you receive cards that are likely to win a hand  (eg. many
high valued spades or King or Ace cards), then you should bid +1 for each that you
are likely to win.However, be careful to not overbid, as you will receive a set for
a round in which you do not win at least as many hands as you bid.Two sets equals game
lost and the first set subtracts 10*the number you bid (eg. bid 7 your score will go
back 10x7=70))Once you win as many cards as your bid, the goal is to stop at that
number and not win anymore hands.For every hand you win beyond the number you bid,
your number of bags increases by 1.Once your number of bags reaches 5, your score is
deducted 50 points and the bags counter resets.Bags are cumulative and overlap
through hands.As such, it is very important to carefully place your bid and to
carefully manage your cards throughout the game.

How does the spades suit work in the game?
    The other three suits function similarly to how you would expect, with higher
valued numbers of the same suit winning the hand (values from 2 to Ace). If you are
following (the computer plays first) then you must stay in the same suit as what was
played if you have a card of that suit in your hand (eg.8 diamonds was played,if you have
7 diamonds and no other diamonds you must play it and you will lose the hand).If you do
not have a card of the suit that was played AND you do not have a spades suit, then you
must play another card of another suit and will automatically lose the hand regardless
of the card value (eg. 7 diamonds was played and you only have 5 hearts and 4 clubs, you
must play one of those two) However, if you are playing second and you do not have the
non spade suit that was played, you can play a spades card, and, assuming spades cards
have not yet been played, you can now follow with spades, where as before you could only
follow with the other three suits.  If you choose to follow with a spade, then spades have
officially been "broken" and you can now lead with them (where as before you could only
start a hand with the other three suits) For the round in question, you will automatically
win the round regardless of the value as Spades trumps all other suits.Going forward,
you can lead  with a Spades suit, forcing the computer to play spades at which point the
hand functions similar to non spades hands. If you play first and play a non spades card,
the computer too can play a spades card and automatically win the hand (this is assuming
they do not have a card of the same suit in their hand)

# starting the game
4.) Once you have finished reading the rules (if you forget them, there will be a
chance to read an abbreviated version during the game), please click on the "Start
Game!" button in the lower left corner.

5.) This will redirect you to the game page, where you will be presented with two
rows with three columns in each. The first row tallies your score, the number of
bags you've accumulated, and keeps track of the number of sets you have.The second
row does the same but for the computer. Additionally, there is a prompt to start
your hand by drawing followed by five buttons: Rules, Score Round, Draw, Bid, and
Start Hand. The Rules button, again, shows you a quick review of the rules.
The score round button is used at the end of each round to calculate the total
points, bags, and sets that will be added or deducted from each users stats.The
Draw button is used in the beginning of each round to draw the cards that will be
used in each hand. The Bid button is used after both players have drawn 13 cards
each and is used to estimate the number of hands you expect you will win. The
Start Hand button is used to start each hand after the last hand was finished in
a round.

6.) To begin, please click the draw button upon which a prompt will display asking
you if you would like to pick the card which has been randomly chosen. IF this is
a card which you want, please click OK and the card will be added to your hand. If
you do not want this card, click cancel and the card will be discarded and another
card will automatically be chosen for you. Each time this happens, the computer will
also draw a card and discard one too. Continue drawing until you have reached 13 cards
and a message is displayed above USER: saying "The deck is empty, please click the Bid
button.

7.) At this point, please click the bid button. A prompt will come up asking you to bid
a number between 0 and 13, please do so keeping in mind the cards you have.

8.) After you have bid, please click the Start Hand button to commence the round (if you
try and click another button, you will be prompted to click STart Hand)

9.) Since it is your first round (and the program is designed to have the user play first
on even (0 2 4 etc.) rounds and the computer to play on odd (1,3,5)) you should play a non
spades suit. The computer will then play a card of the same suit and, depending on the
value of each card, you will either increase by the number of books you have or the
computer will increase.Books are the number of hands you have won in the round. You want
books to equal bid.

10.) Please hit start hand again. If you win, you lead again. If you lose, the computer
leads and an alert shows up saying what the computer has played  (this will not change
if you hit it again or if you change pages)Then after clicking out of the alert, a prompt
will show displaying the computer's play again and prompting you to play your card.BE SURE
TO TYPE THE EXACT LETTER/NUMBERS each card is represented by (case sensitive). This is
because our scoring method uses the decimal values of the characters through ASCII
representation. The winner will be determined and the books will be updated accordingly.
The card you and the computer played will be shown until the next round.

11.) Each time you play, your USER: hand will be depleted until you have exhausted all cards.
Continue playing until USER: is empty and you have gone through a total of 13 hands.
Be sure to monitor the books you have accumulated and make a plan if you are quickly
approaching your bid, or, if you are not close to it.

12.) After the USER: hand is depleted, a prompt will pop up showing that you should now score
the round. This means that the round is over and it is time to see the points, bags, and sets
you have received.

13.) Please click the Score Round button and, upon clicking, you will see the USER and COMP
SCORE: Bags: and Sets: update to reflect the previous round results.

14.) You should then repeat the process, drawing cards again, placing your bid,  going through
hands with the start hand button,and tallying the points earned until one of three things happens:

            1.) You and/or the computer reaches 200 points. This means that the game has ended and
            a winner or a tie game has been declared.

            2.) You and/or the computer reaches -250 points. This means that a loser has been
            declared and, by default, a winner too (unless both get -250 in which it is a tie game).
            The game ends here.

            3.) You and/or the computer reaches 2 sets. This means that the game has ended. If both
            get 2 sets, then it is a tie game. If only one player is set twice, then the other player
            wins. In the case where a min score is reached by one of the players BUT the other player
            has reached 2 sets, the sets trump the min score and the player who got two sets loses.

15.) After the game has ended and a victor decided, text appears telling the user to refresh the page
to play again.

16.) upon refreshing the page, the process begins again from step 5, beginning on the game page.
