// money, deck, user, and deal lists
var money = 0;

var deck = []

var user = []
var user2 = []

var dealer = []

var userIns = false

// BetMoney money global variable.
var betMoney

// Log user and dealer cards
function usrHand(){ console.log("Your cards: " + user + " value = " + sum(user))}
function usrHand2(){ console.log("Deck 2: " + user2 + " value = " + sum(user2))}
function dealHand(){console.log("Dealer cards: " + dealer + " value = " + sum(dealer))}

// Game logic
function start(){
    createCards()
    user.push(getCard())
    user.push(getCard())
    dealer.push(getCard())
    dealer.push(getCard())
    usrHand()
    console.log("Dealer cards: " + dealer[0])
    if(sum(user) === 21){
        return usrWin()
    } else if(sum(dealer) === 21){
        return dealWin()
    } else {
        if(dealer[0] === "ace"){
            var ins = prompt("Would you like insurance?: ")
            if(ins === "yes"){
                userIns = true;
            } else if(ins === "no"){
                userIns = false;
            } else {
                var ins = prompt("Would you like insurance?: ")
            }
        } if(sum(user) < 21){
            if(sum(dealer) === 21){
                dealWin()
            } else if(sum(user) > 21) {
                dealWin()
            } else {
                if(sum(user) === 20){
                    var choice = prompt("Would you like to hit, stand, surrender, split, or double?: ") 
                } else {
                    var choice = prompt("Would you like to hit, stand, surrender or double?: ")
                }
                if(choice === "hit"){
                    user.push(getCard())
                    usrHand()
                    sum(user)
                    if (sum(user) > 21) {
                        dealWin()
                    } else if(sum(user) === 21){
                        usrWin()
                    } else {
                        var again = prompt("Again?: ")
                        for(i = 0; i <10; i++ ){
                            if(again === "yes"){
                                user.push(getCard())
                                usrHand()
                                sum(user)
                                if(sum(user) > 21){
                                    return dealWin()
                                } else {
                                    again = prompt("Again?: ")
                                }
                            } else if(again === "no"){
                                dealerShow()
                                if(sum(dealer) > 21 || sum(dealer) < sum(user)){
                                    return usrWin()
                                } else {
                                    return dealWin()
                                }
                            } else {
                                again = prompt("Enter 'yes' or 'no': ")
                            } if(sum(user) > 21){
                                return dealWin()
                            }
                        }
                        dealerShow()
                        if(sum(dealer) > 21 || sum(dealer) <= sum(user)){
                            return usrWin()
                        } else {
                            return dealWin()
                        }
                    }
                } else if(choice === "stand"){
                    dealerShow()
                    sum(dealer)
                    if(sum(dealer) > 21 || sum(dealer) <= sum(user)){
                        usrWin()
                    } else {
                        dealWin()
                    }
                } else if(choice === "surrender"){
                    usrHand()
                    dealHand()
                    money = money - (betMoney * 0.5)
                } else if(choice === "double") {
                    user.push(getCard())
                    usrHand()
                    betMoney = betMoney * 2
                    dealerShow()
                    if(sum(dealer) > 21 || sum(dealer) <= sum(user)){
                        return usrWin()
                    } else {
                        return dealWin()
                    }
                } else if(choice === "split"){
                    user2.push(user[0])
                    user.push(getCard())
                    user2.push(getCard())
                    usrHand()
                    usrHand2()
                    var split = prompt("Would you like to hit, stand, or double?: ")
                    if(split === "hit"){
                        user.push(getCard())
                        user2.push(getCard())
                        usrHand()
                        usrHand2()
                        sum(user)
                        sum(user2)
                        if (sum(user) > 21 && sum(user2) > 21) {
                            dealWin()
                        } else {
                            var again = prompt("Again?: ")
                            for(i = 0; i <100; i++ ){
                                if(again === "yes"){
                                    user.push(getCard())
                                    user2.push(getCard())
                                    usrHand()
                                    usrHand2()
                                    sum(user)
                                    sum(user2)
                                    if(sum(user) > 21 && sum(user2) > 21){
                                        return dealWin()
                                    } else {
                                        again = prompt("Again?: ")
                                    }
                                } else if(again === "no"){
                                    dealerShow()
                                    if(sum(dealer) > 21){
                                        betMoney = betMoney * 2
                                        return usrWin()
                                    } else if(sum(user) <= sum(dealer) && sum(user2) <= sum(dealer)){
                                        betMoney = betMoney * 2
                                        return usrWin()
                                    } else if(sum(user) <= sum(dealer) || sum(user2) <= sum(dealer)){
                                        return usrWin()
                                    } else {
                                        return dealWin()
                                    }
                                } else {
                                    again = prompt("Enter 'yes' or 'no': ")
                                } if(sum(user) > 21){
                                    return dealWin()
                                }
                            }
                            dealerShow()
                            if(sum(dealer) > 21 || sum(dealer) <= sum(user)){
                                return usrWin()
                            } else {
                                return dealWin()
                            }
                        }
                    } else if(choice === "stand"){
                        dealerShow()
                        sum(dealer)
                        if(sum(dealer) > 21 || sum(dealer) <= sum(user)){
                            usrWin()
                        } else {
                            dealWin()
                        }
                    }
                } else {
                    var choice = prompt("Would you like to hit, stand or double?: ") 
                }
            }
        }
    }
}

