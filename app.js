$(function(){
    hidePostsRow();    
    getFBInfo();
});

var myFBAccessToken = 'EAACEdEose0cBAEGKBp7GdmdEzzwCEnlCSkeIHwgiVlnElE4rgQMWdAtFNYFR43Y3nQcpKoJAGszNkxstYXw18QtrekvvgGKTXCpfmI7Kzx8RGznSBPc2NiNimODcuxYHi7YLcgK2vEB13KZBJovH7FUVbliUFZBfbohlfmJ11EKIZAVRlCRbuPJWFZAppdM1X7JFsLlCgAZDZD';
var postsRowHidden; // variable to store state of visibility of postsRow
// to get the data of a user using graph API
function getFBInfo(){
    $.ajax('https://graph.facebook.com/me?access_token='+myFBAccessToken,
            {
                type: "GET",
                data: {
                    fields:"id, name, about, email, hometown, birthday, picture, education, posts{id, message, full_picture}" 
                },
                success: function(response){
                    console.log(response); // about is not loading, have to check that

                    // Put the data at appropriate places on the web page
                    $('#myEmail').text(response.email?response.email:"Not found!");
                    $('#myHomeTown').text(response.hometown.name);
                    $('#about').html("<h3>"+response.name+"</h3>");
                    $('#birthday').text(response.birthday);
                    // $('#age').text(response.age_range.min);
                    $('#profilePic').attr('src', response.picture.data.url);
                    $('#education').text(response.education[0].school.name);

                    // This has to be written here because it accesses the resposne object
                    $("#feedBtn").on("click", function(){
                        // Display feed and hide profile
                        $("#profileRow").hide();
                        populatePosts(response.posts.data);
                    });
                    $("#profileBtn").on("click", function(){
                        // display profile and hide the posts
                        $("#profileRow").show();
                        hidePostsRow();
                    });   
                
                },
                error: function(err){
                        alert("Error:"+err.message); 
                        //$(".container").hide();
                }
            }
        );
}
// function to populate posts on page
// input: posts - a JSON object of all posts
function populatePosts(data){
    if(postsRowHidden){
        $('#postsRow').show();
        postsRowHidden = false;
    }
    var posts = $("#posts");
    if(posts.children().length !== data.length){
        for(var i=0;i<data.length;i++){
            // Currently adding only message and picture, will add more info after this works successfully
            posts.append($('<li>').append($('<span>').append(data[i].message))
            .append($('<img class="img-responsive">',{'src': data[i].full_picture}))); // The souce of img tag is not setting
        }
    }
}

// Configure the DOM elements for initial display
function hidePostsRow(){
    $("#postsRow").hide();
    postsRowHidden = true;
}