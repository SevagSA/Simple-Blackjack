var playerCards = [];
var dealerCards = [];
var isPlayerBusted = false;
var numOfCard = 52;
var winningNumber = 21;
var cards = [];
// inserting idx of all cards
for (var i = 1; i <= numOfCard; i++) {
    cards.push(i);
}

function deal() {
    var numOfCardsToDeal = 2; // in variable to avoid magic number
    for (var i = 0; i < numOfCardsToDeal; i++) {
        playerCards.push(cards.splice(cards.length * Math.random(), 1)[0]);
        document.getElementById(`player${i + 1}`).setAttribute("src", `img/${playerCards[i]}.png`);
        dealerCards.push(cards.splice(cards.length * Math.random(), 1)[0]);
        document.getElementById(`dealer${i + 1}`).setAttribute("src", `img/${dealerCards[i]}.png`);
    }
    countTotal();
}

function countTotal() {
    var playerScore = document.getElementById("playerScore");
    var dealerScore = document.getElementById("dealerScore");
    playerScore.innerHTML = playerCards.reduce(
        function (total, val) { return total + getCardValue(val); }, 0);
    dealerScore.innerHTML = dealerCards.reduce(
        function (total, val) { return total + getCardValue(val); }, 0);
    return { playerScore: playerScore.innerHTML, dealerScore: dealerScore.innerHTML };
}

function getCardValue(cardIdx) {
    if (cardIdx % 13 === 11 | cardIdx % 13 === 12 | cardIdx % 13 === 0) {
        return 10;
    } else if (cardIdx % 13 === 1) {
        return 11;
    }
    else {
        return cardIdx % 13;
    }
}

function requestPlayerCard(participant = "player") {
    var participantCards = playerCards;
    var isPlayer = true;
    if (participant === "dealer") {
        participantCards = dealerCards;
        isPlayer = false;
    }
    participantCards.push(cards.splice(cards.length * Math.random(), 1)[0]);
    var newCardImage = document.createElement("img");
    newCardImage.setAttribute("id", "dealer" + participantCards.length);
    newCardImage.setAttribute("width", 107);
    newCardImage.setAttribute("height", 98);
    newCardImage.setAttribute("src", `img/${participantCards[participantCards.length - 1]}.png`);
    countTotal();
    document.getElementById(participant + "Hand").appendChild(newCardImage);
    // Busting player. Not busting dealer ->
    // dealer will be busted from completeDealerHand() && will recurse if busted here
    if ((isPlayer) && (countTotal().playerScore >= winningNumber)) {
        isPlayerBusted = true ? countTotal().playerScore > winningNumber : false;
        completeDealerHand();
    }
}

function completeDealerHand() {
    var winner = "dealer";
    document.getElementById("btnDraw").disabled = true;
    document.getElementById("btnHold").disabled = true;
    while (countTotal().dealerScore <= 16) {
        requestPlayerCard("dealer");
    }
    if (countTotal().dealerScore > winningNumber) { // dealer exceeds 21
        if (!isPlayerBusted) { // player hasn't been busted
            winner = "player";
        }
        // if the player is busted
    } else if (isPlayerBusted) {
        winner = "dealer";
    } else if (countTotal().dealerScore === countTotal().playerScore) { // tie
        document.getElementById("playerLabel").innerHTML += "has tied the hand";
        document.getElementById("dealerLabel").innerHTML += "has tied the hand";
        return; // returning to avoid overriding the innerHTML on lines 93-94
        // both have not busted.
    } else if ((countTotal().dealerScore <= winningNumber)
        && (countTotal().playerScore <= winningNumber)) {
        var calculatedPlayerScore = winningNumber - countTotal().playerScore;
        if (calculatedPlayerScore < (winningNumber - countTotal().dealerScore)) {
            winner = "player";
        }
    }
    document.getElementById(`${winner}Label`).style.color += "green";
    document.getElementById(`${winner}Label`).innerHTML += "has won the hand";
}
