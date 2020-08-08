// CONSTANTS
const MAXSCORE = 200; // Maximum score which will determine winner
const MINSCORE = -250; // Minimum score which will determine loser
const CARDMAX = 394; // Max ASCII value of any card in DECK

// Deck of cards
var DECK = ["D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "D-J", "D-Q", "D-Kg", "D-Ace", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10", "C-J", "C-Q", "C-Kg", "C-Ace", "H2", "H3", "H4", "H5", "H6", "H7", "H8", "H9", "H10", "H-J", "H-Q", "H-Kg", "H-Ace", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10", "S-J", "S-Q", "S-Kg", "S-Ace"];

// Deep copy of deck
var COPYDECK1 = _.cloneDeep(DECK);

// GAMESTATE
var MASTERDICT = {"deck":COPYDECK1,"num_round":0,"spades_played":false,"p1":[],"p2":[],"p1Bid":-1,"p2Bid":-1,"p1Books":0,"p2Books":0,"p1Score":0,"p2Score":0,"p1Bags":0,"p2Bags":0,"p1Sets":0,"p2Sets":0,"d":0,"l":0,"player":1};

// On page load, show initial scores and instruction
// Pass GAMESTATE into main()
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector("#p1Score").innerHTML = "USER Score: 0 &nbsp;|&nbsp; Bags: 0 &nbsp;|&nbsp; Sets: 0";
    document.querySelector("#p2Score").innerHTML = "COMP Score: 0 &nbsp;|&nbsp; Bags: 0 &nbsp;|&nbsp; Sets: 0";
    document.querySelector("#alt").innerHTML = "Start the round by drawing your hand! Choose wisely...";
    main(MASTERDICT);
});

// Main() keeps track of buttons to go through the game
// Buttons call on other functions or provide instructions based on GAMESTATE
// If other functions called by clicking on a button, GAMESTATE is passed into that function
// Functions return updated GAMESTATES and Dict (aka MASTERDICT) is updated
function main(Dict)
{
    // DRAW BUTTON
    document.querySelector("#draw").onclick = function() {
        if (Dict["deck"].length > 0)
        {
            // DEAL
            if (Dict["d"] < MAXSCORE && Dict["l"] > MINSCORE && Dict["p1Sets"] != 2 && Dict["p2Sets"] != 2)
            {
                Dict = deal(Dict);
                document.querySelector("#alt").innerHTML = "Draw 13 cards into your hand, then bid.";
                document.querySelector("#p1Bid").innerHTML = "";
                document.querySelector("#compBid").innerHTML = "";
                document.querySelector("#p1Card").innerHTML = "";
                document.querySelector("#p2Card").innerHTML = "";
                document.querySelector("#p1Books").innerHTML = "";
                document.querySelector("#p2Books").innerHTML = "";
            }
        }
        else
        {
            if (Dict["p1Bid"] === -1) {
                document.querySelector("#alt").innerHTML = "The deck is empty, please click the Bid button.";
            }
            else {
                document.querySelector("#alt").innerHTML = "Click the Start Hand button until you're hand is empty and you're ready to score.";
            }
        }
    };

    // BID BUTTON
    document.querySelector("#bid").onclick = function() {
        if (Dict["p1Bid"] === -1 && Dict["deck"].length === 0)
        {
            Dict = bid(Dict);
            document.querySelector("#draw1").innerHTML = "";
            document.querySelector("#draw2").innerHTML = "";
        }
        else if (Dict["p1Bid"] != -1 && Dict["deck"].length === 0)
        {
            document.querySelector("#alt").innerHTML = "You've placed your bid, click the Start Hand button until you're hand is empty and you're ready to score.";
        }

        if (Dict["deck"].length != 0 && Dict["p1"].length > 0 && Dict["p1"].length < 13) {
            document.querySelector("#alt").innerHTML = "Keep drawing until you have 13 cards in your hand.";
        }

        if (Dict["deck"].length != 0 && Dict["p1"].length === 0 && Dict["d"] < MAXSCORE && Dict["l"] > MINSCORE && Dict["p1Sets"] != 2 && Dict["p2Sets"] != 2) {
            document.querySelector("#alt").innerHTML = "Draw 13 cards into your hand, then bid.";
        }
    };

    // START HAND BUTTON
    document.querySelector("#startHand").onclick = function() {
        if (Dict["deck"].length === 0 && Dict["p1Bid"] != -1 && Dict["p1"].length != 0) {
            document.querySelector("#draw1").innerHTML = "";
            document.querySelector("#draw2").innerHTML = "";
            document.querySelector("#alt").innerHTML = "Play until your hand is empty and you're ready to score.";
            Dict = game(Dict);
        }

        if (Dict["deck"].length != 0 && Dict["p1"].length > 0 && Dict["p1"].length < 13) {
            document.querySelector("#alt").innerHTML = "Keep drawing until you have 13 cards in your hand.";
        }

        if (Dict["deck"].length === 0 && Dict["p1Bid"] === -1 && Dict["p1"].length === 13) {
            document.querySelector("#alt").innerHTML = "The deck is empty, please click the Bid button.";
        }

        if (Dict["p1"].length === 0 && Dict["deck"].length === 0) {
            document.querySelector("#alt").innerHTML = "Score the round!";
            document.querySelector("#p1").innerHTML = "";
        }

        if (Dict["deck"].length != 0 && Dict["p1"].length === 0 && Dict["d"] < MAXSCORE && Dict["l"] > MINSCORE) {
            document.querySelector("#alt").innerHTML = "Draw 13 cards into your hand, then bid.";
        }
    };

    // SCORE BUTTON
    document.querySelector("#score").onclick = function() {
        if (Dict["p1"].length === 0 && Dict["deck"].length === 0) {
            Dict = score(Dict);
            document.querySelector("#p1Card").innerHTML = "";
            document.querySelector("#p2Card").innerHTML = "";
        }

        if (Dict["deck"].length != 0 && Dict["p1"].length > 0 && Dict["p1"].length < 13) {
            document.querySelector("#alt").innerHTML = "Keep drawing until you have 13 cards in your hand.";
        }

        if (Dict["deck"].length === 0 && Dict["p1Bid"] === -1 && Dict["p1"].length === 13) {
            document.querySelector("#alt").innerHTML = "The deck is empty, please click the Bid button.";
        }
    };
}