// Creates cards and add to deck
function createCards(){
    var count = 0
    var card
    for(i = 0; i < 52; i++){
        count++
        if(count > 13){
            count = 1
            card = "ace"
        } else if(count === 1){
            card = "ace"
        } else if(count === 11){
            card = "jack"
        } else if(count === 12){
            card = "queen"
        } else if(count === 13){
            card = "king"
        } else {
            card = count
        }
        deck.push(card)
    }
}

// Adds random card to deck
function getCard(){
    num = Math.floor(Math.random() * 52)
    return deck[num]
}

// Returns the value of the user or dealer's hand
function sum(u){
    var sum = 0
    var hasAce
    for(i = 0; i < u.length; i++){
        if(u[i] === "jack" || u[i] === "queen" || u[i] === "king"){
            sum += 10
        } else if(u[i] === "ace"){
            sum += 11
            hasAce = true
        } else {
            sum += u[i]
        }
    }
    if (hasAce == true){
        if(sum > 21){
            sum = sum - 10
            return sum
        } else {
            return sum
        }
    } else {
        return sum
    }
}

// Dealer win function
function dealWin(){
    dealHand()
    usrHand()
    alert("Dealer wins!")
    if(userIns === true){
        money = money - betMoney       
    } else if(userIns === false){
        money = money - (betMoney * 2)
    }
    if(money <= 0){
        alert("No money left, sorry!")
        return
    } else {
        playAgain()
    }
}

// Show cards after user hit, stands, etc.
function dealerShow(){
    dealHand()
    if(sum(dealer) <= 16){
        dealer.push(getCard())
        dealHand()
    }
}

// User win function
function usrWin(){
    dealHand()
    usrHand()
    alert("You win!")
    money += betMoney * 2
    playAgain()
}

// Place bet function
function bet(){
    for(i = 0; i < 10; i++){
        if(betMoney > money){
            betMoney= prompt("Insufficient funds. Enter a new value: ");      
        } else if (isNaN(betMoney)){
            betMoney= prompt("Please enter a number: ");
        } else if (betMoney <= 1){
            betMoney= prompt("How much would you like to bet?: ");
        } else if(isNaN(betMoney) == false && betMoney <= money){
            return start()
        } else {
            betMoney= prompt("How much would you like to bet?: ") ;
        }
    }
}

// Game function
function game(){
    alert("Welcome to blackjack!")
    money = money + 50 
    alert("You currently have: $" + money + " in you wallet.")
    var init = prompt("Want to play a game?: ")
    for(i = 0; i < 10; i++){
        if(init === "yes"){
            betMoney = prompt("How much would you like to bet?: ")
            return bet()        
        } else if(init === "no"){
            return
        } else {
            init = prompt("Please type 'yes' or 'no': ")
        }
    }
}

// Play again
function playAgain(){
    if(playAgain === "yes"){
        betMoney = prompt("How much would you like to bet?: ")
        user = []
        user2 = []
        dealer = []
        bet()
    } else {
        return
    }
}