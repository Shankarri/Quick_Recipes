let data = JSON.parse(sessionStorage.getItem('apiCallResults'));
//console.log(data.matches);

var myrecipe =[];

$("#wine-column").hide();
$("#wine-price-details").hide();


function onLoadFunction() {
    displayRecipes(data);
}

//Displays recipes based on API call
//Display Recipe API Call http://api.yummly.com/v1/api/recipe/recipe-id?_app_id=23c56a38&_app_key=0e54a8ce40a665ee3dc2dc122f3dbac7
//Specific display receipe API call is a seperate function and not needed at this time for our uses
//Using info generated by original API call
function displayRecipes(data) {
    var results = data.matches;
    for (var index = 0; index < 5; index++) {
    //    console.log (myrecipe);
       var divId = "#recipe-div-"+index;
       var divTitle = "#recipe-title-"+index;
        $(divId).addClass("text-center");
        $(divTitle).append("<p>"+results[index].recipeName +"</p>");
        $(divId).append("<img class='recipeImages w-100' style='height:150px;' id='img_"+(results[index].id)+"' src='"+results[index].imageUrlsBySize[90].slice(0, -6) +"'/>");
        $(divId).append("<p hidden id='recipeName_"+ (results[index].id)+"'>" + (results[index].recipeName) + " </p>");
        $(divId).append("<p hidden id='ingredientsList_"+ (results[index].id)+"'>" + (results[index].ingredients) + " </p>"); 
        $(divId).attr("id",results[index].id);  
    }
    $(".side-recipe-div")[0].click();
}


$(".side-recipe-div").on("click", function () {

    var clickedId = $(this).attr("id");
    console.log("clickedId",clickedId);

    var recipeNameId = "#recipeName_" + clickedId;
    var ingredientsListId = "#ingredientsList_" + clickedId;
    var imgId = "#img_" + clickedId;
    
    var recipeName = $(recipeNameId).text();
    var imgSrc = $(imgId).attr("src");
    var ingredientsList = ($(ingredientsListId).text()).split(",");
    
    $("#title-div").html("<h4>" +recipeName + "</h4>");
    $("#image-column").html("<img class='w-100' src='"+ imgSrc+"'/>");
    $("#ingredients-div").empty();

    if (ingredientsList.length > 0) {
         var ingTable = $("<table>");
   for (index in ingredientsList) {

        var ingre = ingredientsList[index].replace(ingredientsList[index].charAt(0), ingredientsList[index].charAt(0).toUpperCase());
           var tableRow = $("<tr>");
           tableRow.append("<td> <i class='fas fa-utensils'></i></td>");
           tableRow.append("<td>  &nbsp;  &nbsp; </td>");
           tableRow.append("<td>" + ingre + "</td>");
           ingTable.append(tableRow);
        }
        $("#ingredients-div").append(ingTable);
    }
    console.log("recipeName",recipeName);
    $("#wine-column").hide();
    $("#wine-price-details").hide();
    searchRecipe(clickedId);
   getfoodNames(recipeName);
});

 function searchRecipe(APIcall2) {

        var queryURL = "https://api.yummly.com/v1/api/recipe/" + APIcall2 + "?_app_id=23c56a38&_app_key=0e54a8ce40a665ee3dc2dc122f3dbac7";
        console.log(queryURL)
        $.ajax({
            url: queryURL,
            method: "GET",
            dataType: "json"
        })
            .done(function (response) {
                displayRecipes(response)

            })
        function displayRecipes(response) {
            console.log(response)
            $("#receipe-link-div").empty();
            var recipeID = "<button class='btn btn-secondary'>"+
            "<a class='text-light ' style='font-size: 20px' href='" + (response.source.sourceRecipeUrl) + "'target='_blank'> "+
            "Click here to see the Full receipe</a></button>";
            $('#receipe-link-div').append(recipeID);

        }
    }