// DEAL //
// Called on when DEAL BUTTON is clicked, if GAMESTATE passes necessary conditions
// Prompts user to take or refuse a card, next card is either discarded or added to user's hand, respectively
// Comp picks card similarly, deal() calls on comp_pick() to do this
// Returns updated GAMESTATE (notable updated vars include: user and computer hands)
function deal(deal_dict)
{
    if (deal_dict["num_round"] % 2 === 0) {
        deal_dict["player"] = 1;
    }
    else {
        deal_dict["player"] = 2;
    }

    if (deal_dict["player"] === 1) {

        // User picks first
        let pos = Math.floor(Math.random() * (deal_dict["deck"].length - 1));

        if (confirm(`Do you want this card: ${deal_dict["deck"][pos]}`))
        {
            deal_dict["p1"].push(deal_dict["deck"][pos]);
            document.querySelector("#draw1").innerHTML = `${deal_dict["deck"][pos]} is now in your hand.`;
            deal_dict["deck"].splice(pos,1);

            pos = Math.floor(Math.random() * (deal_dict["deck"].length - 1));
            document.querySelector("#draw2").innerHTML = `${deal_dict["deck"][pos]} has been discarded.`;
            deal_dict["deck"].splice(pos,1);

            deal_dict["p1"].sort();
            document.querySelector("#p1").innerHTML = `USER: ${deal_dict["p1"]}`;
        }

        else
        {
            document.querySelector("#draw1").innerHTML = `${deal_dict["deck"][pos]} has been discarded.`;
            deal_dict["deck"].splice(pos,1);

            pos = Math.floor(Math.random() * (deal_dict["deck"].length - 1));
            deal_dict["p1"].push(deal_dict["deck"][pos]);
            document.querySelector("#draw2").innerHTML = `${deal_dict["deck"][pos]} is now in your hand.`;
            deal_dict["deck"].splice(pos,1);

            deal_dict["p1"].sort();
            document.querySelector("#p1").innerHTML = `USER: ${deal_dict["p1"]}`;
        }

        // Comp picks second
        pos = Math.floor(Math.random() * (deal_dict["deck"].length - 1));

        if (comp_pick(deal_dict["deck"][pos]) === "y")
        {
            deal_dict["p2"].push(deal_dict["deck"][pos]);
            deal_dict["deck"].splice(pos,1);
            pos = Math.floor(Math.random() * (deal_dict["deck"].length - 1));
            deal_dict["deck"].splice(pos,1);

            deal_dict["p2"].sort();
        }

        else
        {
            deal_dict["deck"].splice(pos,1);
            pos = Math.floor(Math.random() * (deal_dict["deck"].length - 1));
            deal_dict["p2"].push(deal_dict["deck"][pos]);
            deal_dict["deck"].splice(pos,1);

            deal_dict["p2"].sort();
        }
    }

    else {
        // Comp picks first
        let pos = Math.floor(Math.random() * (deal_dict["deck"].length - 1));

        if (comp_pick(deal_dict["deck"][pos]) === "y")
        {
            deal_dict["p2"].push(deal_dict["deck"][pos]);
            deal_dict["deck"].splice(pos,1);
            pos = Math.floor(Math.random() * (deal_dict["deck"].length - 1));
            deal_dict["deck"].splice(pos,1);

            deal_dict["p2"].sort();
        }

        else
        {
            deal_dict["deck"].splice(pos,1);
            pos = Math.floor(Math.random() * (deal_dict["deck"].length - 1));
            deal_dict["p2"].push(deal_dict["deck"][pos]);
            deal_dict["deck"].splice(pos,1);

            deal_dict["p2"].sort();
        }

        // User picks second
        pos = Math.floor(Math.random() * (deal_dict["deck"].length - 1));

        if (confirm(`Do you want this card: ${deal_dict["deck"][pos]}`))
        {
            deal_dict["p1"].push(deal_dict["deck"][pos]);
            document.querySelector("#draw1").innerHTML = `${deal_dict["deck"][pos]} is now in your hand.`;
            deal_dict["deck"].splice(pos,1);

            pos = Math.floor(Math.random() * (deal_dict["deck"].length - 1));
            document.querySelector("#draw2").innerHTML = `${deal_dict["deck"][pos]} has been discarded.`;
            deal_dict["deck"].splice(pos,1);

            deal_dict["p1"].sort();
            document.querySelector("#p1").innerHTML = `USER: ${deal_dict["p1"]}`;
        }

        else
        {
            document.querySelector("#draw1").innerHTML = `${deal_dict["deck"][pos]} has been discarded.`;
            deal_dict["deck"].splice(pos,1);

            pos = Math.floor(Math.random() * (deal_dict["deck"].length - 1));
            deal_dict["p1"].push(deal_dict["deck"][pos]);
            document.querySelector("#draw2").innerHTML = `${deal_dict["deck"][pos]} is now in your hand.`;
            deal_dict["deck"].splice(pos,1);

            deal_dict["p1"].sort();
            document.querySelector("#p1").innerHTML = `USER: ${deal_dict["p1"]}`;
        }
    }

    return deal_dict;
}


