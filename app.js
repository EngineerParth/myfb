$(function(){
    initialize();
    getFBInfo();
});

var myFBAccessToken  = 'EAACEdEose0cBAARyWL0YnWg6qVppR4OL47hZCU61aK1fiGsh2sl7LScEL3ZAOyHqd7oebQljZC1ZAHkbHUdX5oKUWVLF31jMfR5YA7af6Y8xXg9zVI2cnZA6yqLfeKFwl7pRom5gkd7WZAZCvQCCzL4XTnJdyDyyKB5T7ROZAgdoK6Gv26hdXQrF6QflYvpyW2eZAfTZAIhTL6HAZDZD';
var errorRowHidden; // variable to store state of visibility of error row
var postsRowHidden; // variable to store state of visibility of postsRow
var errorMessage = "User access token invalid!"

// to get the data of a user using graph API
function getFBInfo(){
    $.ajax('https://graph.facebook.com/me?access_token='+myFBAccessToken,
            {
                type: "GET",
                data: {
                    fields:"id, name, about, email, hometown, birthday, picture, education, posts{id, message, full_picture, created_time}" 
                },
                success: function(response){
                    console.log(response); // about is not loading, have to check that

                    // Put the data at appropriate places on the web page
                    $('#myEmail').text(response.email?response.email:"Not found!");
                    $('#myHomeTown').text(response.hometown.name);
                    $('#about').html("<h3>"+response.name+"</h3>");
                    $('#birthday').text(response.birthday);
                    $('#profilePic').attr('src', response.picture.data.url);
                    $('#education').text(response.education[0].school.name);

                    // This has to be written here because it accesses the resposne object
                    $("#feedBtn").on("click", function(){
                        // Display feed and hide profile
                        $("#profileRow").hide();

                        populatePosts(response.posts.data, response.picture);

                    });
                    $("#profileBtn").on("click", function(){
                        // display profile and hide the posts
                        $("#profileRow").show();
                        $("#postsRow").hide();
                        postsRowHidden = true;
                    });   
                
                },
                error: function(err){
                    
                    alert(err.status + ": " + err.statusText + " Unable to access data." + errorMessage); 
                    $("#errorRow").show();
                    $("#errorMessage").text(errorMessage);
                    $('#profilePic').attr('src', './images/notfound.gif');
                    
                    errorRowHidden = false;
                    
                }
            }
        );
}
// function to populate posts on page
// input: posts - a JSON object of all posts
function populatePosts(data, profileIcon){
    if(postsRowHidden){
        $('#postsRow').show();
        postsRowHidden = false;
    }
    var posts = $("#posts");
    if(posts.children().length !== data.length){
        for(var i=0;i<data.length;i++){
            // Currently adding only message and picture, will add more info after this works successfully (bazinga!)
            var div1 = $('<div>').append('<img>',{'src':profileIcon.data.url,'width':'5%','height':'5%', 'class':'img-responsive'}).append($('<div>').append(data[i].created_time));
            var div2 = $('<div>').append($('<div>').append(data[i].message)).append('<img>',{'src':data[i].full_picture,'width':'50%','height':'50%','class':'img-responsive'});
            var li = $('<li>').append($('<div>').append(div1).append(div2));
            posts.append(li);
        }
    }
}

// Configure the DOM elements for initial display
function initialize(){
    $("#postsRow").hide();
    $("#errorRow").hide();
    postsRowHidden = true;
    errorRowHidden = true;
}
