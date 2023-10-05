// document.getElementById('optionSelect').addEventListener('change', function() {
//     var selectedOption = this.value;
//     var commentBoxContainer = document.getElementById('commentBoxContainer');

//     if (selectedOption === 'Non-SAP') {
//       commentBoxContainer.style.display = 'block';
//     } else {
//       commentBoxContainer.style.display = 'none';
//     }
//   });

function toggleInputField() {

  var optionSelect = document.getElementById("optionSelect");

  var erpInput = document.getElementById("erpVer");

  var sapVer = document.getElementById("sapVer");

  var  SAPerpInput =document.getElementById("SAPerpVer")

 

  if (optionSelect.value === "SAP") {

    // sapVer.style.display = "block";
    // SAPerpInput.style.display ="block";

    erpInput.style.display = "none";

  } else if (optionSelect.value === "Non-SAP") {

    erpInput.style.display = "block";
    SAPerpInput.style.display = "none"

    sapVer.style.display = "none";

  }

}




// JavaScript code to log out and redirect to the login page
function logout() {
  // Redirect to the login page
  window.location.href = "/login.html"; // Replace with the actual login page URL

  // Perform any necessary logout actions or clear session data
  sessionStorage.clear();
}
