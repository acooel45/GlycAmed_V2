import { CONFIG } from "./constants.js";

const tableBody = document.getElementById("recent-consumptions-body");

async function loadHistory() {
    try {
        const response = await fetch(`${CONFIG.API_URL}/consumption/all`);

        if (!response.ok) {
            console.error("Erreur API :", response.status);
            return;
        }

        const consumptions = await response.json();

        tableBody.innerHTML = "";

        consumptions
            .sort((a, b) => new Date(b.consumedAt) - new Date(a.consumedAt))
            .forEach(consumption => {

                const date = new Date(consumption.consumedAt);
                const formattedDate = date.toLocaleDateString("fr-FR");
                const formattedTime = date.toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit"
                });

                const contributorEmail =
                    consumption.contributorId?.email ||
                    consumption.contributorId?.username ||
                    "—";

                const nutrients = consumption.nutrients
                    ? `Caféine: ${consumption.nutrients.caffeine}mg, 
                       Sucre: ${consumption.nutrients.sugar}g, 
                       Calories: ${consumption.nutrients.calories}kcal`
                    : "—";

                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${consumption.productName || "—"}</td>
                    <td>${consumption.quantityMl} ml</td>
                    <td>${nutrients}</td>
                    <td>${formattedDate} : ${formattedTime}</td>
                    <td>${contributorEmail}</td>
                `;

                tableBody.appendChild(tr);
            });

    } catch (error) {
        console.error("Erreur chargement historique :", error);
    }
}

loadHistory();