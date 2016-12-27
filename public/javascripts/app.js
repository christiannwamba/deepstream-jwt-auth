
(function() {
  /**
   * App constructor
   * @constructor
   */
  function App () {

    // Setup deepstream and listen for errors
    this.client = deepstream('localhost:6020')
      .on( 'error', ( error ) => {
        console.error(error);
      });
    
    // Get payload and check if username
    // exists in payload
    var payload = this.getPayload();
    if(payload && payload.user && payload.user.username) {
      var _this = this;
      // Login to server
      // with payload credentials
      this.client.login({username: payload.user.username, password: payload.user.password}, function(){
        console.log(payload);
      })
      // Subscribe to presence event
      .presence.subscribe(function(username, isLoggedIn) {
        if(isLoggedIn){
          console.log(username + ' connected');
          // Update presence status as online
          _this.updateOnlineUsersList(username, isLoggedIn);
        } else {
          console.log(username + ' disconnected');
          // Update presence status as offline
          _this.updateOnlineUsersList(username, isLoggedIn);
        }
      });

    }
  }

  /**
   * Authenticate user with
   * form inputs
   */
  App.prototype.login = function() {
    var usernameText = document.getElementById('username').value;
    var passwordText = document.getElementById('password').value;
    // Login
    this.client.login({username: usernameText, password: passwordText}, this.handleLogin.bind(this))
  }

  /**
   * Callback for `client.login`
   */
  App.prototype.handleLogin =  function(success, data) {
    if(!success) {
      console.log('Error occured');
      return
    }
    
    // Store payload in cookie for one day
    Cookies.set('auth:payload', JSON.stringify(data), { expires: 1 });

    // Redirect to home page
    this.navigateTo('/');
  }

  /**
   * Fetches payload from cookie
   * @returns {Object} Auth payload
   */
  App.prototype.getPayload = function() {
    var payload = null
    try {
      payload = JSON.parse(Cookies.get('auth:payload'));
    } catch(e) {
      console.error('Invalid or non-existing payload. You probably, need to login');
    }

    return payload
  }

  /**
   * Navigates to a given url
   * @param {string} url to navigate to
   */
  App.prototype.navigateTo = function(url) {
    window.location.href = url;
  }

  /**
   * Listen to DOM events and bind handlers
   */
  App.prototype.setupEvents = function() {
    var loginButton = document. getElementById('login-button');
    if(loginButton){
      loginButton.addEventListener('click', this.login.bind(this));
    }
  }

  /**
   * Hijacks link default behavior and attaches
   * a token to url as query parameter
   * before moving to route
   */
  App.prototype.hijackLink = function() {
    var _this = this;
    document.addEventListener('click', function(e) {
      if(e.target.tagName == 'A'){
        
        if(e.target.href.indexOf('users') > -1) { 
          e.preventDefault();
          _this.attachToken('users');
        }
      }
    })
  }

  /**
   * Attaches token to protected URL
   */
  App.prototype.attachToken = function(route) {
    var authPayload = this.getPayload();
    if(authPayload && authPayload.token) {
       this.navigateTo(route + '?token=' + authPayload.token);
    } 
  }

  /**
   * Updates user presence status
   * either as 'online' or offline
   * 
   * The class name, 'online', changes
   * the bullet color to green and when removed
   * resets to red
   * 
   * @param {user} username
   * @param {isLoggedIn} login flag
   */
  App.prototype.updateOnlineUsersList = function(user, isLoggedIn) {
    var ulNode = document.getElementById('users');
    if(ulNode) {
      var liNode = document.getElementById(user);
      isLoggedIn ? liNode.className += ' online' : liNode.className = '';
    }
  }

  /**
   * Build app
   */
  App.prototype.make = function() {
    console.log('...making app')
    this.hijackLink();
    this.setupEvents();
  }
  
  window.App = App
})()

var app = new window.App();
app.make();