// COMP PICK //
// Computer picks hand based on if presented card is in good_cards
// Returns "y" or "n" which is processed in deal()
function comp_pick(comp_card)
{
    let good_cards = ["C-Ace", "C-Kg", "D-Ace", "D-Kg", "H-Ace", "H-Kg", "S2", "S3", "S4","S5", "S6", "S7", "S8", "S9", "S10", "S-J", "S-Q", "S-Kg", "S-Ace"];

    if (good_cards.indexOf(comp_card) != -1)
    {
        return "y";
    }
    else
    {
        return "n";
    }
}


// BID //
// Called on when BID BUTTON is clicked, if GAMESTATE passes necessary conditions
// Prompts user to input a bid number b/w 0 and 13 inclusive based off user's hand, decimals are truncated
// Calls on comp_bid() to get computer's bid
// Returns updated GAMESTATE (notable updated vars include: user and computer bids)
function bid(bid_dict)
{
    if (bid_dict["num_round"] % 2 === 0) {
        bid_dict["player"] = 1;
    }
    else {
        bid_dict["player"] = 2;
    }

    if (bid_dict["player"] === 1) {
        while (bid_dict["p1Bid"] < 0 || bid_dict["p1Bid"] > 13 || isNaN(bid_dict["p1Bid"]) === true) {
            bid_dict["p1Bid"] = parseInt(prompt("Please bid your hand b/w 0 and 13:"));
        }

        bid_dict["p2Bid"] = comp_bid(bid_dict["p2"], bid_dict["p1Bid"]);

        document.querySelector("#p1Bid").innerHTML = `USER Bid: ${bid_dict["p1Bid"]}`;
        document.querySelector("#compBid").innerHTML = `COMP Bid: ${bid_dict["p2Bid"]}`;
    }

    else {
        bid_dict["p2Bid"] = comp_bid(bid_dict["p2"], bid_dict["p1Bid"]);

        while (bid_dict["p1Bid"] < 0 || bid_dict["p1Bid"] > 13 || isNaN(bid_dict["p1Bid"]) === true) {
            bid_dict["p1Bid"] = parseInt(prompt(`COMP Bids: ${bid_dict["p2Bid"]}, please bid your hand b/w 0 and 13:`));
        }

        document.querySelector("#p1Bid").innerHTML = `USER Bid: ${bid_dict["p1Bid"]}`;
        document.querySelector("#compBid").innerHTML = `COMP Bid: ${bid_dict["p2Bid"]}`;
    }

    document.querySelector("#alt").innerHTML = "You've placed your bid, click the Start Hand button!";

    return bid_dict;
}


