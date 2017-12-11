//Set up the calender select
$('.set-trip').pickmeup_twitter_bootstrap();

//Render the login section
$(document).on('click', '#login-btn',(e) => {
    $('#user-section').empty().html($(`
        <span class="glyphicon glyphicon-remove close"></span>
        <h3 class="form-title text-center">LOGIN</h3>
        
        <div class="text-center" id="social-login">
            <a class="btn btn-primary" href="/auth/facebook" id="fb-login">f FACEBOOK</a>
        </div>

        <hr>

        <form class="form-horizontal" name="login" method="POST" action="/login">   
            <div class="form-group">
                <label for="email" class="control-label">Email: </label>
                <input type="email" name="username" class="form-control">
            </div>

            <div class="form-group">
                <label for="password" class="control-label">Password: </label>
                <input type="password" name="password" class="form-control">
            </div>
                
            <div class="form-group text-center">
                <input type="submit" value="Login" class="btn btn-default">
            </div>
        </form>
        <a class="signup-btn">Not yet a member?Sign up here</a>
    `))
    if (!$('#user-section').hasClass("show-active")) {
        $('#user-section').addClass("show-active")
    }
})

//Close the login/signup section
$(document).on('click','.close', (e) => {
    $('#user-section').removeClass("show-active")
})

//Render the signup section
$(document).on('click', '.signup-btn',(e) => {
    $('#user-section').empty().html($(`
        <span class="glyphicon glyphicon-remove close"></span>
        <h3 class="form-title text-center">SIGN UP</h3>
        <form class="form-horizontal" name="signup" method="POST" action="/user">
            <div class="form-group">
                <label for="username" class="control-label">Username: </label>
                <input type="text" name="username" class="form-control">
            </div>

            <div class="form-group">
                <label for="email" class="control-label">Email: </label>
                <input type="email" name="email" class="form-control">
            </div>

            <div class="form-group">
                <label for="password" class="control-label">Password: </label>
                <input type="password" name="password" class="form-control">
            </div>

            <div class="form-group">
                <label for="password" class="control-label">Password confirmation: </label>
                <input type="password" name="password_confirmation" class="form-control">
            </div>
                
            <div class="form-group text-center">
                <input type="submit" value="Register" class="btn btn-default">
            </div>
        </form>
    `))
    if (!$('#user-section').hasClass("show-active")) {
        $('#user-section').addClass("show-active")
    }
})

//Search controller expand btn
$(document).on('click', '.glyphicon-chevron-left', (e) => {
    $('.detail-controller').css('left', '-320px')
    $('.glyphicon-chevron-left').removeClass('glyphicon-chevron-left').addClass('glyphicon-chevron-right')
})
$(document).on('click', '.glyphicon-chevron-right', (e) => {
    $('.detail-controller').css('left', '0')
    $('.glyphicon-chevron-right').removeClass('glyphicon-chevron-right').addClass('glyphicon-chevron-left')
})