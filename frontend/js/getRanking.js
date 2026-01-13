import ApiService from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const tbody = document.querySelector("table tbody");

  try {
    const ranking = await ApiService.get("/consumption/ranking");

    tbody.innerHTML = "";

    if (!Array.isArray(ranking) || ranking.length === 0) {
      tbody.innerHTML = `
        <tr><td colspan="3">Aucun classement disponible.</td></tr>
      `;
      return;
    }

    ranking.forEach((user, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${user.email || "—"}</td>
        <td>${user.totalConsumptions ?? 0}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Erreur récupération classement :", error.message);
    tbody.innerHTML = `
      <tr><td colspan="3">Erreur lors du chargement du classement : ${error.message}</td></tr>
    `;
  }
});
