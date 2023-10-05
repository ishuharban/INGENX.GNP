const button = document.getElementById('animated-button');

button.addEventListener('click', function () {
  // Change the size of the button
  button.style.width = '200px';
  button.style.height = '50px';

  // Reset the size after a delay
  setTimeout(function () {
    button.style.width = '';
    button.style.height = '';
  }, 1000);
});

// JavaScript code to log out and redirect to the login page
function logout() {
  // Perform any necessary logout actions or clear session data


  // Redirect to the login page
  window.location.href = "/login.html";
}



