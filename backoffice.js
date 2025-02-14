const API_URL = "https://striveschool-api.herokuapp.com/api/product/";
const AUTH_HEADERS = {
    headers: {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2FmNGIyNTY2MDNmZTAwMTU2NWY4Y2QiLCJpYXQiOjE3Mzk1NDEzMzksImV4cCI6MTc0MDc1MDkzOX0.SugeIZh2WqGrQZkv2mTK0Mkz0ylYLEltMwb49ft3zQU",
        "Content-Type": "application/json"
    }
};

// Recuper ID del prodotto dalla URL (se presente)
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

document.addEventListener("DOMContentLoaded", () => {
    if (productId) {
        loadProduct(productId);
        document.getElementById("deleteProduct").classList.remove("d-none");
    }
    setupFormListener();
});

// Funzione per caricare i dettagli di un prodotto nel form
async function loadProduct(id) {
    try {
        const response = await fetch(`${API_URL}${id}`, AUTH_HEADERS);
        const product = await response.json();
        populateForm(product);
    } catch (error) {
        console.error("Errore nel caricamento del prodotto:", error);
    }
}

// Popola i campi del form con i dettagli del prodotto
function populateForm(product) {
    document.getElementById("productName").value = product.name;
    document.getElementById("productDescription").value = product.description;
    document.getElementById("productBrand").value = product.brand;
    document.getElementById("productImage").value = product.imageUrl;
    document.getElementById("productPrice").value = product.price;
}

// Funzione per inviare i dati del prodotto all'API (Crea o Modifica)
async function saveProduct(event) {
    event.preventDefault();
    
    const productData = {
        name: document.getElementById("productName").value,
        description: document.getElementById("productDescription").value,
        brand: document.getElementById("productBrand").value,
        imageUrl: document.getElementById("productImage").value,
        price: parseFloat(document.getElementById("productPrice").value)
    };

    const method = productId ? "PUT" : "POST";
    const url = productId ? `${API_URL}${productId}` : API_URL;

    try {
        await fetch(url, {
            method,
            headers: AUTH_HEADERS.headers,
            body: JSON.stringify(productData)
        });
        alert(`Prodotto ${productId ? "modificato" : "creato"} con successo!`);
        window.location.href = "index.html";
    } catch (error) {
        console.error("Errore nel salvataggio del prodotto:", error);
    }
}

// Funzione per eliminare un prodotto
async function deleteProduct() {
    if (!productId) return;
    if (!confirm("Sei sicuro di voler eliminare questo prodotto?")) return;

    try {
        await fetch(`${API_URL}${productId}`, {
            method: "DELETE",
            headers: AUTH_HEADERS.headers
        });
        alert("Prodotto eliminato con successo!");
        window.location.href = "index.html";
    } catch (error) {
        console.error("Errore nell'eliminazione del prodotto:", error);
    }
}

function setupFormListener() {
    document.getElementById("productForm").addEventListener("submit", saveProduct);
    document.getElementById("deleteProduct").addEventListener("click", deleteProduct);
}


// Funzione per visualizzare i prodotti nella lista del backoffice
function displayProductList(products) {
    const productList = document.getElementById("productList");
    productList.innerHTML = ""; 

    if (products.length === 0) {
        productList.innerHTML = "<p class='text-muted'>Nessun prodotto disponibile.</p>";
        return;
    }

    products.forEach(product => {
        const productItem = `
            <div class="col-md-4">
                <div class="card mb-3 shadow-sm">
                    <img src="${product.imageUrl}" class="card-img-top" style="height: 300px; alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="text-primary fw-bold">${product.price} €</p>
                        <a href="backoffice.html?id=${product._id}" class="btn btn-warning btn-sm">Modifica</a>
                        <button class="btn btn-danger btn-sm" onclick="deleteProductById('${product._id}')">Elimina</button>
                    </div>
                </div>
            </div>
        `;
        productList.innerHTML += productItem;
    });
}

// Funzione per eliminare un prodotto 
async function deleteProductById(productId) {
    if (!confirm("Sei sicuro di voler eliminare questo prodotto?")) return;

    try {
        const response = await fetch(`${API_URL}${productId}`, {
            method: "DELETE",
            headers: AUTH_HEADERS.headers
        });

        if (!response.ok) throw new Error("Errore nell'eliminazione");

        alert("Prodotto eliminato con successo!");
        loadProducts(); // Ricarico lista post eliminazione
    } catch (error) {
        console.error("Errore nell'eliminazione del prodotto:", error);
        alert("Impossibile eliminare il prodotto.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
});




// Funzione per caricare tutti i prodotti e mostrarli nella lista
async function loadProducts() {
    try {
        const response = await fetch(API_URL, AUTH_HEADERS);
        if (!response.ok) throw new Error("Errore nel recupero dei prodotti");
        
        const products = await response.json();
        displayProductList(products);
    } catch (error) {
        console.error("Errore nel caricamento dei prodotti esistenti:", error);
        document.getElementById("productList").innerHTML = "<p class='text-danger'>Impossibile caricare i prodotti.</p>";
    }
}

