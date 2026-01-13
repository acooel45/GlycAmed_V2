import { CONFIG } from "./constants.js";

document.addEventListener("DOMContentLoaded", async () => {
    const tbody = document.querySelector("table tbody");

    try {
        const response = await fetch(`${CONFIG.API_URL}/consumption/ranking`);
        const ranking = await response.json();

        tbody.innerHTML = "";

        ranking.forEach((user, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${user.email}</td>
                <td>${user.totalConsumptions}</td>
            `;
            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error("Erreur récupération classement :", err);
    }
});