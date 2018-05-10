var game = {
    deck : [],
    user : [],
    dealer : [],
    bet_money : 0,
    money : 1000,
    first_hand : true,
}

// Game logic
function start_game(){
    $("#current_bet").html("Current Bet: $" + game.bet_money)
    create_cards()
    get_card('user', 2)
    get_card('dealer', 2)
    Display.init()
    setTimeout(function(){
        win.check()
    }, 2000)
    $("#hit").unbind("click").on("click", function(){
        get_card('user', 1)
        win.check()
    })
    $("#stand").unbind("click").on("click", function(){
        get_card('dealer')
        win.end()
    })
    $("#surr").unbind("click").on("click", function(){
        get_card('dealer')
        Winner('surrender')
    })
    $("#double").unbind("click").on("click", function(){
        get_card('dealer')
        get_card('user', 1)
        game.bet_money = game.bet_money * 2
        win.end()
    })
}

// Controls the money functionality
var Money = {
    bet : function(ammount = 0) {
        // Increase bet or reset bet
        if (ammount) {
            game.bet_money += ammount
            this.update_bets()
            this.update_money()
        } else {
            game.bet_money = 0
            this.update_bets()
            this.update_money()
        }
    },

    // Add more money
    add_money : function(ammount = 50){
        game.money += ammount
        this.update_money()
    },

    // Display bets
    update_bets : function() {
        $("#bets").html("$" + game.bet_money)
    },

    // Show money ammount
    update_money : function() {
        $("#money").html(game.money)
    }
}

// Create deck object
function Card(card, value, suit){
    this.card = card
    this.value = value
    this.suit = suit
}

// Add random card to hand
function get_card(user, ammount = 0, first_hand = false){
    for(i = 0; i < ammount; i++){
        num = Math.floor(Math.random() * game.deck.length)
        if (user == 'user'){
            game.user.push(game.deck[num])
            $("<div style='display: none'; class='col-md-2'><div id = 'user_card_" + game.user.length.toString() + 
            "'class='thumbnail userCards'><h2>" + game.deck[num].suit + 
            "</h2><p>" + game.deck[num].card + "</p></div></div>").appendTo($('#user')).fadeIn(500);
        } else if (user == 'dealer'){
            game.dealer.push(game.deck[num])
            $("<div style='display: none'; class='col-md-2'><div id = 'dealer_card_" + game.dealer.length.toString() +
             "' class='thumbnail dealerCards'><h2>" + game.deck[num].suit + 
             "</h2><p>" + game.deck[num].card + "</p></div></div>").appendTo($('#dealer')).fadeIn(500);
        }
        game.deck.splice(num, 1)
    }
    if (game.first_hand){
        $("#dealer_card_1").show()
    } else {
        $(".dealerCards").fadeIn(500)
    }
    $("#dScore").html(sum('dealer'))
    $("#uScore").html(sum('user'))
}

// Creates cards and add to deck
function create_cards(){
    var count = 0
    var suit = ''
    var card
    for(i = 0; i < 52; i++){
        count++
        if(count > 13){
            count = 1
            card = "ace"
            value = "ace"
        } else if(count === 1){
            card = "ace"
            value = "ace"
        } else if(count === 11){
            card = "jack"
            value = 10
        } else if(count === 12){
            card = "queen"
            value = 10
        } else if(count === 13){
            card = "king"
            value = 10
        } else {
            card = count
            value = count
        }
        if(i < 13){
            suit = "diamond"
        } else if (i < 26){
            suit = "spade"
        } else if (i < 39){
            suit = "heart"
        } else if (i < 52){
            suit = "club"
        }
        var new_card = new Card(card, value, suit)
        game.deck.push(new_card)
    }
}

// Returns the value of the user or dealer's hand
function sum(user){
    var this_user
    if(user == 'user'){
        this_user = game.user
    } else if (user == 'dealer'){
        this_user = game.dealer
    }
    var sum = 0
    var hasAce
    for(i = 0; i < this_user.length; i++){
        if(this_user[i].card === "ace"){
            sum += 11
            hasAce = true
        } else {
            sum += this_user[i].value
        }
    }
    if (hasAce == true){
        if(sum > 21){
            sum = sum - 10
        }
    }
    if (game.first_hand && this_user == game.dealer){
        if (this_user.length > 1){
            sum = this_user[0].value
        } else {
            return
        }
    }
    return sum
}

