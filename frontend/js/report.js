import { CONFIG } from "./constants.js";
import ApiService from "./api.js";

async function renderCharts() {
  try {
    const consumptions = await ApiService.get("/consumption/all");

    let totalSugar = 0, totalCaffeine = 0, totalCalories = 0;
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    consumptions.forEach(c => {
      const consumedDate = new Date(c.consumedAt).toISOString().split("T")[0];
      if (consumedDate === today) {
        totalSugar += c.nutrients?.sugar || 0;
        totalCaffeine += c.nutrients?.caffeine || 0;
        totalCalories += c.nutrients?.calories || 0;
      }
    });

    new Chart(document.getElementById('sugarChart'), {
      type: 'doughnut',
      data: {
        labels: ['Sucre consommé', 'Restant'],
        datasets: [{
          data: [totalSugar, Math.max(CONFIG.HEALTH_LIMITS.SUGAR_MAX - totalSugar, 0)],
          backgroundColor: ['#FF6384', '#E0E0E0'],
        }]
      },
      options: {
        plugins: {
          title: { display: true, text: `Sucre : ${totalSugar}g / ${CONFIG.HEALTH_LIMITS.SUGAR_MAX}g` }
        }
      }
    });

    new Chart(document.getElementById('caffeineChart'), {
      type: 'doughnut',
      data: {
        labels: ['Caféine consommée', 'Restant'],
        datasets: [{
          data: [totalCaffeine, Math.max(CONFIG.HEALTH_LIMITS.CAFFEINE_MAX - totalCaffeine, 0)],
          backgroundColor: ['#36A2EB', '#E0E0E0'],
        }]
      },
      options: {
        plugins: {
          title: { display: true, text: `Caféine : ${totalCaffeine}mg / ${CONFIG.HEALTH_LIMITS.CAFFEINE_MAX}mg` }
        }
      }
    });

    new Chart(document.getElementById('caloriesChart'), {
      type: 'doughnut',
      data: {
        labels: ['Calories consommées', 'Restant'],
        datasets: [{
          data: [totalCalories, Math.max(CONFIG.HEALTH_LIMITS.CALORIES_MAX - totalCalories, 0)],
          backgroundColor: ['#FFCE56', '#E0E0E0'],
        }]
      },
      options: {
        plugins: {
          title: { display: true, text: `Calories : ${totalCalories} kcal / ${CONFIG.HEALTH_LIMITS.CALORIES_MAX} kcal` }
        }
      }
    });

  } catch (error) {
    console.error("Erreur chargement des charts :", error.message);
    alert("Impossible de charger les données des charts pour le moment.");
  }
}

renderCharts();
