import { CONFIG } from "./constants";

const form = document.querySelector(".register-form");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const firstname = document.querySelector("#firstname").value;
  const lastname = document.querySelector("#lastname").value;
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  try {
    const response = await fetch(`${CONFIG.API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ firstname, lastname, email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Erreur lors de l'inscription");
      return;
    }

    localStorage.setItem("token", data.token); // store token
    window.location.href = "index.html";

    console.log("User registered:", data.user);

  } catch (err) {
    console.error(err);
    alert("Connexion au serveur impossible");
  }
});