import ApiService from "./api.js";

const form = document.querySelector(".register-form");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const firstname = document.querySelector("#firstname").value.trim();
  const lastname = document.querySelector("#lastname").value.trim();
  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value;

  if (!firstname || !lastname || !email || !password) {
    alert("Veuillez remplir tous les champs !");
    return;
  }

  try {
    const data = await ApiService.post("/auth/register", {
      firstname,
      lastname,
      email,
      password,
    });

    localStorage.setItem("token", data.token);
    window.location.href = "index.html";

    console.log("User registered:", data.user);
  } catch (error) {
    console.error("Erreur inscription :", error.message);
    alert(error.message || "Connexion au serveur impossible");
  }
});
