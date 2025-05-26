// =====================
// Modal Elements
// =====================
const modal = document.getElementById("modal");
const closeModal = document.getElementById("close-modal");
const transferBtn = document.getElementById("transferBtn");
const confirmTransferBtn = document.getElementById("confirm-transfer");
const balanceDisplay = document.querySelector(".balance");
const topupModal = document.getElementById("topup-modal");
const confirmTopupBtn = document.getElementById("confirm-topup");
const cancelTopupBtn = document.getElementById("cancel-topup");
const topupBtn = document.getElementById("topup");

// =====================
// Transfer Modal Handlers
// =====================

// Open transfer modal
transferBtn.addEventListener("click", function () {
  modal.showModal();
});

// Close transfer modal
closeModal.addEventListener("click", function () {
  modal.close();
});

// Confirm transfer action
confirmTransferBtn.addEventListener("click", function () {
  const username = document.getElementById("transfer-username").value.trim();
  const amountInput = document.getElementById("transfer-amount").value.trim();
  const amount = parseFloat(amountInput);

  if (!username || isNaN(amount) || amount <= 0) {
    alert("Please enter a valid account name and amount greater than ₦0.");
    return;
  }

  const usersData = localStorage.getItem("users");
  if (!usersData) {
    alert("No users found in the system.");
    return;
  }

  let users;
  try {
    users = JSON.parse(usersData);
  } catch (e) {
    alert("User data is corrupted.");
    return;
  }

  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) {
    alert("You are not logged in.");
    return;
  }

  if (currentUser === username) {
    alert("You cannot transfer money to yourself.");
    return;
  }

  if (!users[username]) {
    alert("Recipient not found.");
    return;
  }

  if (!users[currentUser]) {
    alert("Your account could not be found.");
    return;
  }

  if ((users[currentUser].balance || 0) < amount) {
    alert("Insufficient balance.");
    return;
  }

  if (amount > 100000) {
    alert("Transfer limit exceeded. Maximum allowed per transfer is ₦100,000.");
    return;
  }

  // Perform transfer
  users[currentUser].balance -= amount;
  users[username].balance = (users[username].balance || 0) + amount;
  localStorage.setItem("users", JSON.stringify(users));

  // Update balance display
  if (balanceDisplay) {
    balanceDisplay.textContent = `₦${users[
      currentUser
    ].balance.toLocaleString()}`;
  }

  alert(`Successfully transferred ₦${amount.toLocaleString()} to ${username}.`);

  // Update transaction history
  const history = JSON.parse(
    localStorage.getItem("transactionHistory") || "{}"
  );
  if (!history[currentUser]) history[currentUser] = [];
  if (!history[username]) history[username] = [];

  const timestamp = new Date().toLocaleString();

  history[currentUser].unshift({
    type: "sent",
    to: username,
    amount,
    timestamp,
  });

  history[username].unshift({
    type: "received",
    from: currentUser,
    amount,
    timestamp,
  });

  localStorage.setItem("transactionHistory", JSON.stringify(history));

  // Update recent transactions list
  const transactionsList = document.querySelector(".transactions ul");
  if (transactionsList) {
    const sentItem = document.createElement("li");
    sentItem.innerHTML = `<span>Transfer to ${username}</span><span style="color: red;">-₦${amount.toLocaleString()}</span>`;
    transactionsList.prepend(sentItem);
  }

  // Clear form and close modal
  modal.close();
  document.getElementById("transfer-amount").value = "";
  document.getElementById("transfer-username").value = "";
});

// =====================
// Prevent Default Form Submit on Enter in Modal
// =====================
document
  .querySelector(".modal-content")
  .addEventListener("submit", function (e) {
    e.preventDefault();
  });

