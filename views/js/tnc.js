    // Enable smooth scrolling for the accept button
    const acceptBtn = document.querySelector('#acceptBtn');

    acceptBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector('body');
      window.scrollTo({
        top: target.offsetTop,
        behavior: 'smooth'
      });
    });

    // JavaScript code to log out and redirect to the login page
function logout() {
  // Perform any necessary logout actions or clear session data
  
  // Redirect to the login page
  window.location.href = "/login.html"; // Replace with the actual login page URL
}