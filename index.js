const API_URL = "https://striveschool-api.herokuapp.com/api/product/";
const AUTH_HEADERS = {
    headers: {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2FmNGIyNTY2MDNmZTAwMTU2NWY4Y2QiLCJpYXQiOjE3Mzk1NDEzMzksImV4cCI6MTc0MDc1MDkzOX0.SugeIZh2WqGrQZkv2mTK0Mkz0ylYLEltMwb49ft3zQU"
    }
};

// Funzione per recuperare i prodotti 
async function fetchProducts() {
    try {
        const response = await fetch(API_URL, AUTH_HEADERS);
        if (!response.ok) {
            throw new Error("Errore nel recupero dei prodotti");
        }
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error("Errore:", error);
    }
}

// Funzione per mostrare i prodotti nel DOM
function displayProducts(products) {
    const productContainer = document.getElementById("products-list");
    productContainer.innerHTML = "";

    products.forEach(product => {
        const productCard = `
            <div class="col-md-4 p-3">
                <div class="card shadow-sm">
                    <img src="${product.imageUrl}" class="card-img-top" style="height: 300px;" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="text-primary fw-bold">${product.price} €</p>
                        <a href="prodotto.html?id=${product._id}" class="btn btn-outline-primary">Dettagli</a>
                    </div>
                </div>
            </div>
        `;
        productContainer.innerHTML += productCard;
    });
}

// Funzione per la ricerca
function setupSearch() {
    const searchForm = document.getElementById("searchForm");
    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const searchTerm = document.getElementById("searchInput").value.toLowerCase();
        fetchProducts().then(() => {
            const products = document.querySelectorAll(".card");
            products.forEach(card => {
                const title = card.querySelector(".card-title").innerText.toLowerCase();
                card.style.display = title.includes(searchTerm) ? "block" : "none";
            });
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
    setupSearch();
});
