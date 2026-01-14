import Store from "./store.js";

const loginButton = document.querySelector("nav button a");

Store.subscribe((state) => {
  if (state.user) {
    loginButton.textContent = "Logout";
    loginButton.href = "#";

    loginButton.onclick = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      Store.setState({ user: null });
    };

  } else {
    loginButton.textContent = "Login";
    loginButton.href = "login.html";
    loginButton.onclick = null;
  }
});
