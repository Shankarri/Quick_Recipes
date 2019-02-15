//intial array values
var ingredientsArray = [];
var dietArray = [];
var allergenArray = [];
var buttonCounter = 0;
//ready function
$(document).ready(function () {


    //on click function for adding ingredients to array
    $("#addIngredients-button").on("click", function () {
        if ($('#ingredientField').val().trim() === ""){
            $("#recipeGenerator")[0].reset()
            return;
        }
        else {
        var userInput = $('#ingredientField').val();
        ingredientsArray.push(userInput)
        $("#recipeGenerator")[0].reset() //clears search field
        var newItem = ($("<div id='ingredientsDiv"+ buttonCounter +"' value='"+ userInput +"' class='alert alert-danger' role='alert'>" + userInput + 
        "<button type='button' class='close' id="+ buttonCounter +"  aria-label='Close' data-ingredient-index=''>" +
        "<span>" + "X" + "</span>" +
        "</button>"+ 
       "</div>"));
       buttonCounter++;
        $('#ingredientsDisplay').append(newItem);
        console.log("Ingredients Array: ", ingredientsArray);
        }
    });

    //Remove Ingredient Function
    $(document).on("click", ".close", function () {
        var ingredientID = "#ingredientsDiv" + $(this).attr("id");
        var ingtext = $(ingredientID).attr("value");
        ingredientsArray.splice(ingredientsArray.indexOf(ingtext),1)
        $(ingredientID).remove()
        console.log("Ingredients Array: ", ingredientsArray);
    });
 

    //Pushing Diet Requirements to Array based on checkboxed clicked
    function addDietRequirements() {
        if ($('#keto').is(':checked')) {
            var keto = "406^Ketogenic"
            dietArray.push(keto)
        }
        if ($('#paleo').is(':checked')) {
            var paleo = "403^Paleo"
            dietArray.push(paleo)
        }
        if ($('#pescetarian').is(':checked')) {
            var pescetarian = "390^Pescetarian"
            dietArray.push(pescetarian)
        }
        if ($('#vegan').is(':checked')) {
            var vegan = "386^Vegan"
            dietArray.push(vegan)
        }
        if ($('#vegetarian').is(':checked')) {
            var vegetarian = "387^Lacto-ovo vegetarian"
            dietArray.push(vegetarian)
        }
        console.log("Diet Array: ", dietArray);
    };

    //Pushing Allergen Requirements to Array
    function addAllergenRequirements() {
        if ($('#glutenFree').is(':checked')) {
            var glutenFree = "393^Gluten-Free"
            allergenArray.push(glutenFree)
        }
        if ($('#peanutFree').is(':checked')) {
            var peanutFree = "394^Peanut-free"
            allergenArray.push(peanutFree)
        }
        if ($('#dairyFree').is(':checked')) {
            var dairyFree = "396^Dairy-Free"
            allergenArray.push(dairyFree)
        }
        if ($('#treeNutFree').is(':checked')) {
            var treeNutFree = "395^Tree Nut-Free"
            allergenArray.push(treeNutFree)
        }
        if ($('#wheatFree').is(':checked')) {
            var wheatFree = "392^Wheat-Free"
            allergenArray.push(wheatFree)
        }
        if ($('#eggFree').is(':checked')) {
            var eggFree = "397^Egg-Free"
            allergenArray.push(eggFree)
        }
        if ($('#sesameFree').is(':checked')) {
            var sesameFree = "399^Sesame-Free"
            allergenArray.push(sesameFree)
        }
        if ($('#seafoodFree').is(':checked')) {
            var seafoodFree = "398^Seafood-Free"
            allergenArray.push(seafoodFree)
        }
        console.log("Allergen Array: ", allergenArray);
    };


    //Adds ingredients to yummly API and runs Yummly API call
    $("#search-button").on("click", function () {

        addDietRequirements();
        addAllergenRequirements();
        var ingredientsArrayOutput = ingredientsArray.join('+');
        var allergenArrayOutput = allergenArray.join('&allowedAllergy[]=')
        var dietArrayOutput = dietArray.join('&allowedDiet[]=')
        console.log(ingredientsArrayOutput)
        console.log(allergenArrayOutput)
        console.log(dietArrayOutput)

        var APIcall = ingredientsArrayOutput + "&allowedAllergy[]=" + allergenArrayOutput + "&allowedDiet[]=" + dietArrayOutput;
        console.log(APIcall)
        searchRecipe(APIcall);
    });

    //API call the search results.
    // Yummly API Key 404c3b636f09a6a81ea04ee17031d1d7
    function searchRecipe(APIcall) {

        var queryURL = "https://api.yummly.com/v1/api/recipes?_app_id=23c56a38&_app_key=0e54a8ce40a665ee3dc2dc122f3dbac7&q=" + APIcall;
        console.log(queryURL)
        $.ajax({
            url: queryURL,
            method: "GET",
            dataType: "json"
        })
        .done(function (response) {
            sessionStorage.removeItem('apiCallResults');
            sessionStorage.clear();
            sessionStorage.setItem('apiCallResults', JSON.stringify(response));
            openResultsPage();
        })
    }

})
function openResultsPage(){
    window.location.href = "results3.html";
}










//***********DO NOT USE CODE, FOR REFERENCE ONLY******************** */


// window.onload = function() {
//     displayRecipes(response);
//   };

    //Displays recipes based on API call
    //Display Recipe API Call http://api.yummly.com/v1/api/recipe/recipe-id?_app_id=23c56a38&_app_key=0e54a8ce40a665ee3dc2dc122f3dbac7
    //Specific display receipe API call is a seperate function and not needed at this time for our uses
    //Using info generated by original API call
    // function displayRecipes(data) {
    //     console.log(data)
    //     $("#placeholderRecipeDisplay2").empty();
    //     var results = data.matches;
    //     for (var i = 0; i < results.length; i++) {
    //         var recipeID = "<div class='recipeID'> Recipe ID: " + (results[i].id) + " </div>";
    //         var image = '<img src= " ' + results[i].imageUrlsBySize[90].slice(0, -6)
    //             + '" class="recipeImages" style= "width:380px;">'
    //             + recipeID;
    
    //         image2 = "<div class='col-md-4'>" + image + "</div>";
    //         $('#placeholderRecipeDisplay2').append(image2);
    //         sessionStorage.removeItem('apiCallResults');
    //         sessionStorage.clear();
    //     }
    // }
    
    // $("#search-button").on("click", function () {
    //     console.log (data)
    //     displayRecipes(data);
    // });
    // })


