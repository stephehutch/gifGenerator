let gifButtons = ["Happy", "Mad", "Sarcastic", "Super!", ":)", "Sleepy"];
let buttonClass = ["btn-danger", "btn-orange", "btn-warning text-white", "btn-success", "btn-primary", "btn-purple"]



function renderButtons() {

    // Deleting the gifs prior to adding new gifs
    $("#buttons-view").empty();

    // Looping through the array of gifs
    for (let i = 0; i < gifButtons.length; i++) {

        // Then dynamicaly generating buttons for each gif in the array
        let a = $("<button>");

        // loop through class array to add rainbow buttons
    if (i < buttonClass.length) {
            a.addClass("gif-btn btn " + buttonClass[i]);
        } else if (i < gifButtons.length && i > buttonClass.length) {
            let j = i % buttonClass.length
            a.addClass("gif-btn btn " + buttonClass[j]);
        } else {
            a.addClass("gif-btn btn " + buttonClass[0]);
        }

        a.text(gifButtons[i]);
        // Adding the button to the buttons-view div
        $("#buttons-view").append(a);
    
    }

};


$("#add-gif").on("click", function (event) {
    event.preventDefault();
    // This line grabs the input from the textbox
    let gifs = $("#gif-input").val().trim();

    // Adding gif from the textbox to our array
    gifButtons.push(gifs);

    // Calling renderButtons which handles the processing of our gif array
    renderButtons();
});



//  Event listener for all button elements
$(document.body).on("click", ".gif-btn.btn", function () {
    
    // Constructing a URL to search Giphy for the name of the person who said the quote
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
    // In this case, the "this" keyword refers to the button that was clicked
        this.textContent + "&api_key=dc6zaTOxFJmzC&limit=10";

    // Performing our AJAX GET request
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        // After the data comes back from the API
        .then(function (response) {
            // Storing an array of results in the results variable
            var results = response.data;


            // Looping over every result item
            for (var i = 0; i < results.length; i++) {

                // Only taking action if the photo has an appropriate rating
                if (results[i].rating !== "r" && results[i].rating !== "pg-13") {
                    // Creating a div for the gif
                    var gifDiv = $("<div>");
                    gifDiv.addClass("gif-rating");
                    // Storing the result item's rating
                    var rating = results[i].rating;

                    // Creating a paragraph tag with the result item's rating
                    var p = $("<p>").text("Rating: " + rating);

                    // Creating an image tag
                    var gif = $("<img>");

                    // Giving the image tag an src attribute of a proprty pulled off the
                    // result item
                    gif.attr("src", results[i].images.fixed_height.url);
                    gif.attr("data-animate", results[i].images.fixed_height.url);
                    gif.attr("data-still", results[i].images.fixed_height_still.url);
                    gif.attr("data-state", "animate");
                    // Appending the paragraph and personImage we created to the "gifDiv" div we created
                    gifDiv.append(p);
                    gifDiv.append(gif);

                    // Prepending the gifDiv to the "#gifs-appear-here" div in the HTML
                    $("#gifs-appear-here").prepend(gifDiv);

                };
                //console.log(results);
            };

            $(document.body).on("click", "#gifs-appear-here img", function () {

                var state = $(this).attr("data-state");
                // If the clicked image's state is still, update its src attribute to what its data-animate value is.
                if (state === "still") {
                    $(this).attr("src", $(this).attr("data-animate"));
                    // Then, set the image's data-state to animate
                    $(this).attr("data-state", "animate");
                } else {
                    // Else set src to the data-still value
                    $(this).attr("src", $(this).attr("data-still"));
                    $(this).attr("data-state", "still");
                }

            });


        });

});

renderButtons();