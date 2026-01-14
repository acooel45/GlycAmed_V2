import ApiService from "./api.js";

const form = document.querySelector(".login-form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Email et mot de passe requis");
        return;
    }

    try {
        const data = await ApiService.post("/auth/login", { email, password });

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        window.location.href = "index.html";

    } catch (err) {
        console.error("Erreur login :", err);
        alert(err.message || "Erreur réseau");
    }
});
