
function logout() {
  // Perform any necessary logout actions or clear session data

  // Redirect to the login page
  window.location.href = "/login.html"; // Replace with the actual login page URL
}

function fetchdata() {
  // JavaScript code to log out and redirect to the login page
  fetch('/profile')
    .then(response => response.json())
    .then(data => {
      // Iterate through the data and create card elements
      const container = document.getElementById('profile');
      const dataArray = Object.values(data)
      dataArray.forEach((item, i) => {

        const loginDetails = document.createElement('div');

        // Set content using item properties
        loginDetails.innerHTML = `
        <div class="d-flex align-items-center">
            <img src="/${item[i].profilePhoto}" alt="${item[i].profilePhoto}" class="rounded-circle"
                style="width: 40px; height: 40px;">
            <div class="ms-2">
                <h6 class="mb-0 m-2">${item[i].firstname}</h6>
                <p class="small text-muted mb-0 m-2">${item[i].lastname}</p>
            </div>
        </div>                            
      `;

        // Append the loginDetails element to the container
        container.append(loginDetails);
      });
    })
    .catch(error => {
      console.log('Error:', error);
    });
}
window.onload = fetchdata()