// =====================
// Welcome Message & User Info on Login
// =====================
const loggedInUser = localStorage.getItem("currentUser");
if (loggedInUser) {
  const headerGreeting = document.getElementById("user-name");
  if (headerGreeting) {
    headerGreeting.textContent = `${loggedInUser}`;
  }

  // Display balance
  const usersDataOnLogin = localStorage.getItem("users");
  if (usersDataOnLogin) {
    try {
      const usersObj = JSON.parse(usersDataOnLogin);
      const userBalance = usersObj[loggedInUser]?.balance || 0;
      if (balanceDisplay) {
        balanceDisplay.textContent = `₦${userBalance.toLocaleString()}`;
      }
    } catch (e) {
      console.error("Failed to parse user data on login");
    }
  }

  // Load transaction history
  const transactionsList = document.querySelector(".transactions ul");
  const transactionHistory = JSON.parse(
    localStorage.getItem("transactionHistory") || "{}"
  );

  if (transactionsList && transactionHistory[loggedInUser]) {
    transactionsList.innerHTML = "";
    transactionHistory[loggedInUser].forEach(function (tx) {
      const li = document.createElement("li");
      if (tx.type === "sent") {
        li.innerHTML = `<span>Transfer to ${
          tx.to
        }</span><span style="color: red;">-₦${tx.amount.toLocaleString()}</span>`;
      } else if (tx.type === "received") {
        li.innerHTML = `<span>Transfer from ${
          tx.from
        }</span><span style="color: green;">+₦${tx.amount.toLocaleString()}</span>`;
      } else if (tx.type === "topup") {
        li.innerHTML = `<span>Top-Up</span><span style="color: green;">+₦${tx.amount.toLocaleString()}</span>`;
      }
      transactionsList.appendChild(li);
    });
  }
}

// =====================
// Top-Up Handlers
// =====================

// Open top-up modal
topupBtn.addEventListener("click", function () {
  topupModal.showModal();
});

// Cancel top-up
cancelTopupBtn.addEventListener("click", function () {
  topupModal.close();
  document.getElementById("topup-amount").value = "";
});

// Confirm top-up
confirmTopupBtn.addEventListener("click", function () {
  const amountInput = document.getElementById("topup-amount").value.trim();
  const amount = parseFloat(amountInput);

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount greater than ₦0.");
    return;
  }

  const usersData = localStorage.getItem("users");
  const currentUser = localStorage.getItem("currentUser");

  if (!usersData || !currentUser) {
    alert("Something went wrong. Try logging in again.");
    return;
  }

  let users;
  try {
    users = JSON.parse(usersData);
  } catch (e) {
    alert("User data is corrupted.");
    return;
  }

  if (!users[currentUser]) {
    alert("Your account could not be found.");
    return;
  }

  users[currentUser].balance = (users[currentUser].balance || 0) + amount;
  localStorage.setItem("users", JSON.stringify(users));

  if (balanceDisplay) {
    balanceDisplay.textContent = `₦${users[
      currentUser
    ].balance.toLocaleString()}`;
  }

  const history = JSON.parse(
    localStorage.getItem("transactionHistory") || "{}"
  );
  if (!history[currentUser]) history[currentUser] = [];

  history[currentUser].unshift({
    type: "topup",
    amount,
    timestamp: new Date().toLocaleString(),
  });

  localStorage.setItem("transactionHistory", JSON.stringify(history));

  const transactionsList = document.querySelector(".transactions ul");
  if (transactionsList) {
    const topupItem = document.createElement("li");
    topupItem.innerHTML = `<span>Top-Up</span><span style="color: green;">+₦${amount.toLocaleString()}</span>`;
    transactionsList.prepend(topupItem);
  }

  alert(`₦${amount.toLocaleString()} successfully added to your balance.`);

  topupModal.close();
  document.getElementById("topup-amount").value = "";
});

// =====================
// UI Toggles & Buttons
// =====================

// Toggle user menu dropdowns
document
  .querySelector(".user-details-button")
  .addEventListener("click", function () {
    document.getElementById("userMenu").classList.toggle("hidden");
  });

document
  .querySelector(".user-details-image")
  .addEventListener("click", function () {
    document.getElementById("userMenu2").classList.toggle("hidden");
  });

// Toggle mobile menu
document
  .getElementById("mobileMenuButton")
  .addEventListener("click", function () {
    document.getElementById("mobileMenu").classList.toggle("show");
  });

// Flip debit card on click
document.getElementById("flipCard").addEventListener("click", function () {
  this.classList.toggle("flipped");
});
