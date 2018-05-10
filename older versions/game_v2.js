// Add more money
$("#more").unbind("click").on("click", function(){
    money = money + 50
    updateMoney()
})

// Add bet buttons
$("#bet10").unbind("click").on("click", function(){
    betMoney += 10
    updateBets()
})

$("#bet20").unbind("click").on("click", function(){
    betMoney += 20
    updateBets()
})

$("#bet50").unbind("click").on("click", function(){
    betMoney += 50
    updateBets()
})

$("#bet100").unbind("click").on("click", function(){
    betMoney += 100
    updateBets()
})

$("#resetBet").unbind("click").on("click", function(){
    betMoney = 0
    updateBets()
})

// Start game button
$("#control").unbind("click").on("click", function(){
    if(betMoney === 0){
        $("#err").html("Place a bet to play!")
        $("#error").fadeIn(1000)
    } else if(betMoney > money) {
        $("#err").html("Insufficient funds!")
        $("#error").fadeIn(1000)
        betMoney = 0
        updateBets()
    } else {
        $("#error").hide()
        $(".bets").slideUp(1000, function(){
            $("h2").fadeIn(1000, function(){
                $("#dealer").slideDown(1500)
                $(".buttons").fadeIn(2000)
            })
            game()
        })
        $(this).fadeOut(1000)
    }
})

// Show money ammount
function updateMoney(){
    $("#money").html(money)
}

// Show bets
function updateBets(){
    $("#bets").html("Bet: $" + betMoney)
}

// Show user's cards in list
function usrHand(){
    $("#user").empty()
    $("#user").hide()
    for(i = 0; i < user.length; i++){
        $("#user").append("<div class='col-md-4'><div class='thumbnail userCards'><p>" + user[i] + "</p></div></div>")
        $("#user").slideDown(1500)
    }
    $("#uScore").html(" value: " + sum(user))
}

// Show dealer's cards in list
function dealHand(){
    $("#dealer").empty()
    $("#dealer").hide()
    for(i = 0; i < dealer.length; i++){
        $("#dealer").append("<div class='col-md-4'><div class='thumbnail dealerCards'><p>" + dealer[i] + "</p></div></div>")
        $("#dealer").slideDown(1500)
    }
    $("#dScore").html(" value: " + sum(dealer))
}

var money = 0;
var deck = []
var user = []
var user1 = []
var user2 = []
var dealer = []
var userIns = false
var betMoney = 0

