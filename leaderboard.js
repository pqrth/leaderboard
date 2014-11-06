// MongoDB setup
PlayersList = new Mongo.Collection('players');

// code to be executed on server only
if(Meteor.isServer){
    console.log("Hello server");
}

// code to be executed on client only
if(Meteor.isClient){

    // Helper function, generally used to generate HTML
    Template.leaderboard.helpers({
        'player': function() {
            return PlayersList.find({}, {sort: {score: -1, name: 1} })
        },
        'selectedClass': function(){
            var playerId = this._id;
            var selectedPlayer = Session.get('selectedPlayer')
            if(playerId == selectedPlayer){
                return "selected"
            }
        },
        'showSelectedPlayer': function(){
            var selectedPlayer = Session.get('selectedPlayer');
            return PlayersList.findOne(selectedPlayer)
        }
    });

    // Functions handling events for leaderboard template
    Template.leaderboard.events({
        'click .player': function(){
            var playerId = this._id;
            Session.set('selectedPlayer', playerId);
        },
        'click .increment': function(){
            var selectedPlayer = Session.get('selectedPlayer');
            PlayersList.update(selectedPlayer, {$inc: {score: 5}});
        },
        'click .decrement': function(){
            var selectedPlayer = Session.get('selectedPlayer');
            PlayersList.update(selectedPlayer, {$inc: {score: -5}});
        },
        'click .remove': function(){
            var selectedPlayer = Session.get('selectedPlayer');
            PlayersList.remove(selectedPlayer);
        }
    });

    // Functions handling events for addPlayerForm template
    Template.addPlayerForm.events({
        'submit form': function(evt){
            evt.preventDefault();
            var playerNameVar = event.target.playerName.value;
            PlayersList.insert({
                name: playerNameVar,
                score: 0
            })
        }
    });
}