// COMP BID //
// Determines computer's bid and returns that value
function comp_bid(hand, compBid_p1Bid)
{
    var BID = 0;
    var NUM_OF_SUIT = 0;
    var NUM_SPADES = 0;
    let NUM_HIGH_SPADES = 0;

    let i;
    for (i of hand) {
        if (i.charAt(0) === "S") {
            NUM_SPADES++;
            if (i.length >= 3) {
                BID++;
                NUM_HIGH_SPADES++;
            }
        }

        else if (i.length >= 3) {
            if (i.charAt(2) === "A") {
                BID++;
            }
            else if (i.charAt(2) === "K") {
                let suit = i.charAt(0);
                let j;
                for (j of hand) {
                    if (j.charAt(0) === suit) {
                        NUM_OF_SUIT++;
                    }
                }
                if (NUM_OF_SUIT < 6) {
                    BID++;
                }
                NUM_OF_SUIT = 0;
            }
        }
    }

    if (NUM_SPADES === 5 && NUM_HIGH_SPADES != 5) {
        BID++;
    }
    else if (NUM_SPADES === 6) {
        BID += 2;
    }
    else if (NUM_SPADES === 7) {
        BID += 6 - NUM_HIGH_SPADES;
    }
    else if (NUM_SPADES === 8) {
        BID += 7 - NUM_HIGH_SPADES;
    }
    else if (NUM_HIGH_SPADES > 8) {
        BID += NUM_SPADES - NUM_HIGH_SPADES - 1;
    }
    if (compBid_p1Bid === -1) {
        if (BID + compBid_p1Bid > 12) {
            BID = 12 - compBid_p1Bid;
        }
    }
    else if (compBid_p1Bid != -1) {
        if (BID + compBid_p1Bid > 13) {
            BID = 13 - compBid_p1Bid;
        }
    }
    return BID;
}


// GAME-PLAY //
// Called on when START HAND button is clicked, if GAMESTATE passes necessary conditions
// Prompts user and computer to play cards
    // 2 cases: 1. User leads and comp follows, 2. Comp leads and user follows
// Once played cards pass the necessary conditions, those cards are passed into ranking() where the winning card is determined
// Based on the winning card, the following notable variables are updated:
    // Books (won hands per round)
    // Played cards are removed from user and computer hands
    // Value of "player" key is updated based on who won to determine who leads the next hand
        // Winner of prev hand leads next hand