// Game logic
function game(){
    createCards()
    user.push(getCard())
    user.push(getCard())
    dealer.push(getCard())
    dealer.push(getCard())
    usrHand()
    $("#dealer").html("<div class='col-md-4'><div class='thumbnail dealerCards'><p>" + dealer[0] + "</p></div></div>")
    $("#dealer").slideDown(1500)
    if(sum(user) === 21){
        usrWin()
    } else if(sum(dealer) === 21){
        dealWin()
    } else {
        if(dealer[0] === "ace"){
            $("#ins").fadeIn(2000)
            $("#ins").click(function(){
                userIns = true
                $("#ins").fadeOut(1000)
            })
        } if(sum(user) < 21){
            if(sum(dealer) === 21){
                dealWin()
            } else if(sum(user) > 21) {
                dealWin()
            } else {
                $("#hit").unbind("click").on("click", function(){
                    $("#double").fadeOut(1000)
                    $("#surr").fadeOut(900)
                    $("#ins").fadeOut(800)
                    user.push(getCard())
                    usrHand()
                    if (sum(user) > 21) {
                        dealWin()
                    } else if(sum(user) === 21){
                        usrWin()
                    } else {
                        return
                    }
                })
                $("#stand").unbind("click").on("click", function(){
                    dealerShow()
                    if(sum(dealer) > 21){
                        usrWin()
                    } else if(sum(user) > 21){
                        dealWin()
                    } else if(sum(user) >= sum(dealer)){
                        usrWin()
                    } else {
                        dealWin()
                    }
                })
                $("#surr").unbind("click").on("click", function(){
                    usrHand()
                    dealHand()
                    $("#alert").addClass("alert-danger")
                    $("#alert").fadeIn()
                    $("#win").html("You lose! -$" + betMoney * 0.5)
                    money = money - (betMoney * 0.5)
                    updateMoney()
                    $(".buttons").fadeOut()
                    $(".bets").fadeIn()
                    betMoney = 0
                    updateBets()
                    $("#playAgain").fadeIn()
                })
                $("#double").unbind("click").on("click", function(){
                    user.push(getCard())
                    usrHand()
                    betMoney = betMoney * 2
                    if(sum(user) > 21){
                        dealWin()
                    } else {
                        dealerShow()
                        if(sum(dealer) > 21){
                            usrWin()
                        } else if(sum(user) >= sum(dealer)){
                            usrWin()
                        } else {
                            dealWin()
                        }
                    }
                })
                if(sum(user) === 20){
                    $("#split").fadeIn(1500)
                }
                $("#split").click(function(){
                    user1.push(user[0])
                    user2.push(user[1])
                    user.push(getCard())
                    user2.push(getCard())
                    usrHand1()
                    usrHand2()
                    $("sHit").click(function(){
                        user.push(getCard())
                        user2.push(getCard())
                        usrHand()
                        usrHand2()
                        if (sum(user) > 21 && sum(user2) > 21) {
                            dealWin()
                        }
                    })
                    $("sPlay").click(function(){
                        dealerShow()
                        if(sum(dealer) > 21){
                            betMoney = betMoney * 2
                            usrWin()
                        } else if(sum(user) <= sum(dealer) && sum(user2) <= sum(dealer)){
                            betMoney = betMoney * 2
                            usrWin()
                        } else if(sum(user) <= sum(dealer) || sum(user2) <= sum(dealer)){
                            usrWin()
                        } else {
                            dealWin()
                        }
                    })
                    $("sStand").click(function(){
                        dealerShow()
                        if(sum(dealer) > 21 || sum(dealer) <= sum(user)){
                            usrWin()
                        } else {
                            dealWin()
                        }
                    })
                })
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
        }
    }
    return sum
}

// Dealer win function
function dealWin(){
    dealHand()
    $(".buttons").fadeOut(1000)
    if(userIns === true){
        $("#win").html("You lose! -$" + betMoney)
        $("#alert").addClass("alert-danger")
        $("#alert").fadeIn(1000, function(){
            $(".bets").slideDown(1500, function(){
                $("#playAgain").fadeIn(1000)
            })
        })
        money = money - betMoney       
    } else if(userIns === false){
        $("#win").html("You lose! -$" + betMoney * 2)
        $("#alert").addClass("alert-danger")
        $("#alert").fadeIn(1000, function(){
            $(".bets").slideDown(1500, function(){
                $("#playAgain").fadeIn(1000)
            })
        })
        money = money - (betMoney * 2)
    }
    updateMoney()
    betMoney = 0
    updateBets()
}

// Show cards after user press play.
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
    $("#win").html("You win $" + betMoney * 2 + "!")
    $("#alert").addClass("alert-success")
    $("#alert").fadeIn(1000, function(){
        $(".bets").slideDown(1500, function(){
            $("#playAgain").fadeIn(1000)
        })
    })
    money = money + (betMoney * 2)
    updateMoney()
    $(".buttons").fadeOut(500)
    betMoney = 0
    updateBets() 
}

// Play again
$("#playAgain").unbind("click").on("click", function(){
    if(betMoney === 0){
        $("#err").html("Place bet if you want to play again!")
        $("#error").fadeIn(1000)
    } else if(betMoney > money) {
        $("#err").html("Insufficient funds!")
        $("#error").fadeIn(1000)
        betMoney = 0
        updateBets()
    } else {
        $("#user").slideUp(1000)
        $("#dealer").slideUp(1000)
        $("#uScore").empty()
        $("#dScore").empty()
        $("#win").empty()
        $("#error").hide()
        $("#err").empty()
        $("#alert").removeClass("alert-success")
        $("#alert").removeClass("alert-danger")
        $("#playAgain").fadeOut(1000)
        $("#ins").fadeOut(1000)
        $("#split").fadeOut(1000)
        $("#alert").fadeOut(1000)
        $(".bets").slideUp(1000, function(){
            $(".buttons").fadeIn(1000)
            $("#double").fadeIn(900)
            $("#surr").fadeIn(800)
        })
        user = []
        dealer = []
        userIns = false
        setTimeout(function(){
            game()
        }, 1500)
    }
})

