const API_URL = "https://striveschool-api.herokuapp.com/api/product/";
const AUTH_HEADERS = {
    headers: {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2FmNGIyNTY2MDNmZTAwMTU2NWY4Y2QiLCJpYXQiOjE3Mzk1NDEzMzksImV4cCI6MTc0MDc1MDkzOX0.SugeIZh2WqGrQZkv2mTK0Mkz0ylYLEltMwb49ft3zQU"
    }
};

// Recupera l'ID del prodotto dalla query string
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

// Carica il prodotto all'avvio della pagina
if (productId) {
    fetchProduct(productId);
} else {
    document.getElementById("productContainer").innerHTML = "<h2 class='text-center text-danger'>Prodotto non trovato!</h2>";
}

// Funzione per recuperare il prodotto dall'API e visualizzarlo
async function fetchProduct(id) {
    try {
        const response = await fetch(`${API_URL}${id}`, AUTH_HEADERS);
        if (!response.ok) {
            throw new Error("Errore nel recupero del prodotto");
        }
        const product = await response.json();
        displayProduct(product);
    } catch (error) {
        console.error("Errore:", error);
        document.getElementById("productContainer").innerHTML = "<h2 class='text-center text-danger'>Errore nel caricamento del prodotto.</h2>";
    }
}

// Funzione per mostrare il prodotto nella pagina
function displayProduct(product) {
    document.getElementById("productImage").src = product.imageUrl;
    document.getElementById("productImage").alt = product.name;
    document.getElementById("productName").innerText = product.name;
    document.getElementById("productDescription").innerText = product.description;
    document.getElementById("productBrand").innerText = `Brand: ${product.brand}`;
    document.getElementById("productPrice").innerText = `Prezzo: ${product.price} €`;
}