// Returns updated GAMESTATE with the above variables updated
function game(game_dict)
{
    document.querySelector("#alt").innerHTML = "Click Start Hand until your hand is empty. Good Luck!";

    // Some of the vars needed for this function
    let cardOne = "";
    let cardTwo = "";

    let card_max = CARDMAX;
    let spade_counter1 = 0;
    let spade_counter2 = 0;
    let club_count = 0;
    let diamond_count = 0;
    let heart_count = 0;
    let lead_suit_cards = [];
    let card_value = 0;
    let count = 0;
    let count2 = 0;
    let count3 = 0;
    let count4 = 0;
    let count5 = 0;
    let count6 = 0;
    let good_card = "";
    let high_card = "";
    let low_card = "";

    // USER LEADS
    if (game_dict["player"] === 1) {
        cardOne = prompt("Please input a card as it's displayed on your screen:");

        // Continues to prompt user for input until valid card is inputted
        while (true) {
            // Makes sure card is in user's hand
            if (game_dict["p1"].indexOf(cardOne) === -1) {
                cardOne = prompt("Please enter your card correctly:");
            }
            // Makes sure user doesn't play a spade if spades haven't been broken yet or can't be broken currently
            else if (cardOne.charAt(0) === "S" && game_dict["spades_played"] === false) {
                let cards;
                for (cards of game_dict["p1"]) {
                    if (cards.charAt(0) === "S") {
                        spade_counter1++;
                    }
                }
                if (game_dict["p1"].length === spade_counter1) {
                    game_dict["spades_played"] = true;
                }
                else {
                    cardOne = prompt("Spades haven't been broken. Please lead a different suit:");
                }
            }
            else {
                break;
            }
        }

        // COMP FOLLOWS
        // Determine if comp can follow suit
        let l;
        for (l of game_dict["p2"]) {
            if (l.charAt(0) === cardOne.charAt(0)) {
                lead_suit_cards.push(l);
            }
        }

        // CASE 1: If comp can follow suit
        if (lead_suit_cards.length > 0) {
            // Find highest value in comp's hand of lead suit
            let m;
            for (m of lead_suit_cards) {
                let char;
                for (char = 0; char < m.length; char++) {
                    count += m.charCodeAt(char);
                }
                if (count > card_value) {
                    card_value = count;
                    high_card = m;
                    count = 0;
                }
                else {
                    count = 0;
                }
            }
            // Calculate value of cardOne (led card)
            let char;
            for (char = 0; char < cardOne.length; char++) {
                count2 += cardOne.charCodeAt(char);
            }
            // If comp can beat cardOne, beat it
            if (card_value > count2) {
                cardTwo = high_card;
            }
            // Otherwise, find weakest card of lead suit in comp's hand
            else {
                let n;
                for (n of lead_suit_cards) {
                    for (char = 0; char < n.length; char++) {
                        count3 += n.charCodeAt(char);
                    }
                    if (count3 < card_max) {
                        card_max = count3;
                        low_card = n;
                        count3 = 0;
                    }
                    else {
                        count3 = 0;
                    }
                }
                cardTwo = low_card;
            }
        }

        // CASE 2: If comp can't follow suit
        else {
            let p;
            for (p of game_dict["p2"]) {
                if (p.charAt(0) === "S") {
                    spade_counter2 += 1;
                }
            }
            // Play a spade if possible
            if (spade_counter2 >= 1) {
                let new_start = game_dict["p2"].length - spade_counter2;
                let first_spade = game_dict["p2"][new_start];
                let char;
                for (char = 0; char < first_spade.length; char++) {
                    count6 += first_spade.charCodeAt(char);
                }
                card_value = count6;
                let q;
                for (q = (new_start + 1); q < game_dict["p2"].length; q++) {
                    for (char = 0; char < game_dict["p2"][q].length; char++)
                    {
                        count4 += game_dict["p2"][q].charCodeAt(char);
                    }
                    if (count4 < card_value) {
                        card_value = count4;
                        good_card = game_dict["p2"][q];
                        count4 = 0;
                    }
                    else {
                        count4 = 0;
                    }
                }
                game_dict["spades_played"] = true;
                if (card_value < count6) {
                    cardTwo = good_card;
                }
                else {
                    cardTwo = first_spade;
                }
            }
            // Otherwise, get rid of weakest non-spade
            else {
                let r;
                for (r of game_dict["p2"]) {
                    let char;
                    for (char = 0; char < r.length; char++) {
                        count5 += r.charCodeAt(char);
                    }
                    if (count5 < card_max) {
                        card_max = count5;
                        low_card = r;
                        count5 = 0;
                    }
                    else {
                        count5 = 0;
                    }
                }
                cardTwo = low_card;
            }
        }

        // Determine winner of hand, update books, update hands
        let bestCard = ranking(cardOne, cardTwo);
        if (bestCard === cardOne) {
            game_dict["p1Books"] += 1;
            game_dict["player"] = 1;
        }
        else {
            game_dict["p2Books"] += 1;
            game_dict["player"] = 2;
        }

        document.querySelector("#p1Card").innerHTML = `USER plays: ${cardOne}`;
        document.querySelector("#p2Card").innerHTML = `COMP plays: ${cardTwo}`;
        document.querySelector("#p1Books").innerHTML = `USER Books: ${game_dict["p1Books"]}`;
        document.querySelector("#p2Books").innerHTML = `COMP Books: ${game_dict["p2Books"]}`;

        let pos1 = game_dict["p1"].indexOf(cardOne);
        let pos2 = game_dict["p2"].indexOf(cardTwo);

        game_dict["p1"].splice(pos1, 1);
        game_dict["p2"].splice(pos2, 1);

        document.querySelector("#p1").innerHTML = `USER: ${game_dict["p1"]}`;

    }

    // COMP LEADS
    else if (game_dict["player"] === 2) {
        // If spades not broken
        if (game_dict["spades_played"] === false) {
            // Count spades in comp's hand
            let b;
            for (b of game_dict["p2"]) {
                if (b.charAt(0) === "S") {
                    spade_counter2 += 1;
                }
            }
            // If comp's hand is all spades, break spades with highest spade
            if (spade_counter2 === game_dict["p2"].length) {
                let spade;
                for (spade of game_dict["p2"]) {
                    let char2;
                    for (char2 = 0; char2 < spade.length; char2++) {
                        count += spade.charCodeAt(char2);
                    }
                    if (count > card_value) {
                        card_value = count;
                        good_card = spade;
                        count = 0;
                    }
                    else {
                        count = 0;
                    }
                }
                game_dict["spades_played"] = true;
                cardOne = good_card;
            }
            // Otherwise, do 1 of 2 things
            // 1: If only one card of a non-spade suit, get rid of it, better chance to break spades later
            // 2: If above not true, play highest value non-spade
            else {
                let new_length2 = game_dict["p2"].length - spade_counter2;
                let j;
                for (j = 0; j < new_length2; j++) {
                    if (game_dict["p2"][j].charAt(0) === "C") {
                        club_count += 1;
                        var club = game_dict["p2"][j];
                    }
                    else if (game_dict["p2"][j].charAt(0) === "D") {
                        diamond_count += 1;
                        var diamond = game_dict["p2"][j];
                    }
                    else if (game_dict["p2"][j].charAt(0) === "H") {
                        heart_count += 1;
                        var heart = game_dict["p2"][j];
                    }
                    let char2;
                    for (char2 = 0; char2 < game_dict["p2"][j].length; char2++) {
                        count += game_dict["p2"][j].charCodeAt(char2);
                    }
                    if (count > card_value) {
                        card_value = count;
                        good_card = game_dict["p2"][j];
                        count = 0;
                    }
                    else {
                        count = 0;
                    }
                }
            }

            if (club_count === 1) {
                cardOne = club;
            }
            else if (diamond_count === 1) {
                cardOne = diamond;
            }
            else if (heart_count === 1) {
                cardOne = heart;
            }
            else {
                cardOne = good_card;
            }
        }

        // If spades broken, calculate highest value card overall and play that card
        else if (game_dict["spades_played"] === true) {
            let h;
            for (h of game_dict["p2"]) {
                let char2;
                for (char2 = 0; char2 < h.length; char2++) {
                    count += h.charCodeAt(char2);
                }
                if (count > card_value) {
                    card_value = count;
                    good_card = h;
                    count = 0;
                }
                else {
                    count = 0;
                }
            }
            cardOne = good_card;
        }

        alert(`COMP plays: ${cardOne}`);

        // USER FOLLOWS
        // Check if user inputting a valid card
        cardTwo = prompt(`Your turn to play a card, COMP: ${cardOne}`);
        while (cardTwo === "" || game_dict["p1"].indexOf(cardTwo) === -1) {
            cardTwo = prompt(`Please enter a card in your hand, COMP: ${cardOne}`);
        }
        let lead_suit = cardOne.charAt(0);
        let good_play = false;

        while (good_play === false) {
            // CASE 1: Check if user input matches lead_suit
            if (cardTwo.charAt(0) === lead_suit && game_dict["p1"].indexOf(cardTwo) === -1) {
                cardTwo = prompt(`Please enter your card correctly, COMP: ${cardOne}`);
                if (cardTwo.charAt(0) === lead_suit && game_dict["p1"].indexOf(cardTwo) != -1) {
                    good_play === true;
                }
            }

            // CASE 2: User inputs a spade, but spades haven't been broken yet
                // Case 2a - User not allowed to play a spade, so must follow suit
                // Case 2b - User may break spades, so set spades_played = true, and check CASE 3
            if (cardTwo.charAt(0) === "S" && game_dict["spades_played"] === false && good_play === false) {
                spade_counter1 = 0;
                let cards2;
                for (cards2 of game_dict["p1"]) {
                    if (cards2.charAt(0) === "S") {
                        spade_counter1 += 1;
                    }
                }
                // Case 2b (part 1) - user only has spades, so may break spades, check CASE 3
                if (game_dict["p1"].length === spade_counter1) {
                    game_dict["spades_played"] = true;
                }
                // Check if user has a card of the same suit as lead_suit
                else {
                    let spade_able = true;
                    for (cards2 of game_dict["p1"]) {
                        if (cards2.charAt(0) === lead_suit) {
                            spade_able = false;
                        }
                    }
                    // Case 2a - must follow suit
                    if (spade_able === false) {
                        while (true) {
                            if (cardTwo.charAt(0) != lead_suit) {
                                cardTwo = prompt(`Please follow suit, COMP: ${cardOne}`);
                            }
                            else if (game_dict["p1"].indexOf(cardTwo) === -1) {
                                cardTwo = prompt(`Please enter your card correctly, COMP: ${cardOne}`);
                            }
                            else {
                                good_play = true;
                                break;
                            }
                        }
                    }
                    // Case 2b (part 2) - spade_able = true, check CASE 3
                    else {
                        game_dict["spades_played"] = true;
                    }
                }
            }

            // CASE 3: User inputs a spade when spades have been broken or may be broken, but spade doesn't match lead suit
                // Case 3a - Check if user has lead_suit in hand, if not, spade is a valid move
                // Case 3b - User must follow suit
            else if (cardTwo.charAt(0) === "S" && game_dict["spades_played"] === true && good_play === false) {
                // Case 3a - check if user can follow suit
                let lead_suit_counter = 0;
                let cards3;
                for (cards3 of game_dict["p1"]) {
                    if (cards3.charAt(0) === lead_suit) {
                        lead_suit_counter += 1;
                    }
                }
                if (lead_suit_counter === 0) {
                    good_play = true;
                }
                // Case 3b - makes sure user follows suit
                else {
                    while (true) {
                        if (cardTwo.charAt(0) != lead_suit) {
                            cardTwo = prompt(`Please follow suit, COMP: ${cardOne}`);
                        }
                        else if (game_dict["p1"].indexOf(cardTwo) === -1) {
                            cardTwo = prompt(`Please enter your card correctly, COMP: ${cardOne}`);
                        }
                        else {
                            good_play = true;
                            break;
                        }
                    }
                }
            }

            // CASE 4: User inputs a non-spade that doesn't match lead suit
                // Case 4a - Check if user has lead_suit in hand, if not, off-suit is a valid move
                // Case 4b - User must follow suit
            else if (cardTwo.charAt(0) != "S" && good_play === false) {
                // Case 4a
                let lead_suit_counter2 = 0;
                let cards4;
                for (cards4 of game_dict["p1"]) {
                    if (cards4.charAt(0) === lead_suit) {
                        lead_suit_counter2 += 1;
                    }
                }
                if (lead_suit_counter2 === 0) {
                    good_play = true;
                }
                // Case 4b - makes sure user follows suit
                else {
                    while (true) {
                        if (cardTwo.charAt(0) != lead_suit) {
                            cardTwo = prompt(`Please follow suit, COMP: ${cardOne}`);
                        }
                        else if (game_dict["p1"].indexOf(cardTwo) === -1) {
                            cardTwo = prompt(`Please enter your card correctly, COMP: ${cardOne}`);
                        }
                        else {
                            good_play = true;
                            break;
                        }
                    }
                }
            }
        }

        // Determine winner of hand, update books and hands
        let bestCard = ranking(cardOne, cardTwo);
        if (bestCard === cardOne) {
            game_dict["p2Books"] += 1;
            game_dict["player"] = 2;
        }
        else {
            game_dict["p1Books"] += 1;
            game_dict["player"] = 1;
        }

        document.querySelector("#p1Card").innerHTML = `USER plays: ${cardTwo}`;
        document.querySelector("#p2Card").innerHTML = `COMP plays: ${cardOne}`;
        document.querySelector("#p1Books").innerHTML = `USER Books: ${game_dict["p1Books"]}`;
        document.querySelector("#p2Books").innerHTML = `COMP Books: ${game_dict["p2Books"]}`;

        let pos1 = game_dict["p1"].indexOf(cardTwo);
        let pos2 = game_dict["p2"].indexOf(cardOne);

        game_dict["p1"].splice(pos1, 1);
        game_dict["p2"].splice(pos2, 1);

        document.querySelector("#p1").innerHTML = `USER: ${game_dict["p1"]}`;

    }

    return game_dict;
}


