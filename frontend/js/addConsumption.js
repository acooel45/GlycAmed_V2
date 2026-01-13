import ApiService from "./api.js";

const input = document.getElementById("product");
const resultsBox = document.getElementById("autocomplete-results");
const spinner = document.getElementById("loading-spinner");

let searchTimeout = null;
let selectedProduct = null;

input.addEventListener("input", triggerSearch);
input.addEventListener("focus", triggerSearch);

function triggerSearch() {
  const query = input.value.trim();

  if (query.length < 2) {
    resultsBox.style.display = "none";
    spinner.style.display = "none";
    return;
  }

  clearTimeout(searchTimeout);
  spinner.style.display = "block";
  searchTimeout = setTimeout(() => searchProducts(query), 300);
}

async function searchProducts(query) {
  try {
    const products = await ApiService.get(
      `/products/search?name=${encodeURIComponent(query)}`
    );

    displayResults(products);
  } catch (error) {
    console.error("Erreur recherche :", error.message);
  } finally {
    spinner.style.display = "none";
  }
}

function displayResults(products = []) {
  resultsBox.innerHTML = "";

  if (products.length === 0) {
    resultsBox.style.display = "none";
    return;
  }

  products.forEach((p) => {
    const div = document.createElement("div");
    div.className = "autocomplete-item";
    div.textContent = p.name;

    div.addEventListener("click", () => {
      input.value = p.name;
      selectedProduct = p;
      resultsBox.style.display = "none";
    });

    resultsBox.appendChild(div);
  });

  resultsBox.style.display = "block";
}

document.addEventListener("click", (e) => {
  if (!e.target.closest(".autocomplete-container")) {
    resultsBox.style.display = "none";
  }
});

const form = document.querySelector(".consumption-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const productName = input.value.trim();
  const quantity = parseInt(
    document.getElementById("quantity").value,
    10
  );
  const consumedAt =
    document.getElementById("datetime").value || Date.now();

  if (!productName || !quantity) {
    alert("Veuillez remplir au moins le produit et la quantité !");
    return;
  }

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user?._id) {
    alert("Utilisateur non connecté.");
    return;
  }

  const payload = {
    contributorId: user._id,
    productName,
    barcode: selectedProduct?.barcode ?? null,
    quantityMl: quantity,
    nutrients: selectedProduct?.nutrients ?? {
      sugar: 0,
      caffeine: 0,
      calories: 0,
    },
    consumedAt,
  };

  try {
    await ApiService.post("/consumption/add", payload);

    alert("Consommation ajoutée !");
    form.reset();
    resultsBox.style.display = "none";

    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);
  } catch (error) {
    console.error("Erreur ajout consommation :", error.message);
    alert(error.message || "Erreur réseau, veuillez réessayer");
  }
});
