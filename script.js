import { pizzas } from "./pizzas.js";
import {
  menu,
  cartModal,
  cartFooter,
  closeModalCart,
  cartCount,
  adressInput,
  inputWarnMessage,
  totalPayment,
  finallyOrder,
  cartContainer,
} from "./elements.js";

let cart = [];

//function open modal
function openModal() {
  cartModal.style.display = "flex";
}
//function close modal
function closeModal() {
  cartModal.style.display = "none";
}
cartFooter.addEventListener("click", openModal);
// Close modal where clicked get out
cartModal.addEventListener("click", (event) => {
  if (event.target === cartModal) {
    closeModal();
  }
});

// close modal in press button 'close'
closeModalCart.addEventListener("click", closeModal);

//List pizzas
pizzas.map((pizza) => {
  const div = document.createElement("div");
  div.innerHTML = `
  <div
  class="bg-white px-5 py-6 sm:flex sm:flex-row sm:gap-6 sm:w-[600px] md:flex md:gap-6"
  id="menu-card-pizza" data-key="">
  <img src="${pizza.images}" alt=""
    class="w-full sm:max-w-[245px] sm:max-h-[249px] md:max-w-[300px] md:max-h-[250px]"
  />
  <div class="grid gap-5 mt-5">
    <p class="font-oswald text-2xl sm:text-3xl" data-name="">${pizza.name}</p>
    <p class="italic">${pizza.description}</p>
    <p
      class="price text-orange-600 font-bold text-lg"
      data-price=""
    >
      ${formatPrices(pizza.price)}
    </p>
    <button
      class="add-to-cart-btn bg-gray-400 px-1 py-2 w-60 hover:bg-gray-300 duration-200" data-product-id="${
        pizza.id
      }">
      ADICIONAR A CARRINHO
    </button>
  </div>
</div>
  `;
  menu.appendChild(div);
});

//receive information when clicking button add to cart
const addItemCartList = document.querySelectorAll(".add-to-cart-btn");
addItemCartList.forEach((item) => {
  item.addEventListener("click", (event) => {
    let productId = event.target.dataset.productId;
    let currentProduct = pizzas.find((pizza) => pizza.id == productId);
    addToCart(currentProduct);
  });
});

//adding items to cart
function addToCart(product) {
  const existingItemIndex = cart.findIndex((pizza) => pizza.id === product.id);
  if (existingItemIndex !== -1) {
    cart[existingItemIndex].quantity += 1; // Incrementa a quantidade se o item já estiver no carrinho
  } else {
    const newCartItem = {
      ...product,
      quantity: 1,
    };
    cart.push(newCartItem);
  }
  updatCartModal();
}

//listing items and updating display
function updatCartModal() {
  cartContainer.innerHTML = ``;
  cart.map((item) => {
    let cartItemElement = document.createElement("div");
    cartItemElement.innerHTML = `
      <div class="grid gap-6" >
        <div class="flex flex-row items-center justify-between gap-5 bg-gray-200 px-4 py-3 rounded-md mt-3" id="cart-items">
          <img
            src="${item.images}"
            alt=""
            class="h-16 w-16 rounded-md sm:h-24 sm:w-28"
          />
          <div class="">
            <p class="text-orange-400 font-bold text-sm">${item.name}</p>
            <p class="text-gray-500 font-bold text-xs">
              Andamento : <span class="text-green-700 font-bold">Pronto</span>
            </p>
            <p class="font-bold text-gray-500 mb-4 text-sm">
              Preço : ${item.price}
            </p>
            <div class="flex flex-row gap-4">
              <p class="font-bold text-gray-500 text-sm">
                Qtd: ${item.quantity}
              </p>
              <p class="font-bold text-gray-500 text-sm">
                Subtotal: 
              </p>
            </div>
          </div>
          <button
            class="bg-orange-500 hover:bg-orange-400 duration-200 rounded-md px-2 py-2"
            id="btn-remove-item-cart" data-remove-id="${item.id}"
          >
            Remover
          </button>
        </div>
      </div>
      `;
    cartContainer.append(cartItemElement);
  });
  const totalsObject = cart.reduce(
    (state, currentItem) => {
      state.totalQuantity += currentItem.quantity;
      state.totalValue += currentItem.quantity * currentItem.price;
      return state;
    },
    {
      totalQuantity: 0,
      totalValue: 0,
    }
  );
  totalPayment.innerText = `Total a pagar : ${formatPrices(
    totalsObject.totalValue
  )}`;
  cartCount.innerText = `(${totalsObject.totalQuantity})`;
}

// riceive information for delete item in the cart
cartContainer.addEventListener("click", (event) => {
  event.stopPropagation();
  const removeItemButton = event.target.getAttribute("id");

  if (removeItemButton.includes("btn-remove-item-cart")) {
    const productToDeleteIdentifier = event.target.dataset.removeId;
    const productItemId = cart.findIndex(
      (productDelete) => productDelete.id == productToDeleteIdentifier
    );
    if (productItemId !== -1) {
      const item = cart[productItemId];
      if (item.quantity > 1) {
        item.quantity -= 1;
        updatCartModal();
        return;
      } else {
        cart.splice(productItemId, 1);
        totalPayment.innerText = "Total a pagar : 0,00";
        updatCartModal();
        return;
      }
    }
  }
});

// validation if fields are empty and cart
finallyOrder.addEventListener("click", () => {
  const checkEmptyAdress = adressInput.value.trim();

  if (cart.length <= 0) {
    setToast("", "Seu carrinho está vazio, realize o seu pedido!", "#4169E1");
    setTimeout(() => {
      closeModal();
      resetCartItems();
    }, 1500);
    return;
  }
  if (!checkEmptyAdress) {
    setToast("#B22222", "Por favor, informe o endereço !", "#B22222");
    return;
  } else if (checkEmptyAdress) {
    setToast("#24a24a", "Pedido efetuado com sucesso !", "#24a24a");
    setTimeout(() => {
      closeModal();
      resetCartItems();
    }, 1500);
  }
});

function setToast(colorBorder, warnMessage, colorText) {
  inputWarnMessage.classList.remove("hidden");
  adressInput.style.border = `1px solid ${colorBorder}`;
  inputWarnMessage.innerText = `${warnMessage}`;
  inputWarnMessage.style.color = `${colorText}`;
}

function resetCartItems() {
  cart = [];
  cartCount.innerHTML = `(${0})`;
  adressInput.value = "";
  setToast("none", "", "#ccc");
  updatCartModal();
}

function formatPrices(price) {
  return price.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });
}
