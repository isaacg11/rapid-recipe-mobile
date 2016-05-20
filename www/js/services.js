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
    },
    loginUser: function(userInfo) {
      var q = $q.defer();
      Stamplay.User.login(userInfo).then(function(){
        q.resolve();
      }, function(err) {
        console.log(err);
      });
      return q.promise;
    },
    getActiveEmail: function(info) {
      var q = $q.defer();
      Stamplay.Query('object','email_subscriber').equalTo('email', info.email)
      .exec(function(err, res){
        if(err) return console.log(err);
        q.resolve(res);
      });
      return q.promise;
    },
    activateEmail: function(info) {
      var q = $q.defer();
      Stamplay.Object('email_subscriber').save(info).then(function(){
        q.resolve();
      });
      return q.promise;
    },
    disableEmail: function(id) {
      var q = $q.defer();
      Stamplay.Object('email_subscriber').remove(id).then(function(){
        q.resolve();
      });
      return q.promise;
    },
    getActiveText: function(info) {
      var q = $q.defer();
      Stamplay.Query('object','text_subscriber').equalTo('email', info.email)
      .exec(function(err, res){
        if(err) return console.log(err);
        q.resolve(res);
      });
      return q.promise;
    },
    activateText: function(info) {
      var q = $q.defer();
      Stamplay.Object('text_subscriber').save(info).then(function(){
        q.resolve();
      });
      return q.promise;
    },
    disableText: function(id) {
      var q = $q.defer();
      Stamplay.Object('text_subscriber').remove(id).then(function(){
        q.resolve();
      });
      return q.promise;
    },
    changeStatus : function(status, id){
      var q = $q.defer();
      Stamplay.User.update(id, status).then(function() {
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
    },
    getTrending : function(data){
      var q = $q.defer();
      Stamplay.Codeblock("trending").run(data).then(function(err) {
        q.resolve(err);
      }, function(err) {
        console.log(err);
      });
      return q.promise;
    },
    getDetails : function(rId){
      var q = $q.defer();
      Stamplay.Codeblock("details").run(rId).then(function(err) {
        q.resolve(err);
      }, function(err) {
        console.log(err);
      });
      return q.promise;
    },
    addRecipe : function(newRecipe){
      var q = $q.defer();
      Stamplay.Object("recipe").save(newRecipe).then(function(res) {
        q.resolve(res);
      }, function(err) {
        console.log(err);
      });
      return q.promise;
    },
    getSavedRecipes : function(id){
      var q = $q.defer();
      Stamplay.Query('object','recipe').equalTo('owner', id)
      .exec(function(err, res){
        if(err) return console.log(err);
        q.resolve(res);
      });
      return q.promise;
    },
    removeRecipe : function(id){
      var q = $q.defer();
      Stamplay.Object("recipe").remove(id).then(function(res) {
        q.resolve(res);
      }, function(err) {
        console.log(err);
      });
      return q.promise;
    }
  };
}]);

