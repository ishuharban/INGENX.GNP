// JavaScript for sidebar functionality
const sidebarItems = document.querySelectorAll('#sidebar a');
const settingsSections = document.querySelectorAll('.settings-section');

sidebarItems.forEach((item, index) => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    // Remove active class from all sidebar items
    sidebarItems.forEach((item) => item.classList.remove('active'));
    // Add active class to the clicked item
    item.classList.add('active');
    // Hide all settings sections
    settingsSections.forEach((section) => section.classList.add('d-none'));
    // Show the corresponding settings section
    const targetSection = item.getAttribute('href');
    document.querySelector(targetSection).classList.remove('d-none');
  });
});

// JavaScript code to log out and redirect to the login page
function logout() {
  // Perform any necessary logout actions or clear session data
  
  // Redirect to the login page
  window.location.href = "/login.html"; // Replace with the actual login page URL
}