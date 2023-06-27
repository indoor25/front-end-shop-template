/* eslint-disable no-useless-return */
const timer = 1000
const contentContainer = document.getElementById('content-container')
const counterLabel = document.getElementById('cart-counter-label')
const cartBase = new Map()
const productBtn = document.querySelectorAll('.item-actions__cart')
const shopCart = document.querySelector('.page-header__cart-btn')
const bodyCart = document.querySelector('.modal-body')
const btnClearCart = document.querySelector('.btn__clear-cart')

let counterCart = 0
let totalPrice = 0

shopCart.dataset.toggle = 'modal'
shopCart.dataset.target = '#cart-modal'
const viewCounterCart = (countLabel, count) => {
  if (counterCart) {
    countLabel.style.display = 'block'
    countLabel.innerText = count
  } else {
    countLabel.style.display = 'none'
    countLabel.innerText = count
  }
}
// change text in button "ADD TO CART"
const changeTxtBtn = (target, prodName) => {
  const sumProduct = cartBase.get(prodName)
  target.innerText = `ADDED ${sumProduct.sumProd.toFixed(2)}`

  setTimeout(() => {
    target.innerHTML = 'Add to cart <i class="fas fa-shopping-cart" aria-hidden="true"></i>'
  }, timer)
}

// button disabled
function btnDisabled() {
  productBtn.forEach(el => {
    el.disabled = true
  })
  setTimeout(() => {
    productBtn.forEach(el => {
      el.disabled = false
    })
  }, timer)
}

// set total price
function setTotalPrice() {
  totalPrice = 0
  for (const el of cartBase.values()) {
    totalPrice += el.sumProd
  }
}

function emptyBodyCart() {
  bodyCart.innerHTML = ''
}

// add product in base
function addBase(productName, productPrice) {
  if (cartBase.has(productName)) {
    const cartInfo = cartBase.get(productName)
    cartInfo.counter++
    cartInfo.sumProd += productPrice
    cartBase.set(productName, cartInfo)
  } else {
    const count = 1
    cartBase.set(productName, {
      name: productName,
      counter: count,
      price: productPrice,
      sumProd: productPrice,
    })
  }
  setTotalPrice()
}

function getCounterCart() {
  counterCart = 0
  for (const el of cartBase.values()) {
    counterCart += el.counter
  }
}

// button click actions ADD TO CART
function clickBtnHandler(e) {
  const { target } = e
  if (typeof target !== 'object') return
  if (!target.classList.contains('item-actions__cart')) return
  const productName = target.closest('.container-fluid')
    .querySelector('.item-title').innerText
  const productPrice = +target.closest('.container-fluid')
    .querySelector('.item-price')
    .innerHTML
    .replace(/^\S([0-9]*)\s\D*([0-9]*).*/, '$1.$2')
  addBase(productName, productPrice)
  changeTxtBtn(target, productName)
  getCounterCart()
  viewCounterCart(counterLabel, counterCart)
  btnDisabled()
}

// delete element in Cart
function delElemCart(target) {
  let currentElement
  // eslint-disable-next-line prefer-const
  currentElement = target.closest('.wrapper__product')
    .querySelector('.clear__btn').dataset.value
  cartBase.delete(currentElement)
  setTotalPrice()
  emptyBodyCart()
  getCounterCart()
  viewCounterCart(counterLabel, counterCart)
}

// create info cart in modal window
function getCartInfo() {
  if (cartBase.size > 0) {
    const prodTotalSum = document.createElement('div')
    prodTotalSum.setAttribute('class', 'cart__total-sum')
    prodTotalSum.innerHTML = `Всего товаров на сумму: ${totalPrice.toFixed(2)}$`
    for (const el of cartBase.values()) {
      const productWrapper = document.createElement('div')
      productWrapper.setAttribute('class', 'wrapper__product')
      productWrapper.innerHTML = `<div class="name__product">${el.name}</div>
                      <div class="product__counter">${el.counter}шт</div>
                      <div class="product__price">цена: ${el.price.toFixed(2)}$</div>
                      <div class="product__sum">сумма: ${el.sumProd.toFixed(2)}$</div>`
      const btnDelProduct = document.createElement('button')
      btnDelProduct.type = 'submit'
      btnDelProduct.dataset.value = `${el.name}`
      btnDelProduct.classList.add('clear__btn')
      btnDelProduct.innerHTML = 'X'
      btnDelProduct.addEventListener('click', delProduct)
      bodyCart.append(productWrapper)
      productWrapper.append(btnDelProduct)
    }
    bodyCart.append(prodTotalSum)
  } else {
    const emptyCart = document.createElement('div')
    emptyCart.setAttribute('class', 'wrapper__product')
    emptyCart.innerHTML = 'Корзина пуста'
    bodyCart.append(emptyCart)
  }
}

// remove product in cart
function delProduct(e) {
  const { target } = e
  if (target) {
    delElemCart(target)
    getCartInfo()
  }
}

function cartClear() {
  cartBase.clear()
  emptyBodyCart()
  getCartInfo()
  getCounterCart()
  viewCounterCart(counterLabel, counterCart)
}

// Click action on the Cart icon
function cartHandler(e) {
  const { target } = e
  if (target) {
    getCartInfo()
  }
}

contentContainer.addEventListener('click', clickBtnHandler)
shopCart.addEventListener('click', cartHandler)
btnClearCart.addEventListener('click', cartClear)
$('#cart-modal')
  .on('hidden.bs.modal', () => {
    emptyBodyCart()
  })
