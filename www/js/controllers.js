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

//SEARCH BY TEXT
  var page = 1;
  var data;

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
      $scope.hideOptions = true;
      $scope.searchCompleted = true;
      $scope.next = true;
      $ionicLoading.hide();
    });
  };

//VIEW RECIPE DETAILS
  $scope.viewRecipe = function(recipe) {
    $ionicLoading.show({
      template: 'Loading...'
    }); 

    var rId = {
      id : recipe.recipe_id,
    };

    Food.getDetails(rId).then(function(res){
      var info = [];
      info.push(res.body.recipe);
      $scope.details = info;
      $scope.ingredients = res.body.recipe.ingredients;
      $scope.hideOptions = true;
      $scope.searchCompleted = false;
      $scope.detailsCompleted = true;
      $ionicScrollDelegate.scrollTop();
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

//NAVIGATE TO MY FRIDGE
  $scope.goToMyFridge = function() {
    $state.go('myFridge');
  };

//RANDOM RECIPE
  var ingredients,
      num;

  $scope.random = function() {
    $ionicLoading.show({
      template: 'Loading...'
    });

    ingredients = [
      "beef",
      "chicken", 
      "pork", 
      "fish", 
      "lettuce", 
      "cheese", 
      "eggs", 
      "tomatoes",
      "onions",
      "potatoes",
      "apple",
      "pasta",
      "strawberry",
      "chocolate",
      "bread",
      "rice",
      "beans",
      "corn",
      "ice cream"
    ];

    for(var i = 0; i < ingredients.length; i++) {
      num = Math.floor((Math.random() * 18) + 1);
    } 

    data = {
      query : ingredients[num],
      page: 1
    };

    Food.getRecipes(data).then(function(res){
      $scope.recipes = res.body.recipes;
      $scope.hideOptions = true;
      $scope.searchCompleted = true;
      $scope.next = true;
      $ionicLoading.hide();
    });
  };

//RESET SEARCH
  $scope.reset = function() {
    window.location.reload(true);
  };

//GO TO COOKING INSTRUCTIONS
  $scope.goToInstructions = function(url) {
    window.location = url;
  };

  $scope.saveRecipe = function(instructions) {
    $ionicLoading.show({
      template: 'Loading...'
    });

    var newRecipe = {
      title: instructions.title,
      image: instructions.image_url,
      rId: instructions.recipe_id
    };

    Food.addRecipe(newRecipe).then(function(res){
      $ionicLoading.hide();
      toastr.success('Recipe Saved!');
    });
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
  combinedIngredients = ingredient.meat+","+ingredient.dairy+","+ingredient.vegetables+","+ingredient.grains+","+ingredient.condiments;

  data = {
    query : combinedIngredients,
    page: 1
  };

  Food.getRecipes(data).then(function(res){
    $scope.recipes = res.body.recipes;
    $scope.hideOptions = true;
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

//NAVIGATE BACK TO FRIDGE VIEW
  $scope.backToMyFridge = function() {
    $scope.fridgeSearchCompleted = false;

  };

//NAVIGATE TO SEARCH VIEW
  $scope.goToDash = function() {
    $state.go('tab.dash');
  };

//VIEW FRIDGE RECIPE DETAILS
  $scope.viewFridgeRecipe = function(recipeId) {
    $ionicLoading.show({
      template: 'Loading...'
    }); 

    var rId = {
      id : recipeId,
    };

    Food.getDetails(rId).then(function(res){
      console.log(res);   
      var info = [];
      info.push(res.body.recipe);
      $scope.details = info;
      $scope.ingredients = res.body.recipe.ingredients;
      $scope.hideOptions = true;
      $scope.fridgeSearchCompleted = false;
      $scope.detailsCompleted = true;
      $ionicScrollDelegate.scrollTop();
      $ionicLoading.hide();
    });
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