// Ranking //
// Passed in played cards from game()
// Determines better card based on suit and/or sum of corresponds ASCII Decimal values
// Returns winning card back to game()
function ranking(cardA, cardB)
{
    let winner;
    let suitA = cardA.charAt(0);
    let suitB = cardB.charAt(0);
    let countA = 0;
    let countB = 0;
    if (suitA === suitB) {
        let i;
        for (i = 0; i < cardA.length; i++) {
            countA += cardA.charCodeAt(i);
        }
        let j;
        for (j = 0; j < cardB.length; j++) {
            countB += cardB.charCodeAt(j);
        }
        if (countA > countB) {
            winner = cardA;
        }
        else {
            winner = cardB;
        }
    }
    else if (suitA != suitB) {
        if (suitB != "S") {
            winner = cardA;
        }
        else {
            winner = cardB;
        }
    }

    return winner;
}


// SCORE //
// Called on when SCORE BUTTON is clicked, if GAMESTATE passes necessary conditions
// Updates scores, bags, sets, num_round
// Resets spades_played, bids, and books to intial values
// Prints out new score if game not over, otherwise passes GAMESTATE into gameOver()
// Returns updated GAMESTATE
function score(score_dict)
{

    if (score_dict["p1Books"] + score_dict["p2Books"] != 0) {

        // Calculates P1 Score
        if (score_dict["p1Books"] >= score_dict["p1Bid"] && score_dict["p1Bid"] != 0) {
            score_dict["p1Score"] += score_dict["p1Bid"] * 10;
            score_dict["p1Bags"] += score_dict["p1Books"] - score_dict["p1Bid"];
        }
        else if (score_dict["p1Books"] < score_dict["p1Bid"] && score_dict["p1Bid"] != 0) {
            score_dict["p1Score"] -= score_dict["p1Bid"] * 10;
            score_dict["p1Sets"] += 1;
        }
        else if (score_dict["p1Books"] === score_dict["p1Bid"] && score_dict["p1Bid"] === 0) {
            score_dict["p1Score"] += 100;
        }
        else if (score_dict["p1Books"] != score_dict["p1Bid"] && score_dict["p1Bid"] === 0) {
            score_dict["p1Score"] -= 100;
            score_dict["p1Bags"] += score_dict["p1Books"];
        }
        while (score_dict["p1Bags"] >= 5) {
            score_dict["p1Score"] -= 50;
            score_dict["p1Bags"] -= 5;
        }

        // Calculates Comp Score
        if (score_dict["p2Books"] >= score_dict["p2Bid"] && score_dict["p2Bid"] != 0) {
            score_dict["p2Score"] += score_dict["p2Bid"] * 10;
            score_dict["p2Bags"] += score_dict["p2Books"] - score_dict["p2Bid"];
        }
        else if (score_dict["p2Books"] < score_dict["p2Bid"] && score_dict["p2Bid"] != 0) {
            score_dict["p2Score"] -= score_dict["p2Bid"] * 10;
            score_dict["p2Sets"] += 1;
        }
        else if (score_dict["p2Books"] === score_dict["p2Bid"] && score_dict["p2Bid"] === 0) {
            score_dict["p2Score"] += 100;
        }
        else if (score_dict["p2Books"] != score_dict["p2Bid"] && score_dict["p2Bid"] === 0) {
            score_dict["p2Score"] -= 100;
            score_dict["p2Bags"] += score_dict["p2Books"];
        }
        while (score_dict["p2Bags"] >= 5) {
            score_dict["p2Score"] -= 50;
            score_dict["p2Bags"] -= 5;
        }

        if (score_dict["p1Score"] >= score_dict["p2Score"]) {
            score_dict["d"] = score_dict["p1Score"];
            score_dict["l"] = score_dict["p2Score"];
        }
        else {
            score_dict["d"] = score_dict["p2Score"];
            score_dict["l"] = score_dict["p1Score"];
        }

        var COPYDECK2 = _.cloneDeep(DECK);
        score_dict["deck"] = COPYDECK2;
        score_dict["num_round"] += 1;
        score_dict["spades_played"] = false;
        score_dict["p1Bid"] = -1;
        score_dict["p2Bid"] = -1;
        score_dict["p1Books"] = 0;
        score_dict["p2Books"] = 0;

        if (score_dict["d"] < MAXSCORE && score_dict["l"] > MINSCORE && score_dict["p1Sets"] != 2 && score_dict["p2Sets"] != 2) {
            document.querySelector("#p1Score").innerHTML = `USER Score: ${score_dict["p1Score"]} &nbsp;|&nbsp; Bags: ${score_dict["p1Bags"]} &nbsp;|&nbsp; Sets: ${score_dict["p1Sets"]}`;
            document.querySelector("#p2Score").innerHTML = `COMP Score: ${score_dict["p2Score"]} &nbsp;|&nbsp; Bags: ${score_dict["p2Bags"]} &nbsp;|&nbsp; Sets: ${score_dict["p2Sets"]}`;
            document.querySelector("#alt").innerHTML = "Draw and play another round!";
        }
        else {
            gameOver(score_dict);
        }

        return score_dict;
    }
}


