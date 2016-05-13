angular.module('starter.services', [])

//USER SERVICE
.factory('User', ["$q", function($q) {
  return {
    getUser: function() {
      var data;
      var q = $q.defer();
      Stamplay.User.currentUser().then(function(res){
        if(res){
          data = res;
        }
        else{
          data = "not logged in";
        }
        q.resolve(data);
      });
      return q.promise;
    },
    registerUser: function(userInfo) {
      var q = $q.defer();
      Stamplay.User.signup(userInfo).then(function(res){
        q.resolve(res);
      });
      return q.promise;
    },
    endSession: function() {
      var q = $q.defer();
      Stamplay.User.logout().then(function(){
        q.resolve();
      });
      return q.promise;
    }
  };
}])

//FOOD SERVICE
.factory('Food', ["$q", function($q) {
  return {
    getRecipes : function(data){
      var q = $q.defer();
      Stamplay.Codeblock("recipes").run(data).then(function(err) {
        q.resolve(err);
      }, function(err) {
        console.log(err);
      });
      return q.promise;
    }
  };
}])


.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
