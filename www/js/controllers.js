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


//ON PAGE LOAD, GET CURRENT USER
  User.getUser().then(function(res){
    if(res === 'not logged in') {
      $scope.searchCompleted = true;
    }
    else{
      $scope.loggedIn = true;
    }
  });

  // $scope.logout = function() {
  //   User.endSession().then(function(){
  //     console.log('logout success!');
  //   });
  // };

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
      $scope.searchCompleted = true;
      $scope.detailsCompleted = false;
      $scope.hideSearch = true;
      $scope.hideIcon = true;
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
      $scope.searchCompleted = false;
      $scope.detailsCompleted = true;
      $scope.hideSearch = true;
      $scope.hideIcon = true;
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

  $scope.login = function(userInfo) {
    $ionicLoading.show({
      template: 'Loading...'
    });
    User.loginUser(userInfo).then(function(res){
      console.log(res);
      $scope.loginModal.hide();
      $ionicLoading.hide();
      $scope.user = true;
    });
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

  $scope.signup = function(userInfo) {
    $ionicLoading.show({
      template: 'Loading...'
    });
    User.registerUser(userInfo).then(function(res){
      $scope.signupModal.hide();
      $ionicLoading.hide();
      $scope.user = true;
    });
  };

//NAVIGATE TO MY FRIDGE
  $scope.goToMyFridge = function() {
    $state.go('myFridge');
  };

//RANDOM RECIPES
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
      $scope.searchCompleted = true;
      $scope.hideSearch = true;
      $scope.hideIcon = true;
      $scope.next = true;
      $ionicLoading.hide();
    });
  };

//TRENDING RECIPES
  $scope.trending = function() {
    $ionicLoading.show({
      template: 'Loading...'
    });
    data = {
      page: 1
    };
    Food.getTrending(data).then(function(res){
      console.log(res);
      $scope.recipes = res.body.recipes;
      $scope.searchCompleted = true;
      $scope.hideSearch = true;
      $scope.hideIcon = true;
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
    $scope.hideOptions = false;
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

.controller('recipesCtrl', function($scope, $ionicLoading, $ionicScrollDelegate, User, Food) {
//ON PAGE LOAD, GET CURRENT USER
  User.getUser().then(function(res){
    $ionicLoading.show({
      template: 'Loading...'
    }); 
    Food.getSavedRecipes(res.user.id).then(function(res){
      if(res.data.length === 0){
        $ionicLoading.hide();
      }
      else{
        $scope.saved = res.data;
        $scope.searchCompleted = true;
        $scope.hideMessage = true;
        $ionicLoading.hide();
      }
    });
  });
//VIEW RECIPE DETAILS
  var objId,
      ind;

  $scope.viewRecipe = function(recipe, index) {
    $ionicLoading.show({
      template: 'Loading...'
    }); 

    var rId = {
      id : recipe.rId,
    };

    objId = recipe.id;
    ind = index;

    Food.getDetails(rId).then(function(res){
      var info = [];
      info.push(res.body.recipe);
      $scope.details = info;
      $scope.ingredients = res.body.recipe.ingredients;
      $scope.searchCompleted = false;
      $scope.detailsCompleted = true;
      $ionicScrollDelegate.scrollTop();
      $ionicLoading.hide();
    });
  };
//DELETE RECIPE
  $scope.deleteRecipe = function() {
    $ionicLoading.show({
      template: 'Loading...'
    }); 

    Food.removeRecipe(objId).then(function(res){
      $scope.saved.splice(ind, 1);
      $scope.detailsCompleted = false;
      $ionicLoading.hide();
      toastr.success('Recipe Deleted!');
    });
  };

})

.controller('AccountCtrl', function($scope, $ionicLoading, $ionicPopup, User) {
//ON PAGE LOAD, GET CURRENT USER
  var userId,
      userEmail,
      info,
      status;

  User.getUser().then(function(res){
    $ionicLoading.show({
      template: 'Loading...'
    });

    userId = res.user.id;
    userEmail = res.user.email;
    $scope.optionEmail = res.user.email_sub;
    $scope.optionText = res.user.text_sub;
    $ionicLoading.hide();
  });

//SUBSCRIBE TOGGLE > EMAIL RECIPES
  $scope.emailRecipes = function(email) {
    if(email === true) {
      info = {
        email: userEmail,
      };

      User.activateEmail(info).then(function(){
        status = {
          email_sub: true
        };

        User.changeStatus(status, userId).then(function(){
          toastr.success("Email Activated");
        });
      });
    }
    else{
      info = {
        email: userEmail,
      };

      User.getActiveEmail(info).then(function(res){
        User.disableEmail(res.data[0]._id).then(function(){
          status = {
            email_sub: false
          };

          User.changeStatus(status, userId).then(function(){
            toastr.success("Email Disabled");
          });
        });
      });
    }
  };

//SUBSCRIBE TOGGLE > TEXT RECIPES
  $scope.textRecipes = function(text) {
    if(text === true) {
      $scope.data = {};

      var myPopup = $ionicPopup.show({
        template: '<input type="text" ng-model="data.number">',
        title: 'Enter Phone Number',
        subTitle: 'i.e 1234567890',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Submit</b>',
            type: 'button-dark',
            onTap: function(e) {
              if (!$scope.data.number) {
                toastr.error('Please enter phone number');
                e.preventDefault();
              } else {
                var data = $scope.data.number;
                processTextSub(data);
              }
            }
          }
        ]}
      );
    }
    else{
      info = {
        email: userEmail,
      };

      User.getActiveText(info).then(function(res){
        User.disableText(res.data[0]._id).then(function(){
          status = {
            text_sub: true
          };

          User.changeStatus(status, userId).then(function(){
            toastr.success("Texts Disabled");
          });
        });
      });
    }
  };

  function processTextSub(number) {
    info = {
      phone: number,
      email: userEmail
    };

    User.activateText(info).then(function(){
        status = {
          text_sub: true
        };

        User.changeStatus(status, userId).then(function(){
          toastr.success("Texts Activated");
        });
    });
  }


});
