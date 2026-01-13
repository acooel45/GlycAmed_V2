import { CONFIG } from "./config.js";

document.addEventListener("DOMContentLoaded", async () => {
    const tbody = document.getElementById("recent-consumptions-body");

    const token = localStorage.getItem("token");

    // if (!token) {
    //     console.warn("Utilisateur non connecté.");
    //     tbody.innerHTML = `
    //         <tr><td colspan="3">Veuillez vous connecter pour voir les consommations.</td></tr>
    //     `;
    //     return;
    // }

    try {
        const response = await fetch(`${CONFIG.API_URL}/consumption/all`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const consumptions = await response.json();

        tbody.innerHTML = "";

        if (!Array.isArray(consumptions) || consumptions.length === 0) {
            tbody.innerHTML = `
                <tr><td colspan="3">Aucune consommation récente.</td></tr>
            `;
            return;
        }

        consumptions.forEach(cons => {
            const tr = document.createElement("tr");

            const date = new Date(cons.consumedAt);
            const formattedDate = date.toLocaleDateString("fr-FR");
            const formattedTime = date.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit"
            });

            tr.innerHTML = `
                <td>${cons.productName || cons.barcode || "Inconnu"}</td>
                <td>${cons.quantityMl} ml</td>
                <td>${formattedDate} : ${formattedTime}</td>
            `;

            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error("Erreur récupération consommations :", error);
        tbody.innerHTML = `
            <tr><td colspan="3">Erreur lors du chargement des données.</td></tr>
        `;
    }
});