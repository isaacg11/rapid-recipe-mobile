angular.module('starter.controllers', [])

.controller('DashCtrl', function(
  $scope, 
  $ionicModal, 
  User, 
  $ionicLoading, 
  $ionicActionSheet, 
  $state, 
  Food,
  $ionicScrollDelegate
  ) {

//GLOBAL VARS
  var page = 1;
  var data;

//SEARCH BY TEXT
  $scope.search = function(query) {
    $ionicLoading.show({
      template: 'Loading...'
    }); 

    data = {
      query : query.text,
      page: 1
    };

    Food.getRecipes(data).then(function(res){
      $scope.recipes = res.body.recipes;
      $scope.searchCompleted = true;
      $scope.next = true;
      $ionicLoading.hide();
    });
  };

//PAGINATE - NEXT
  $scope.pagNext = function() {
    $ionicLoading.show({
      template: 'Loading...'
    });
    page = page + 1;
    data = {
      query : data.query,
      page: page
    };
    Food.getRecipes(data).then(function(res){
      $scope.recipes = res.body.recipes;
      $ionicScrollDelegate.scrollTop();
      $ionicLoading.hide();
      $scope.next = true;
      if(page > 1) {
        $scope.previous = true;
      }
    });
  };

//PAGINATE - PREVIOUS
  $scope.pagPrevious = function() {
    $ionicLoading.show({
      template: 'Loading...'
    });
    page = page - 1;
    data = {
      query : data.query,
      page: page
    };
    Food.getRecipes(data).then(function(res){
      $scope.recipes = res.body.recipes;
      $ionicScrollDelegate.scrollTop();
      $ionicLoading.hide();
      $scope.next = true;
      if(page > 1) {
        $scope.previous = true;
      }
      else{
        $scope.previous = false;
      }
    });
  };

//ON PAGE LOAD, GET CURRENT USER
  $scope.loggedIn = true;

  // User.getUser().then(function(res){
  //   if(res === 'not logged in') {
  //     console.log('not logged in');
  //   }
  //   else{
  //     $scope.loggedIn = true;
  //   }
  // });

//SIGNUP
  $scope.signup = function(userInfo) {
    $ionicLoading.show({
      template: 'Loading...'
    });
    User.registerUser(userInfo).then(function(res){
      console.log(res);
      $scope.signupModal.hide();
      $ionicLoading.hide();
      $scope.user = true;
    });
  };

  $scope.logout = function() {
    User.endSession().then(function(){
      console.log('logout success!');
    });
  };

//LOGIN MODAL
  $ionicModal.fromTemplateUrl('login-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.loginModal = modal;
  });

  $scope.openLogin = function() {
    $scope.loginModal.show();
  };

//SIGNUP MODAL
  $ionicModal.fromTemplateUrl('signup-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.signupModal = modal;
  });

  $scope.openSignup = function() {
    $scope.signupModal.show();
  };

  $scope.goToMyFridge = function() {
    $state.go('myFridge');
  };

})

.controller('FridgeCtrl', function(
  $scope, 
  $ionicModal, 
  User, 
  $ionicLoading, 
  $ionicActionSheet, 
  $state, 
  Food,
  $ionicScrollDelegate
  ) {

//GLOBAL VARS
  var page = 1;
  var data,
      combinedIngredients;

//SEARCH BY FRIDGE INGREDIENTS
$scope.fridgeSearch = function(ingredient) {
  $ionicLoading.show({
    template: 'Loading...'
  }); 
  combinedIngredients = ingredient.meat+","+ingredient.dairy+","+ingredient.vegetables+","+ingredient.condiments;

  data = {
    query : combinedIngredients,
    page: 1
  };

  Food.getRecipes(data).then(function(res){
    $scope.recipes = res.body.recipes;
    $scope.fridgeSearchCompleted = true;
    $ionicLoading.hide();
    if(res.body.recipes.length < 30){
      $scope.next = false;
    }
    else{
      $scope.next = true;
    }
  });
};

//PAGINATE - NEXT
  $scope.pagNext = function() {
    $ionicLoading.show({
      template: 'Loading...'
    });
    page = page + 1;
    data = {
      query : data.query,
      page: page
    };
    Food.getRecipes(data).then(function(res){
      $scope.recipes = res.body.recipes;
      $ionicScrollDelegate.scrollTop();
      $ionicLoading.hide();
      $scope.next = true;
      if(page > 1) {
        $scope.previous = true;
      }
    });
  };

//PAGINATE - PREVIOUS
  $scope.pagPrevious = function() {
    $ionicLoading.show({
      template: 'Loading...'
    });
    page = page - 1;
    data = {
      query : data.query,
      page: page
    };
    Food.getRecipes(data).then(function(res){
      $scope.recipes = res.body.recipes;
      $ionicScrollDelegate.scrollTop();
      $ionicLoading.hide();
      $scope.next = true;
      if(page > 1) {
        $scope.previous = true;
      }
      else{
        $scope.previous = false;
      }
    });
  };


  $scope.goToMyFridge = function() {
    $scope.fridgeSearchCompleted = false;
    
  };

  $scope.goToDash = function() {
    $state.go('tab.dash');
  };


})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats, $ionicActionSheet) {
    // Show the action sheet

  $scope.show = function() {
  var hideSheet = $ionicActionSheet.show({
    buttons: [
      { text: 'Yes, Logout' },
    ],
    titleText: 'Would you like to exit app?',
    cancelText: 'Cancel',
    cancel: function() {          
      },
    buttonClicked: function(index) {
      User.endSession();
     }
  });
  };

  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
