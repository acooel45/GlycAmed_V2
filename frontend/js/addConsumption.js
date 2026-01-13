import { CONFIG } from "./constants.js";

const input = document.getElementById("product");
const resultsBox = document.getElementById("autocomplete-results");
const spinner = document.getElementById("loading-spinner");

let searchTimeout = null;
let selectedProduct = null;

input.addEventListener("input", () => triggerSearch());
input.addEventListener("focus", () => triggerSearch());

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
        const response = await fetch(
            `${CONFIG.API_URL}/products/search?name=${encodeURIComponent(query)}`
        );

        const products = await response.json();
        displayResults(products);

    } catch (error) {
        console.error("Erreur recherche :", error);
    } finally {
        spinner.style.display = "none";
    }
}

function displayResults(products) {
    resultsBox.innerHTML = "";

    if (products.length === 0) {
        resultsBox.style.display = "none";
        return;
    }

    products.forEach(p => {
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
    const quantity = parseInt(document.getElementById("quantity").value);
    const consumedAt = document.getElementById("datetime").value || Date.now();

    if (!productName || !quantity) {
        alert("Veuillez remplir au moins le produit et la quantité !");
        return;
    }

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user._id) {
        alert("Utilisateur non connecté.");
        return;
    }

    const payload = {
        contributorId: user._id,
        productName: productName,
        barcode: selectedProduct?.barcode || null,
        quantityMl: quantity,
        nutrients: selectedProduct?.nutrients || {
            sugar: 0,
            caffeine: 0,
            calories: 0
        },
        consumedAt: consumedAt
    };

    try {
        const response = await fetch("http://localhost:3000/api/consumption/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            alert("Consommation ajoutée !");
            form.reset();
            resultsBox.style.display = "none";

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);
        } else {
            alert(data.message || "Erreur lors de l'ajout");
        }

    } catch (err) {
        console.error("Erreur POST consommation :", err);
        alert("Erreur réseau, veuillez réessayer");
    }
});