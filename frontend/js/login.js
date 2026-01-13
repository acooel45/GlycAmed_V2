import { CONFIG } from "./constants.js";
import ApiService from "./api.js";

const form = document.querySelector(".login-form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
        const response = await ApiService.post("/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            window.location.href = "index.html";
        } else {
            alert(data.error || "Login échoué");
        }
    } catch (err) {
        console.error(err);
        alert("Erreur réseau");
    }
});