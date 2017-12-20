$(document).ready(function(){
    //Render the login section
    $(document).on('click', '#login-btn',(e) => {
        $('#user-section').empty().html($(`
            <span class="glyphicon glyphicon-remove close"></span>
            <h3 class="form-title text-center">LOGIN</h3>
            
            <div class="text-center" id="social-login">
                <a class="btn btn-primary btn-circle btn-lg fb-btn" href="/auth/facebook" id="fb-login"><i class="fa fa-facebook" aria-hidden="true"></i></a>
            </div>

            <hr>

            <form class="form-horizontal" name="login" method="POST" action="/auth/login">   
                <div class="form-group">
                    <label for="email" class="control-label">Email: </label>
                    <input type="email" name="username" class="form-control" required>
                </div>

                <div class="form-group">
                    <label for="password" class="control-label">Password: </label>
                    <input type="password" name="password" class="form-control" required>
                </div>
                    
                <div class="form-group text-center">
                    <input type="submit" value="Login" class="btn btn-primary">
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
            <form class="form-horizontal" name="signup" method="POST" action="/auth/user">
                <div class="form-group">
                    <label for="username" class="control-label">Username: </label>
                    <input type="text" name="username" class="form-control" required>
                </div>

                <div class="form-group">
                    <label for="email" class="control-label">Email: </label>
                    <input type="email" name="email" class="form-control" required>
                </div>

                <div class="form-group">
                    <label for="password" class="control-label">Password: </label>
                    <input type="password" name="password" class="form-control" required>
                </div>

                <div class="form-group">
                    <label for="password" class="control-label">Password confirmation: </label>
                    <input type="password" name="password_confirmation" class="form-control" required>
                </div>
                    
                <div class="form-group text-center">
                    <input type="submit" value="Register" class="btn btn-primary">
                </div>
            </form>
        `))
        if (!$('#user-section').hasClass("show-active")) {
            $('#user-section').addClass("show-active")
        }
    })

    $(document).on('click', '.glyphicon-chevron-right', (e) => {
        $('.detail-controller').css('left', '0')
     })
    $(document).on('click', '.hide-btn', (e) => {
        $('.detail-controller').css('left', '-320px')
    })

});

$(document).ready(function() {
    $('.alert').stop(1000).fadeOut(3000);
})