function getfoodNames(recipeName) {
    var foodNameList = [];
    if(recipeName.split(" ").length >1)
    {
        $.each(recipeName.split(" "), function (index, value) {
            foodNameList.push(value)
        });
    }
    var foodNameListURL = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/queries/analyze?q=" + recipeName;
    console.log("tfoodNameListURL", foodNameListURL);
    // Performing an AJAX request with the foodNameListURL
    $.ajax({
        url: foodNameListURL,
        method: "GET",
        headers: {
            "X-RapidAPI-Key": "84b7f3975dmshf1a2fdc786671cap19ac4fjsn5bb2b98f52e9"
        }
    })
        .then(function (response) {
            

            if (response.cuisines.length > 0) {
                $.each(response.cuisines, function (index, value) {
                    if(value.name.split(" ").length >1)
                    {
                        $.each(value.name.split(" "), function (index, value) {
                            foodNameList.push(value)
                        });
                    }
                    else if(value.name.split("-").length >1)
                    {
                        $.each(value.name.split("-"), function (index, value) {
                            foodNameList.push(value)
                        });
                    }
                    else
                    {
                     foodNameList.push(value.name);
                    }
                });
            }
            else if (response.dishes.length > 0) {
                $.each(response.dishes, function (index, value) {
                    if(value.name.split(" ").length >1)
                    {
                        $.each(value.name.split(" "), function (index, value) {
                            foodNameList.push(value)
                        });
                    }
                    else if(value.name.split("-").length >1)
                    {
                        $.each(value.name.split("-"), function (index, value) {
                            foodNameList.push(value)
                        });
                    }
                    else
                    {
                     foodNameList.push(value.name);
                    }
                });
            }
            else if (response.ingredients.length > 0) {
                $.each(response.ingredients, function (index, value) {
                    if(value.name.split(" ").length >1)
                    {
                        $.each(value.name.split(" "), function (index, value) {
                            foodNameList.push(value)
                        });
                    }
                    else if(value.name.split("-").length >1)
                    {
                        $.each(value.name.split("-"), function (index, value) {
                            foodNameList.push(value)
                        });
                    }
                    else
                    {
                     foodNameList.push(value.name);
                    }
                });
            }
            else {
                console.log("there is no wine paired for with this dish");
            }

            if (foodNameList.length > 0) {

                winePairingAjaxcall(foodNameList);
            }
        });
}

function winePairingAjaxcall(foodNameList) {
    var winePaired = false;
    $.each(foodNameList, function (index, value) {
        if (!winePaired) {
            console.log("value", value);
            value = (value.toLowerCase()).replace(/\-/g, '');
            var value1 = value.replace(value.charAt(0), value.charAt(0).toUpperCase());
            var winePairingURL = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/wine/pairing?maxPrice=50&food=" + value;

            console.log("winePairingURL", winePairingURL);
            // Performing an AJAX request with the foodNameListURL
            $.ajax({
                url: winePairingURL,
                method: "GET",
                headers: {
                    "X-RapidAPI-Key": "84b7f3975dmshf1a2fdc786671cap19ac4fjsn5bb2b98f52e9"
                }
            })
                .then(function (response) {
                    console.log("response", response);
                    if ((!response.status) && (response.pairingText != "")) {
                        //winePairingList
                        winePaired = true;
                        $("#wine-column").show();
                        $("#wine-pairing").html("<h4>Wines paired for <span class='text-warning font-weight-bold'>"+value1+"</span></h4>");
                        $("#wine-type").html("<h4 style='font-weight: bold; color: rgba(137, 61, 70, 1);'>"+(response.pairedWines).join(' (or) ')+"<h4>");
                        $("#wine-type-description").text(response.pairingText);

                        if (response.productMatches.length > 0) {
                            $("#wine-brand").html("<h4 style='font-weight: bold;'> " + response.productMatches[0].title + "</h4>");
                            // $("#wine-brand-description").html("<h4>" + response.productMatches[0].description + "</h4>");
                            $("#wine-brand-price").html("<h4> Price : " + response.productMatches[0].price + "</h4>");
                            $("#wine-brand-link").html("<h4>Wine shopping URL :<u> "+
                                        "<a class='text-dark' target='_blank' href='" + response.productMatches[0].link + "'>"+ 
                                            response.productMatches[0].title +"</u></a></h4>");
                            $("#wine-brand-image").html("<img class='w-50' src='" + response.productMatches[0].imageUrl + "'/>");
                        }
                    }
                });
        }
    });
}
$("#wine-button").on("click", function () {
    if((this.textContent) =="More")
    {
        $("#wine-price-details").show();
        this.textContent ="Less";
    }
    else
    {
        $("#wine-price-details").hide();
        this.textContent ="More";
    }
});