// Win functions
function Winner(winner){
    if(winner == 'user'){
        $("#win").html("You won $" + game.bet_money * 2 + "!")
        $("#alert").addClass("alert-success")
        game.money = game.money + (game.bet_money * 2)
    } else if (winner == 'dealer'){
        $("#win").html("You lose! -$" + game.bet_money * 2)
        $("#alert").addClass("alert-danger")
        game.money = game.money - (game.bet_money * 2)
    } else if (winner == 'surrender'){
        $("#win").html("You lose! -$" + game.bet_money * 0.5)
        $("#alert").addClass("alert-danger")
        game.money = game.money - (game.bet_money * 0.5)
    }
    $("#alert").fadeIn(1000)
    Display.end_game()
    Money.update_money()
}

// Win checker
var win = {
    check : function(){
        get_card('user')
        get_card('dealer')            
        if (sum('dealer') === 21){
            Winner('dealer')
        } else if (sum('dealer') > 21){
            Winner('user')
        }
        if(sum('user') === 21){
            Winner('user')
        } else if(sum('user') > 21){
            Winner('dealer')
        }
    },
    end : function(){
        game.first_hand = false
        get_card('dealer')
        while (sum('dealer') <= 16){
            get_card('dealer', 1)
            sum('dealer')
        }
        if(sum('user') === 21){
            Winner('user')
        } else if(sum('user') > 21){
            Winner('dealer')
        } else if(sum('user') >= sum('dealer') || sum('dealer') > 21){
            Winner('user')
        } else if(sum('user') < sum('dealer')){
            Winner('dealer')
        }
    }
}

// Display functions
var Display = {
    alert : function(type){
        if(type == 'no bet'){
            $("#err").html("Place bet if you want to play!")
            $("#error").fadeIn()
        } else if (type == 'no funds'){
            $("#err").html("Insufficient funds!")
            $("#error").fadeIn()
            Money.bet() 
        } else {
            $("#error").hide()
        }
    },
    check : function(){
        if(game.bet_money === 0){
            this.alert('no bet')
        } else if(game.bet_money > game.money){
            this.alert('no funds')
        } else {
            $("#error").fadeOut()
            return false 
        }
    },
    init : function(){
        $("#control").fadeOut(1000)
        $(".bets").fadeOut(1000, function(){
            $("#current_bet").fadeIn()
            $(".cards").fadeIn(1000)
            $(".buttons").fadeIn(900)
        })
    },
    end_game : function(){
        $(".buttons").fadeOut(1000, function(){
            $("#playAgain").fadeIn(1000)
        })
    },
    reset : function(){
        $("#alert").fadeOut(1000)
        $(".cards").fadeOut(900)
        $("#playAgain").fadeOut(800)
        $("#current_bet").fadeOut(1000, function(){
            game.bet_money = 0
            $("#bets").html("$0")
            $("#control").fadeIn(1000)
            $(".bets").fadeIn(1000)
            game.deck = []
            game.user = []
            game.dealer = []
            game.first_hand = true
            $("#user").empty()
            $("#dealer").empty()
            $("#alert").removeClass("alert-danger")
            $("#alert").removeClass("alert-success")
        })
    }
}

// Events
// Start game button
$("#control").unbind("click").on("click", function(){
    if(Display.check() == false){
        start_game()
    }
})

// Play again
$("#playAgain").unbind("click").on("click", function(){
    Display.reset()
})

// Add more money
$("#more").unbind("click").on("click", function(){
    Money.add_money()
})
// Add bet buttons
$("#bet10").unbind("click").on("click", function(){
    Money.bet(10)
})
$("#bet20").unbind("click").on("click", function(){
    Money.bet(20)
})
$("#bet50").unbind("click").on("click", function(){
    Money.bet(50)
})
$("#bet100").unbind("click").on("click", function(){
    Money.bet(100)
})
$("#resetBet").unbind("click").on("click", function(){
    Money.bet()
})