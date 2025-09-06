
const cart = document.querySelector(".cart");
const backdrop = document.querySelector(".cart__backdrop");
const openCartBtn = document.querySelector(".header__carrito");
const closeCartBtn = document.querySelector(".cart__close");
const itemsContainer = document.querySelector(".cart__items");
const totalPriceEl = document.querySelector(".cart__total-price");
const clearBtn = document.querySelector(".cart__clear");

// Productos
const addToCartBtns = document.querySelectorAll(".products__btn");

//badge
const cartBadgeEl = document.querySelector(".header__badge");

let cartItems = [];
let total = 0;

function updateBadge() {
  const count = cartItems.length;

  cartBadgeEl.textContent = count;
  if (count > 0) {
    cartBadgeEl.classList.add("is-visible");
  } else {
    cartBadgeEl.classList.remove("is-visible");
  }
}

// --- Funciones ---
function openCart() {
  cart.classList.add("is-open");
  backdrop.removeAttribute("hidden");
}

function closeCart() {
  cart.classList.remove("is-open");
  backdrop.setAttribute("hidden", true);
}

function updateCart() {

  itemsContainer.innerHTML = "";

  cartItems.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("cart__item");
    div.innerHTML = `
      <img src="${item.img}" class="cart__thumb" alt="${item.title}">
      <div class="cart__meta">
        <p>${item.title}</p>
        <strong>${item.price}</strong>
      </div>
    `;
    itemsContainer.appendChild(div);
  });

  totalPriceEl.textContent = `$${total.toFixed(2)}`;
}

function addToCart(e) {
  const card = e.target.closest(".products__card");
  const title = card.querySelector(".products__title").textContent;
  const price = parseFloat(
    card.querySelector(".products__price").textContent.replace("$", "").replace(",", "")
  );
  const img = card.querySelector(".products__img").src;

  cartItems.push({ title, price, img });
  total += price;

  updateCart();
  updateBadge();
  openCart();
}

function clearCart() {
  cartItems = [];
  total = 0;
  updateCart();
  updateBadge();
  closeCart();
}

// --- Eventos ---
openCartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
backdrop.addEventListener("click", closeCart);
clearBtn.addEventListener("click", clearCart);

addToCartBtns.forEach(btn => btn.addEventListener("click", addToCart));


const menu = document.querySelector(".menu");
const menuBackdrop = document.querySelector(".menu__backdrop");
const openMenuBtn = document.querySelector(".header__btn");
const closeMenuBtn = document.querySelector(".menu__close");

function openMenu() {
  menu.classList.add("is-open");
  menuBackdrop.removeAttribute("hidden");
}

function closeMenu() {
  menu.classList.remove("is-open");
  menuBackdrop.setAttribute("hidden", true);
}

openMenuBtn.addEventListener("click", openMenu);
closeMenuBtn.addEventListener("click", closeMenu);
menuBackdrop.addEventListener("click", closeMenu);

// To pay
const payBtn = document.querySelector(".cart__pay");

function handlePay() {

  if (cartItems.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  const piezas = cartItems.length;
  const ok = confirm(`Vas a pagar $${total.toFixed(2)} MXN por ${piezas} producto(s). ¿Confirmas?`);
  if (!ok) return;

  payBtn.disabled = true;

  const order = {
    id: "SO-" + Date.now(),
    items: cartItems,
    total,
    date: new Date().toISOString(),
  };

  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));
  localStorage.setItem("lastOrder", JSON.stringify(order));

  alert(`¡Gracias! Tu pedido ${order.id} fue realizado.`);

  clearCart();
  payBtn.disabled = false;
}

payBtn.addEventListener("click", handlePay);



// --- Selección buscador ---
const searchInput = document.querySelector(".products__search");

function filterProducts() {
  const query = searchInput.value.toLowerCase().trim();

  document.querySelectorAll(".products__card").forEach(card => {
    const title = card.querySelector(".products__title").textContent.toLowerCase();

    // si incluye el texto buscado, se muestra, si no se oculta
    if (title.includes(query)) {
      card.style.display = "flex"; // mantiene el flex para las cards
    } else {
      card.style.display = "none";
    }
  });
}

searchInput.addEventListener("input", filterProducts);





const noResults = document.createElement("p");
noResults.textContent = "No se encontraron productos 😢";
noResults.className = "products__no-results";
noResults.style.display = "none";
document.querySelector(".products").appendChild(noResults);

function filterProducts() {
  const query = searchInput.value.toLowerCase().trim();
  let matches = 0;

  document.querySelectorAll(".products__card").forEach(card => {
    const title = card.querySelector(".products__title").textContent.toLowerCase();
    if (title.includes(query)) {
      card.style.display = "flex";
      matches++;
    } else {
      card.style.display = "none";
    }
  });

  noResults.style.display = matches === 0 ? "block" : "none";
}
