// LOGIN LOGIC
const loginForm = document.getElementById("login-form");

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    const users = JSON.parse(localStorage.getItem("users")) || {};

    if (users[username] && users[username].password === password) {
      alert(`Welcome back, ${username}!`);
      localStorage.setItem("currentUser", username);
      window.location.href = "main.html";
    } else {
      alert("Invalid details");
    }
  });
}

// SIGN-UP LOGIC
const signUpForm = document.getElementById("signup-form");

if (signUpForm) {
  signUpForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    let users = JSON.parse(localStorage.getItem("users")) || {};

    if (users[username]) {
      alert("Username already exists. Please choose another.");
      return;
    }

    users[username] = { firstName, lastName, password };
    localStorage.setItem("users", JSON.stringify(users));
    alert(`${username} has been registered!`);
    window.location.href = "index.html";
  });
}
