// Product catalogue: replace names, prices, categories, and images with your real stock.
const WHATSAPP_NUMBER = "92335742135"; // Pakistan country code +92, without the leading 0.
const products = [
  {id:1,name:"Everyday Classic Tee",category:"Men",price:1299,oldPrice:1599,badge:"BESTSELLER",image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85",alt:"Classic white t-shirt"},
  {id:2,name:"Soft & Stylish Top",category:"Women",price:1799,oldPrice:0,badge:"NEW IN",image:"https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=700&q=85",alt:"Stylish women's fashion top"},
  {id:3,name:"Streetwear Hoodie",category:"Men",price:2499,oldPrice:2999,badge:"POPULAR",image:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=700&q=85",alt:"Casual hoodie"},
  {id:4,name:"Chic Everyday Outfit",category:"Women",price:2899,oldPrice:0,badge:"JUST ADDED",image:"https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=85",alt:"Modern everyday fashion"},
  {id:5,name:"Classic Carry Bag",category:"Accessories",price:1999,oldPrice:2299,badge:"FAVOURITE",image:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=85",alt:"Classic fashion handbag"},
  {id:6,name:"Everyday Sneakers",category:"Accessories",price:3499,oldPrice:0,badge:"FRESH PICK",image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85",alt:"Red casual sneakers"}
];
const cart = new Map();
const $ = (selector) => document.querySelector(selector);
const money = (amount) => "Rs. " + amount.toLocaleString("en-PK");
let toastTimer;

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}
function renderProducts(category = "All") {
  const shown = category === "All" ? products : products.filter(p => p.category === category);
  $("#productGrid").innerHTML = shown.map(p => `
    <article class="product-card">
      <div class="product-image">
        <img src="${p.image}" alt="${p.alt}" loading="lazy">
        <span class="product-badge">${p.badge}</span>
        <button class="quick-add" data-add="${p.id}" aria-label="Add ${p.name} to bag">+</button>
      </div>
      <div class="product-info">
        <span class="product-category">${p.category}</span>
        <h3>${p.name}</h3>
        <div class="product-bottom">
          <div><span class="price">${money(p.price)}</span>${p.oldPrice ? `<span class="old-price">${money(p.oldPrice)}</span>` : ""}</div>
          <span class="stars" aria-label="Featured product">★★★★★</span>
        </div>
      </div>
    </article>`).join("");
}
function addToCart(id) {
  cart.set(id, (cart.get(id) || 0) + 1);
  updateCart();
  showToast("Added to your bag ♡");
}
function updateCart() {
  const count = [...cart.values()].reduce((sum, qty) => sum + qty, 0);
  const total = [...cart.entries()].reduce((sum, [id, qty]) => sum + products.find(p => p.id === id).price * qty, 0);
  $("#cartCount").textContent = count;
  $("#cartTotal").textContent = money(total);
  $("#checkoutButton").disabled = count === 0;
  if (count === 0) {
    $("#cartItems").innerHTML = '<div class="empty-cart">Your bag is waiting for something lovely. ♡<br>Explore the collection and add your favourites.</div>';
    return;
  }
  $("#cartItems").innerHTML = [...cart.entries()].map(([id, qty]) => {
    const p = products.find(item => item.id === id);
    return `<div class="cart-item">
      <img src="${p.image}" alt="${p.alt}">
      <div><h3>${p.name}</h3><p>${money(p.price)}</p>
        <div class="qty-control"><button data-qty="${id}" data-change="-1" aria-label="Decrease quantity">−</button><span>${qty}</span><button data-qty="${id}" data-change="1" aria-label="Increase quantity">+</button></div>
      </div>
      <button class="remove-item" data-remove="${id}" aria-label="Remove ${p.name}">✕</button>
    </div>`;
  }).join("");
}
function openCart() {
  $("#cartOverlay").hidden = false;
  document.body.style.overflow = "hidden";
  $("#cartClose").focus();
}
function closeCart() {
  $("#cartOverlay").hidden = true;
  document.body.style.overflow = "";
  $("#cartOpen").focus();
}
function whatsappUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

$("#productGrid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});
document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    renderProducts(button.dataset.filter);
  });
});
$("#cartOpen").addEventListener("click", openCart);
$("#cartClose").addEventListener("click", closeCart);
$("#cartDismiss").addEventListener("click", closeCart);
document.addEventListener("keydown", event => { if (event.key === "Escape" && !$("#cartOverlay").hidden) closeCart(); });
$("#cartItems").addEventListener("click", event => {
  const qtyButton = event.target.closest("[data-qty]");
  const removeButton = event.target.closest("[data-remove]");
  if (qtyButton) {
    const id = Number(qtyButton.dataset.qty);
    const next = (cart.get(id) || 0) + Number(qtyButton.dataset.change);
    if (next <= 0) cart.delete(id); else cart.set(id, next);
    updateCart();
  }
  if (removeButton) { cart.delete(Number(removeButton.dataset.remove)); updateCart(); }
});
$("#checkoutButton").addEventListener("click", () => {
  if (cart.size === 0) return;
  const lines = [...cart.entries()].map(([id, qty]) => {
    const p = products.find(item => item.id === id);
    return `• ${p.name} × ${qty} — ${money(p.price * qty)}`;
  });
  const total = [...cart.entries()].reduce((sum, [id, qty]) => sum + products.find(p => p.id === id).price * qty, 0);
  const message = `Assalam-o-Alaikum! I'd like to ask about an order from Mujeeb & Brother's Shop:\n\n${lines.join("\n")}\n\nEstimated total: ${money(total)}\nPlease confirm availability, sizes, and delivery details.`;
  window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
});
$("#contactWhatsApp").href = whatsappUrl("Assalam-o-Alaikum! I'd like to ask about clothing and fashion products from Mujeeb & Brother's Shop.");
$("#menuToggle").addEventListener("click", () => {
  const open = $("#mainNav").classList.toggle("open");
  $("#menuToggle").setAttribute("aria-expanded", String(open));
  $("#menuToggle").setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  $("#menuToggle").textContent = open ? "✕" : "☰";
});
document.querySelectorAll("#mainNav a").forEach(link => link.addEventListener("click", () => {
  $("#mainNav").classList.remove("open");
  $("#menuToggle").setAttribute("aria-expanded", "false");
  $("#menuToggle").setAttribute("aria-label", "Open navigation");
  $("#menuToggle").textContent = "☰";
}));
$("#year").textContent = new Date().getFullYear();
renderProducts();
updateCart();