// GAME OVER //
// Called on from score(), takes GAMESTATE from score() as input
// Determines winner based on which score is lower (if MINSCORE reached) or higher (if MAXSCORE reached) or which player has 2 sets
// Prints out winner and updated scores and winner
function gameOver(final_dict)
{
    if (final_dict["p1Sets"] === 2 && final_dict["p2Sets"] != 2)
    {
        document.querySelector("#p1Score").innerHTML = "YOU LOST";
    }
    else if (final_dict["p2Sets"] === 2 && final_dict["p1Sets"] != 2)
    {
        document.querySelector("#p1Score").innerHTML = "YOU WON";
    }
    else if (final_dict["p1Sets"] === 2 && final_dict["p2Sets"] === 2)
    {
        document.querySelector("#p1Score").innerHTML = "TIE";
    }
    else if (final_dict["p1Score"] > final_dict["p2Score"])
    {
        document.querySelector("#p1Score").innerHTML = "YOU WON";
    }
    else if (final_dict["p2Score"] > final_dict["p1Score"])
    {
        document.querySelector("#p1Score").innerHTML = "YOU LOST";
    }
    else
    {
        document.querySelector("#p1Score").innerHTML = "TIE";
    }

    document.querySelector("#p2Score").innerHTML = `USER Score: ${final_dict["p1Score"]} | Bags: ${final_dict["p1Bags"]} | Sets: ${final_dict["p1Sets"]}`;
    document.querySelector("#altScore").innerHTML = `COMP Score: ${final_dict["p2Score"]} | Bags: ${final_dict["p2Bags"]} | Sets: ${final_dict["p2Sets"]}`;
    document.querySelector("#alt").innerHTML = "Reload the page to play again!";
}