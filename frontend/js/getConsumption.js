import ApiService from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const tbody = document.getElementById("recent-consumptions-body");

  try {

    const consumptions = await ApiService.get("/consumption/all");

    tbody.innerHTML = "";

    if (!Array.isArray(consumptions) || consumptions.length === 0) {
      tbody.innerHTML = `
        <tr><td colspan="3">Aucune consommation récente.</td></tr>
      `;
      return;
    }

    consumptions.forEach((cons) => {
      const tr = document.createElement("tr");

      const date = new Date(cons.consumedAt);
      const formattedDate = date.toLocaleDateString("fr-FR");
      const formattedTime = date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      tr.innerHTML = `
        <td>${cons.productName || cons.barcode || "Inconnu"}</td>
        <td>${cons.quantityMl} ml</td>
        <td>${formattedDate} : ${formattedTime}</td>
      `;

      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Erreur récupération consommations :", error.message);
    tbody.innerHTML = `
      <tr><td colspan="3">Erreur lors du chargement des données : ${error.message}</td></tr>
    `;
  }
});
